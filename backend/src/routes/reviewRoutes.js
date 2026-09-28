const express = require('express');
const { body } = require('express-validator');
const {
  createReview,
  getMyReviews,
  getOwnerReviews,
  replyToReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('bookingId').notEmpty().withMessage('bookingId is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  ],
  validate,
  createReview
);

router.get('/mine', getMyReviews);
router.get('/owner/mine', authorize('owner'), getOwnerReviews);
router.put('/:id/reply', authorize('owner'), replyToReview);
router.delete('/:id', deleteReview);

module.exports = router;
