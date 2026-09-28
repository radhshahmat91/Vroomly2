const express = require('express');
const { createPaymentIntent, confirmPayment, getMyPayments } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/mine', getMyPayments);

module.exports = router;
