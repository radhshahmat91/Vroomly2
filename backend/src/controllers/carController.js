const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/apiError');
const Car = require('../models/Car');
const User = require('../models/User');
const { isCarAvailable, getUnavailableRanges } = require('../utils/availability');

const PAGE_SIZE = 12;

/**
 * GET /api/cars
 * Public search & filter. Supports brand, city, price range, seats,
 * fuelType, transmission, a date range (excludes cars already booked for
 * those dates), free-text search, geo radius search (lat/lng/radiusKm),
 * pagination and sorting. Only approved + active listings are returned.
 */
const listCars = asyncHandler(async (req, res) => {
  const {
    brand,
    city,
    minPrice,
    maxPrice,
    seats,
    fuelType,
    transmission,
    category,
    q,
    startDate,
    endDate,
    lat,
    lng,
    radiusKm,
    sort,
    page = 1,
    limit = PAGE_SIZE,
  } = req.query;

  const filter = { isApproved: true, isActive: true };

  if (brand) filter.brand = new RegExp(`^${escapeRegex(brand)}$`, 'i');
  if (city) filter['location.city'] = new RegExp(escapeRegex(city), 'i');
  if (category) filter.category = category;
  if (fuelType) filter.fuelType = fuelType;
  if (transmission) filter.transmission = transmission;
  if (seats) filter.seats = { $gte: Number(seats) };
  if (minPrice || maxPrice) {
    filter.pricePerDay = {};
    if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
    if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
  }
  if (q) filter.$text = { $search: q };

  let query = Car.find(filter).populate('owner', 'name avatar createdAt');

  // Geo radius search takes priority over the plain city text filter when
  // both are supplied, since it's strictly more precise.
  if (lat && lng) {
    query = Car.find({
      ...filter,
      'location.coordinates': {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
          $maxDistance: (Number(radiusKm) || 25) * 1000,
        },
      },
    }).populate('owner', 'name avatar createdAt');
  }

  const sortMap = {
    price_asc: { pricePerDay: 1 },
    price_desc: { pricePerDay: -1 },
    rating: { ratingAvg: -1 },
    newest: { createdAt: -1 },
  };
  if (!lat && sortMap[sort]) query = query.sort(sortMap[sort]);

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(48, Number(limit) || PAGE_SIZE);

  const [cars, total] = await Promise.all([
    query.clone().skip((pageNum - 1) * limitNum).limit(limitNum),
    Car.countDocuments(query.getFilter()),
  ]);

  let filtered = cars;

  // Availability filtering happens in application code (not the DB query)
  // since it depends on the Booking collection, not the Car document.
  if (startDate && endDate) {
    const checks = await Promise.all(cars.map((c) => isCarAvailable(c, startDate, endDate)));
    filtered = cars.filter((_, i) => checks[i]);
  }

  res.json({
    success: true,
    count: filtered.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    cars: filtered,
  });
});

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// GET /api/cars/:id
const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id).populate('owner', 'name avatar phone createdAt');
  if (!car) throw new ApiError(404, 'Car not found');
  res.json({ success: true, car });
});

// GET /api/cars/:id/availability
const getCarAvailability = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) throw new ApiError(404, 'Car not found');
  const ranges = await getUnavailableRanges(car);
  res.json({ success: true, unavailable: ranges });
});

// GET /api/cars/:id/similar
const getSimilarCars = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) throw new ApiError(404, 'Car not found');
  const similar = await Car.find({
    _id: { $ne: car._id },
    isApproved: true,
    isActive: true,
    $or: [{ brand: car.brand }, { category: car.category }, { 'location.city': car.location.city }],
  })
    .limit(6)
    .populate('owner', 'name avatar');
  res.json({ success: true, cars: similar });
});

// POST /api/cars  (owner)
const createCar = asyncHandler(async (req, res) => {
  const owner = await User.findById(req.user._id);
  if (!owner.isOwnerApproved) {
    throw new ApiError(
      403,
      'Your host account is still awaiting admin approval. You can list vehicles once approved.'
    );
  }

  const payload = { ...req.body, owner: req.user._id, isApproved: false };
  if (req.body.lat && req.body.lng) {
    payload.location = {
      ...req.body.location,
      coordinates: { type: 'Point', coordinates: [Number(req.body.lng), Number(req.body.lat)] },
    };
  }

  const car = await Car.create(payload);
  res.status(201).json({ success: true, car });
});

// PUT /api/cars/:id  (owner, own car only)
const updateCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) throw new ApiError(404, 'Car not found');
  if (car.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only edit your own vehicles');
  }

  const editable = [
    'brand',
    'model',
    'year',
    'category',
    'pricePerDay',
    'discountWeeklyPercent',
    'discountMonthlyPercent',
    'seats',
    'fuelType',
    'transmission',
    'images',
    'features',
    'description',
    'isActive',
  ];
  editable.forEach((key) => {
    if (req.body[key] !== undefined) car[key] = req.body[key];
  });

  if (req.body.location) {
    car.location.address = req.body.location.address ?? car.location.address;
    car.location.city = req.body.location.city ?? car.location.city;
  }
  if (req.body.lat && req.body.lng) {
    car.location.coordinates = { type: 'Point', coordinates: [Number(req.body.lng), Number(req.body.lat)] };
  }

  // Any substantive edit sends the listing back through moderation so an
  // owner can't quietly change details on an already-approved listing.
  car.isApproved = false;
  car.rejectionReason = '';

  await car.save();
  res.json({ success: true, car, message: 'Saved — your changes will be visible after admin review.' });
});

// DELETE /api/cars/:id  (owner own, or admin)
const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) throw new ApiError(404, 'Car not found');
  const isOwnerOfCar = car.owner.toString() === req.user._id.toString();
  if (!isOwnerOfCar && req.user.role !== 'admin') {
    throw new ApiError(403, 'You cannot delete this listing');
  }
  await car.deleteOne();
  res.json({ success: true, message: 'Listing removed' });
});

// PUT /api/cars/:id/availability  (owner: replace the block list)
const setUnavailableDates = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) throw new ApiError(404, 'Car not found');
  if (car.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only manage your own vehicles');
  }
  const { unavailableDates } = req.body;
  if (!Array.isArray(unavailableDates)) throw new ApiError(400, 'unavailableDates must be an array');
  car.unavailableDates = unavailableDates;
  await car.save();
  res.json({ success: true, unavailableDates: car.unavailableDates });
});

// GET /api/cars/owner/mine  (owner: every listing regardless of status)
const getMyCars = asyncHandler(async (req, res) => {
  const cars = await Car.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, cars });
});

module.exports = {
  listCars,
  getCarById,
  getCarAvailability,
  getSimilarCars,
  createCar,
  updateCar,
  deleteCar,
  setUnavailableDates,
  getMyCars,
};
