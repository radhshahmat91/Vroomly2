const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/apiError');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { stripe, isConfigured } = require('../config/stripe');
const { sendNotification } = require('../utils/notify');

function requireStripe() {
  if (!isConfigured) {
    throw new ApiError(
      500,
      'Payments are not configured on this server yet. Add a Stripe secret key to backend/.env.'
    );
  }
}

// POST /api/payments/create-intent  { bookingId }
const createPaymentIntent = asyncHandler(async (req, res) => {
  requireStripe();
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.renter.toString() !== req.user._id.toString()) throw new ApiError(403, 'Not your booking');
  if (booking.status !== 'accepted') {
    throw new ApiError(400, 'This booking is not awaiting payment');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(booking.totalPrice * 100),
    currency: process.env.DEFAULT_CURRENCY || 'usd',
    automatic_payment_methods: { enabled: true },
    metadata: { bookingId: booking._id.toString(), userId: req.user._id.toString() },
  });

  await Payment.create({
    booking: booking._id,
    user: req.user._id,
    amount: booking.totalPrice,
    currency: process.env.DEFAULT_CURRENCY || 'usd',
    stripePaymentIntentId: paymentIntent.id,
    status: 'pending',
  });

  res.json({ success: true, clientSecret: paymentIntent.client_secret });
});

// POST /api/payments/confirm  { bookingId, paymentIntentId }
// Called by the client right after Stripe.js reports the PaymentElement
// confirmed. The webhook below is the production-safe source of truth;
// this is what makes the demo work without a public webhook URL.
const confirmPayment = asyncHandler(async (req, res) => {
  requireStripe();
  const { bookingId, paymentIntentId } = req.body;

  const booking = await Booking.findById(bookingId).populate('car');
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.renter.toString() !== req.user._id.toString()) throw new ApiError(403, 'Not your booking');

  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (intent.status !== 'succeeded') throw new ApiError(400, 'Payment has not completed yet');

  booking.status = 'confirmed';
  booking.paymentStatus = 'paid';
  await booking.save();

  await Payment.findOneAndUpdate({ stripePaymentIntentId: paymentIntentId }, { status: 'succeeded' });

  await sendNotification({
    userId: booking.owner,
    type: 'payment_success',
    title: 'Payment received',
    message: `Payment received for ${booking.car.brand} ${booking.car.model} — the booking is confirmed.`,
    link: '/owner/bookings',
  });

  res.json({ success: true, booking });
});

// POST /api/payments/webhook  (raw body — mounted before express.json in app.js)
const stripeWebhook = asyncHandler(async (req, res) => {
  if (!isConfigured || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(200).json({ received: true, note: 'Webhook secret not configured' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    const { bookingId } = intent.metadata || {};
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, { status: 'confirmed', paymentStatus: 'paid' });
      await Payment.findOneAndUpdate({ stripePaymentIntentId: intent.id }, { status: 'succeeded' });
    }
  }

  res.json({ received: true });
});

// GET /api/payments/mine
const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate({ path: 'booking', populate: { path: 'car', select: 'brand model images' } });
  res.json({ success: true, payments });
});

module.exports = { createPaymentIntent, confirmPayment, stripeWebhook, getMyPayments };
