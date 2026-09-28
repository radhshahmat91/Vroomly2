const express = require('express');
const {
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
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);

router.get('/users', getUsers);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/unban', unbanUser);

router.put('/owners/:id/approve', approveOwner);
router.put('/owners/:id/reject', rejectOwner);

router.get('/cars', getCars);
router.put('/cars/:id/approve', approveCar);
router.put('/cars/:id/reject', rejectCar);
router.delete('/cars/:id', deleteCar);

router.get('/bookings', getAllBookings);
router.get('/payments', getAllPayments);

router.get('/complaints', getAllComplaints);
router.put('/complaints/:id', updateComplaint);

module.exports = router;
