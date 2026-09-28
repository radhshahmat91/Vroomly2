const asyncHandler = require('../middleware/asyncHandler');
const Car = require('../models/Car');
const Booking = require('../models/Booking');

// GET /api/owner/dashboard
const getDashboard = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  const [totalCars, approvedCars, pendingRequests, activeBookings, earningsAgg, recentBookings] =
    await Promise.all([
      Car.countDocuments({ owner: ownerId }),
      Car.countDocuments({ owner: ownerId, isApproved: true }),
      Booking.countDocuments({ owner: ownerId, status: 'pending' }),
      Booking.countDocuments({ owner: ownerId, status: { $in: ['accepted', 'confirmed'] } }),
      Booking.aggregate([
        { $match: { owner: ownerId, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$ownerEarning' }, count: { $sum: 1 } } },
      ]),
      Booking.find({ owner: ownerId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('car', 'brand model images')
        .populate('renter', 'name avatar'),
    ]);

  res.json({
    success: true,
    stats: {
      totalCars,
      approvedCars,
      pendingRequests,
      activeBookings,
      totalEarnings: earningsAgg[0]?.total || 0,
      paidBookingsCount: earningsAgg[0]?.count || 0,
    },
    recentBookings,
    isOwnerApproved: req.user.isOwnerApproved,
  });
});

// GET /api/owner/earnings
const getEarnings = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  const byMonth = await Booking.aggregate([
    { $match: { owner: ownerId, paymentStatus: 'paid' } },
    {
      $group: {
        _id: { year: { $year: '$updatedAt' }, month: { $month: '$updatedAt' } },
        earnings: { $sum: '$ownerEarning' },
        commission: { $sum: '$platformCommission' },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const transactions = await Booking.find({ owner: ownerId, paymentStatus: 'paid' })
    .sort({ updatedAt: -1 })
    .populate('car', 'brand model')
    .populate('renter', 'name');

  res.json({ success: true, byMonth, transactions });
});

module.exports = { getDashboard, getEarnings };
