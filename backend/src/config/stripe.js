const Stripe = require('stripe');

const isConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

// `stripe` is null when no secret key is set — callers must check
// `isConfigured` (or handle a thrown error) rather than assuming this exists.
const stripe = isConfigured ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

module.exports = { stripe, isConfigured };
