const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    brand: { type: String, required: [true, 'Brand is required'], trim: true },
    model: { type: String, required: [true, 'Model is required'], trim: true },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: 1980,
      max: new Date().getFullYear() + 1,
    },
    category: {
      type: String,
      enum: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Van', 'Truck', 'Luxury', 'Electric'],
      default: 'Sedan',
    },

    pricePerDay: { type: Number, required: [true, 'Daily price is required'], min: 0 },
    discountWeeklyPercent: { type: Number, min: 0, max: 100, default: 0 },
    discountMonthlyPercent: { type: Number, min: 0, max: 100, default: 0 },

    seats: { type: Number, required: [true, 'Seat count is required'], min: 1, max: 20 },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
      required: [true, 'Fuel type is required'],
    },
    transmission: {
      type: String,
      enum: ['Manual', 'Automatic'],
      required: [true, 'Transmission is required'],
    },

    location: {
      address: { type: String, trim: true, default: '' },
      city: { type: String, required: [true, 'City is required'], trim: true },
      coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        // GeoJSON order is [lng, lat]
        coordinates: { type: [Number], default: [90.4125, 23.8103] },
      },
    },

    images: { type: [String], default: [] },
    features: { type: [String], default: [] },
    description: { type: String, trim: true, maxlength: 2000, default: '' },
    licensePlate: { type: String, required: [true, 'License plate is required'], trim: true, unique: true },

    // Owner-declared maintenance/vacation blocks, layered on top of the
    // blocks that booking status derives automatically (see utils/availability.js)
    unavailableDates: [
      {
        start: { type: Date, required: true },
        end: { type: Date, required: true },
        reason: { type: String, default: 'Unavailable' },
      },
    ],

    isApproved: { type: Boolean, default: false },
    rejectionReason: { type: String, default: '' },
    isActive: { type: Boolean, default: true },

    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

carSchema.index({ 'location.coordinates': '2dsphere' });
carSchema.index({ brand: 'text', model: 'text', 'location.city': 'text' });

carSchema.virtual('title').get(function title() {
  return `${this.year} ${this.brand} ${this.model}`;
});
carSchema.set('toJSON', { virtuals: true });
carSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Car', carSchema);
