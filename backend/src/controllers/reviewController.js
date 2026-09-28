const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/apiError');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { sendNotification } = require('../utils/notify');

async function recalculateCarRating(carId) {
  const stats = await Review.aggregate([
    { $match: { car: carId } },
    { $group: { _id: '$car', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  await Car.findByIdAndUpdate(carId, {
    ratingAvg: Math.round(avg * 10) / 10,
    ratingCount: count,
  });
}

// POST /api/reviews  { bookingId, rating, comment }
const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  const booking = await Booking.findById(bookingId).populate('car');
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.renter.toString() !== req.user._id.toString()) throw new ApiError(403, 'Not your booking');
  if (booking.status !== 'completed') {
    throw new ApiError(400, 'You can only review a trip after it is completed');
  }

  const existing = await Review.findOne({ booking: booking._id });
  if (existing) throw new ApiError(400, 'You already reviewed this booking');

  const review = await Review.create({
    booking: booking._id,
    car: booking.car._id,
    user: req.user._id,
    owner: booking.owner,
    rating,
    comment,
  });

  await recalculateCarRating(booking.car._id);

  await sendNotification({
    userId: booking.owner,
    type: 'new_review',
    title: 'New review',
    message: `${req.user.name} left a ${rating}-star review on ${booking.car.brand} ${booking.car.model}`,
    link: '/owner/reviews',
  });

  res.status(201).json({ success: true, review });
});

// GET /api/cars/:id/reviews
const getCarReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ car: req.params.id })
    .sort({ createdAt: -1 })
    .populate('user', 'name avatar');
  res.json({ success: true, reviews });
});

// GET /api/reviews/mine  (renter: reviews I've written)
const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('car', 'brand model images');
  res.json({ success: true, reviews });
});

// GET /api/reviews/owner/mine  (owner: reviews on my listings)
const getOwnerReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .populate('car', 'brand model images')
    .populate('user', 'name avatar');
  res.json({ success: true, reviews });
});

// PUT /api/reviews/:id/reply  (owner, own car's review)
const replyToReview = asyncHandler(async (req, res) => {
  const { reply } = req.body;
  const review = await Review.findById(req.params.id).populate('car', 'brand model');
  if (!review) throw new ApiError(404, 'Review not found');
  if (review.owner.toString() !== req.user._id.toString()) throw new ApiError(403, 'Not your listing');

  review.ownerReply = reply;
  review.ownerReplyAt = new Date();
  await review.save();

  await sendNotification({
    userId: review.user,
    type: 'review_reply',
    title: 'The host replied to your review',
    message: `The host replied to your review of ${review.car.brand} ${review.car.model}`,
    link: '/dashboard/reviews',
  });

  res.json({ success: true, review });
});

// DELETE /api/reviews/:id  (review author or admin)
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this review');
  }
  const carId = review.car;
  await review.deleteOne();
  await recalculateCarRating(carId);
  res.json({ success: true, message: 'Review deleted' });
});

module.exports = {
  createReview,
  getCarReviews,
  getMyReviews,
  getOwnerReviews,
  replyToReview,
  deleteReview,
};
