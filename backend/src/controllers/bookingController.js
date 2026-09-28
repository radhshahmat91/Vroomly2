const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/apiError');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { isCarAvailable } = require('../utils/availability');
const { calculateBookingPrice } = require('../utils/pricing');
const { sendNotification } = require('../utils/notify');

const COMMISSION = Number(process.env.PLATFORM_COMMISSION_PERCENT) || 12;

/**
 * There's no cron job in this project — instead, any confirmed booking
 * whose end date has passed is lazily flipped to 'completed' the moment
 * it's next read. Simpler to reason about for a portfolio project, and
 * functionally identical from the user's point of view.
 */
async function autoCompletePastBookings(filter) {
  await Booking.updateMany(
    { ...filter, status: 'confirmed', endDate: { $lt: new Date() } },
    { $set: { status: 'completed' } }
  );
}

// POST /api/bookings
const createBooking = asyncHandler(async (req, res) => {
  const { carId, startDate, endDate } = req.body;

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (!(start < end)) throw new ApiError(400, 'End date must be after start date');
  if (start < new Date(new Date().toDateString())) {
    throw new ApiError(400, 'Start date cannot be in the past');
  }

  const car = await Car.findById(carId);
  if (!car || !car.isApproved || !car.isActive) throw new ApiError(404, 'Car not available');

  if (car.owner.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot book your own vehicle');
  }

  const available = await isCarAvailable(car, start, end);
  if (!available) throw new ApiError(409, 'This car is already booked for part of that date range');

  const pricing = calculateBookingPrice({
    pricePerDay: car.pricePerDay,
    startDate: start,
    endDate: end,
    discountWeeklyPercent: car.discountWeeklyPercent,
    discountMonthlyPercent: car.discountMonthlyPercent,
    commissionPercent: COMMISSION,
  });

  const booking = await Booking.create({
    car: car._id,
    renter: req.user._id,
    owner: car.owner,
    startDate: start,
    endDate: end,
    pricePerDay: car.pricePerDay,
    ...pricing,
  });

  await sendNotification({
    userId: car.owner,
    type: 'booking_request',
    title: 'New booking request',
    message: `${req.user.name} requested ${car.brand} ${car.model} for ${pricing.totalDays} day(s)`,
    link: '/owner/bookings',
  });

  res.status(201).json({ success: true, booking });
});

// GET /api/bookings/mine  (renter)
const getMyBookings = asyncHandler(async (req, res) => {
  await autoCompletePastBookings({ renter: req.user._id });
  const { status } = req.query;
  const filter = { renter: req.user._id };
  if (status) filter.status = status;

  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .populate({ path: 'car', select: 'brand model year images location licensePlate' })
    .populate({ path: 'owner', select: 'name avatar' });

  res.json({ success: true, bookings });
});

// GET /api/bookings/owner/requests  (owner)
const getOwnerBookings = asyncHandler(async (req, res) => {
  await autoCompletePastBookings({ owner: req.user._id });
  const { status } = req.query;
  const filter = { owner: req.user._id };
  if (status) filter.status = status;

  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .populate({ path: 'car', select: 'brand model year images licensePlate' })
    .populate({ path: 'renter', select: 'name avatar phone' });

  res.json({ success: true, bookings });
});

// GET /api/bookings/:id
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('car')
    .populate('renter', 'name avatar phone')
    .populate('owner', 'name avatar phone');
  if (!booking) throw new ApiError(404, 'Booking not found');

  const isParty =
    booking.renter._id.toString() === req.user._id.toString() ||
    booking.owner._id.toString() === req.user._id.toString();
  if (!isParty && req.user.role !== 'admin') throw new ApiError(403, 'Not authorized to view this booking');

  res.json({ success: true, booking });
});

// PUT /api/bookings/:id/accept  (owner)
const acceptBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('car');
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.owner.toString() !== req.user._id.toString()) throw new ApiError(403, 'Not your listing');
  if (booking.status !== 'pending') throw new ApiError(400, `Booking is already ${booking.status}`);

  booking.status = 'accepted';
  await booking.save();

  // Any other pending request on this car that overlaps these dates can
  // no longer be fulfilled — reject them and let those renters know why.
  const conflicting = await Booking.find({
    car: booking.car._id,
    _id: { $ne: booking._id },
    status: 'pending',
    startDate: { $lte: booking.endDate },
    endDate: { $gte: booking.startDate },
  });
  for (const other of conflicting) {
    other.status = 'rejected';
    other.rejectReason = 'These dates were booked by another renter';
    await other.save();
    await sendNotification({
      userId: other.renter,
      type: 'booking_rejected',
      title: 'Booking request declined',
      message: `Your request for ${booking.car.brand} ${booking.car.model} is no longer available for those dates`,
      link: '/dashboard/bookings',
    });
  }

  await sendNotification({
    userId: booking.renter,
    type: 'booking_accepted',
    title: 'Booking accepted!',
    message: `${booking.car.brand} ${booking.car.model} is reserved for you — complete payment to confirm.`,
    link: `/booking/${booking._id}/payment`,
  });

  res.json({ success: true, booking });
});

// PUT /api/bookings/:id/reject  (owner)
const rejectBooking = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const booking = await Booking.findById(req.params.id).populate('car');
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.owner.toString() !== req.user._id.toString()) throw new ApiError(403, 'Not your listing');
  if (booking.status !== 'pending') throw new ApiError(400, `Booking is already ${booking.status}`);

  booking.status = 'rejected';
  booking.rejectReason = reason || 'Declined by host';
  await booking.save();

  await sendNotification({
    userId: booking.renter,
    type: 'booking_rejected',
    title: 'Booking request declined',
    message: `Your request for ${booking.car.brand} ${booking.car.model} was declined`,
    link: '/dashboard/bookings',
  });

  res.json({ success: true, booking });
});

// PUT /api/bookings/:id/cancel  (renter or owner, before it's completed)
const cancelBooking = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const booking = await Booking.findById(req.params.id).populate('car');
  if (!booking) throw new ApiError(404, 'Booking not found');

  const isRenter = booking.renter.toString() === req.user._id.toString();
  const isOwner = booking.owner.toString() === req.user._id.toString();
  if (!isRenter && !isOwner) throw new ApiError(403, 'Not authorized to cancel this booking');
  if (!['pending', 'accepted', 'confirmed'].includes(booking.status)) {
    throw new ApiError(400, `A ${booking.status} booking cannot be cancelled`);
  }

  booking.status = 'cancelled';
  booking.cancelReason = reason || '';
  booking.cancelledBy = isRenter ? 'renter' : 'owner';
  if (booking.paymentStatus === 'paid') booking.paymentStatus = 'refunded';
  await booking.save();

  const notifyUserId = isRenter ? booking.owner : booking.renter;
  await sendNotification({
    userId: notifyUserId,
    type: 'booking_cancelled',
    title: 'Booking cancelled',
    message: `The booking for ${booking.car.brand} ${booking.car.model} was cancelled by the ${
      isRenter ? 'renter' : 'host'
    }`,
    link: isRenter ? '/owner/bookings' : '/dashboard/bookings',
  });

  res.json({ success: true, booking });
});

module.exports = {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  cancelBooking,
  autoCompletePastBookings,
};
