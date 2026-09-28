const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  authorize('user', 'owner'),
  [
    body('carId').notEmpty().withMessage('carId is required'),
    body('startDate').isISO8601().withMessage('Enter a valid start date'),
    body('endDate').isISO8601().withMessage('Enter a valid end date'),
  ],
  validate,
  createBooking
);

router.get('/mine', getMyBookings);
router.get('/owner/requests', authorize('owner'), getOwnerBookings);

router.get('/:id', getBookingById);
router.put('/:id/accept', authorize('owner'), acceptBooking);
router.put('/:id/reject', authorize('owner'), rejectBooking);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
