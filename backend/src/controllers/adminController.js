const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/apiError');
const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const { sendNotification } = require('../utils/notify');

// ── Analytics ────────────────────────────────────────────────────────

// GET /api/admin/dashboard
const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalOwners,
    pendingOwners,
    totalCars,
    pendingCars,
    totalBookings,
    openComplaints,
    revenueAgg,
    bookingsByStatus,
    revenueByMonth,
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'owner' }),
    User.countDocuments({ role: 'owner', isOwnerApproved: false }),
    Car.countDocuments(),
    Car.countDocuments({ isApproved: false }),
    Booking.countDocuments(),
    Complaint.countDocuments({ status: { $in: ['open', 'in_review'] } }),
    Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' }, commission: { $sum: '$platformCommission' } } },
    ]),
    Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: { year: { $year: '$updatedAt' }, month: { $month: '$updatedAt' } },
          revenue: { $sum: '$totalPrice' },
          commission: { $sum: '$platformCommission' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalOwners,
      pendingOwners,
      totalCars,
      pendingCars,
      totalBookings,
      openComplaints,
      totalRevenue: revenueAgg[0]?.total || 0,
      totalCommission: revenueAgg[0]?.commission || 0,
    },
    bookingsByStatus,
    revenueByMonth,
  });
});

// ── Users & owners ───────────────────────────────────────────────────

// GET /api/admin/users?role=user|owner
const getUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];
  }
  const users = await User.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, users });
});

// PUT /api/admin/users/:id/ban
const banUser = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.role === 'admin') throw new ApiError(400, 'Cannot ban an admin account');
  user.isBanned = true;
  user.banReason = reason || 'Violation of platform policy';
  await user.save();
  res.json({ success: true, user });
});

// PUT /api/admin/users/:id/unban
const unbanUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  user.isBanned = false;
  user.banReason = '';
  await user.save();
  res.json({ success: true, user });
});

// PUT /api/admin/owners/:id/approve
const approveOwner = asyncHandler(async (req, res) => {
  const owner = await User.findOne({ _id: req.params.id, role: 'owner' });
  if (!owner) throw new ApiError(404, 'Host account not found');
  owner.isOwnerApproved = true;
  await owner.save();
  await sendNotification({
    userId: owner._id,
    type: 'owner_approved',
    title: 'Host account approved',
    message: 'Your host account has been approved. You can now list vehicles.',
    link: '/owner/cars/new',
  });
  res.json({ success: true, user: owner });
});

// PUT /api/admin/owners/:id/reject
const rejectOwner = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const owner = await User.findOne({ _id: req.params.id, role: 'owner' });
  if (!owner) throw new ApiError(404, 'Host account not found');
  owner.isOwnerApproved = false;
  owner.isBanned = true;
  owner.banReason = reason || 'Host application rejected';
  await owner.save();
  await sendNotification({
    userId: owner._id,
    type: 'owner_rejected',
    title: 'Host application rejected',
    message: reason || 'Your host application was not approved.',
  });
  res.json({ success: true, user: owner });
});

// ── Cars ─────────────────────────────────────────────────────────────

// GET /api/admin/cars?status=pending|approved
const getCars = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status === 'pending') filter.isApproved = false;
  if (status === 'approved') filter.isApproved = true;
  const cars = await Car.find(filter).sort({ createdAt: -1 }).populate('owner', 'name email');
  res.json({ success: true, cars });
});

// PUT /api/admin/cars/:id/approve
const approveCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) throw new ApiError(404, 'Car not found');
  car.isApproved = true;
  car.rejectionReason = '';
  await car.save();
  await sendNotification({
    userId: car.owner,
    type: 'car_approved',
    title: 'Listing approved',
    message: `${car.brand} ${car.model} is now live on Vroomly`,
    link: '/owner/cars',
  });
  res.json({ success: true, car });
});

// PUT /api/admin/cars/:id/reject
const rejectCar = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const car = await Car.findById(req.params.id);
  if (!car) throw new ApiError(404, 'Car not found');
  car.isApproved = false;
  car.rejectionReason = reason || 'Did not meet listing guidelines';
  await car.save();
  await sendNotification({
    userId: car.owner,
    type: 'car_rejected',
    title: 'Listing needs changes',
    message: `${car.brand} ${car.model}: ${car.rejectionReason}`,
    link: '/owner/cars',
  });
  res.json({ success: true, car });
});

// DELETE /api/admin/cars/:id
const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) throw new ApiError(404, 'Car not found');
  await car.deleteOne();
  res.json({ success: true, message: 'Listing removed' });
});

// ── Bookings & payments ──────────────────────────────────────────────

// GET /api/admin/bookings
const getAllBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .limit(300)
    .populate('car', 'brand model')
    .populate('renter', 'name email')
    .populate('owner', 'name email');
  res.json({ success: true, bookings });
});

// GET /api/admin/payments
const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .sort({ createdAt: -1 })
    .limit(300)
    .populate('user', 'name email')
    .populate({ path: 'booking', populate: { path: 'car', select: 'brand model' } });
  res.json({ success: true, payments });
});

// ── Complaints ───────────────────────────────────────────────────────

// GET /api/admin/complaints
const getAllComplaints = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const complaints = await Complaint.find(filter)
    .sort({ createdAt: -1 })
    .populate('raisedBy', 'name email role')
    .populate({ path: 'booking', populate: { path: 'car', select: 'brand model' } });
  res.json({ success: true, complaints });
});

// PUT /api/admin/complaints/:id
const updateComplaint = asyncHandler(async (req, res) => {
  const { status, adminResponse } = req.body;
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw new ApiError(404, 'Complaint not found');
  if (status) complaint.status = status;
  if (adminResponse !== undefined) complaint.adminResponse = adminResponse;
  await complaint.save();

  await sendNotification({
    userId: complaint.raisedBy,
    type: 'complaint_update',
    title: 'Update on your complaint',
    message: `"${complaint.subject}" is now ${complaint.status.replace('_', ' ')}`,
    link: '/dashboard',
  });

  res.json({ success: true, complaint });
});

module.exports = {
  getDashboard,
  getUsers,
  banUser,
  unbanUser,
  approveOwner,
  rejectOwner,
  getCars,
  approveCar,
  rejectCar,
  deleteCar,
  getAllBookings,
  getAllPayments,
  getAllComplaints,
  updateComplaint,
};
