const express = require('express');
const { body } = require('express-validator');
const {
  listCars,
  getCarById,
  getCarAvailability,
  getSimilarCars,
  createCar,
  updateCar,
  deleteCar,
  setUnavailableDates,
  getMyCars,
} = require('../controllers/carController');
const { getCarReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const carValidation = [
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1980 }).withMessage('Enter a valid year'),
  body('pricePerDay').isFloat({ min: 1 }).withMessage('Daily price must be greater than 0'),
  body('seats').isInt({ min: 1, max: 20 }).withMessage('Enter a valid seat count'),
  body('fuelType').isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG']).withMessage('Invalid fuel type'),
  body('transmission').isIn(['Manual', 'Automatic']).withMessage('Invalid transmission'),
  body('licensePlate').trim().notEmpty().withMessage('License plate is required'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
];

// Public
router.get('/', listCars);

// Owner — must be declared before "/:id" or Express would treat "owner" as an id
router.get('/owner/mine', protect, authorize('owner'), getMyCars);
router.post('/', protect, authorize('owner'), carValidation, validate, createCar);

// Public, parametrized
router.get('/:id', getCarById);
router.get('/:id/availability', getCarAvailability);
router.get('/:id/similar', getSimilarCars);
router.get('/:id/reviews', getCarReviews);

// Owner, parametrized
router.put('/:id', protect, authorize('owner'), updateCar);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteCar);
router.put('/:id/availability', protect, authorize('owner'), setUnavailableDates);

module.exports = router;
