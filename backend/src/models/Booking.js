const mongoose = require('mongoose');

// State machine:
//   pending -> accepted -> confirmed (paid) -> completed
//   pending -> rejected
//   pending | accepted | confirmed -> cancelled  (before startDate)
// Overlapping *pending* requests are allowed (nothing is promised yet);
// once one is accepted, any other pending request for overlapping dates
// on the same car is auto-rejected — see bookingController.acceptBooking.
const bookingSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    // Snapshot of pricing at the moment of booking, so later price changes
    // on the car never retroactively change an existing booking.
    totalDays: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    platformCommission: { type: Number, required: true },
    ownerEarning: { type: Number, required: true },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },

    rejectReason: { type: String, default: '' },
    cancelReason: { type: String, default: '' },
    cancelledBy: { type: String, enum: ['renter', 'owner', 'system', ''], default: '' },
  },
  { timestamps: true }
);

bookingSchema.index({ car: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ renter: 1, createdAt: -1 });
bookingSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
