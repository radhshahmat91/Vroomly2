/* eslint-disable no-console */
require('dotenv').config();

const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const mongoose = require('mongoose');

const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const Complaint = require('../models/Complaint');

const { calculateBookingPrice } = require('../utils/pricing');
const { users: userFixtures, cars: carFixtures, DEMO_PASSWORD } = require('./data');

const COMMISSION = Number(process.env.PLATFORM_COMMISSION_PERCENT) || 12;
const daysFromNow = (n) => {
  const d = new Date();
  d.setHours(12, 0, 0, 0); // noon avoids timezone date-shift surprises
  d.setDate(d.getDate() + n);
  return d;
};

async function wipeDatabase() {
  await Promise.all(
    [User, Car, Booking, Review, Payment, Notification, Complaint].map((m) => m.deleteMany({}))
  );
}

async function createUsers() {
  const byKey = {};
  for (const fixture of userFixtures) {
    const { key, ...doc } = fixture;
    const user = await User.create(doc);
    if (key) byKey[key] = user;
  }
  return byKey;
}

async function createCars(ownersByKey) {
  const cars = [];
  for (const fixture of carFixtures) {
    const { ownerKey, ...doc } = fixture;
    const owner = ownersByKey[ownerKey];
    const car = await Car.create({ ...doc, owner: owner._id });
    cars.push(car);
  }
  return cars;
}

async function makeBooking({ car, renter, owner, start, end, status, paymentStatus = 'unpaid', extra = {} }) {
  const pricing = calculateBookingPrice({
    pricePerDay: car.pricePerDay,
    startDate: start,
    endDate: end,
    discountWeeklyPercent: car.discountWeeklyPercent,
    discountMonthlyPercent: car.discountMonthlyPercent,
    commissionPercent: COMMISSION,
  });

  const booking = await Booking.create({
    car: car._id,
    renter: renter._id,
    owner: owner._id,
    startDate: start,
    endDate: end,
    pricePerDay: car.pricePerDay,
    ...pricing,
    status,
    paymentStatus,
    ...extra,
  });

  if (paymentStatus === 'paid') {
    await Payment.create({
      booking: booking._id,
      user: renter._id,
      amount: booking.totalPrice,
      currency: process.env.DEFAULT_CURRENCY || 'usd',
      stripePaymentIntentId: `seed_pi_${booking._id}`,
      status: 'succeeded',
    });
  }

  return booking;
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected — wiping existing data...');
  await wipeDatabase();

  console.log('Creating users...');
  const u = await createUsers();

  console.log('Creating car listings...');
  const carsByPlate = {};
  const allCars = await createCars(u);
  allCars.forEach((c) => {
    carsByPlate[c.licensePlate] = c;
  });
  const car = (plate) => carsByPlate[plate];

  console.log('Creating bookings...');

  // Completed trips (past dates, paid) — these get reviews below.
  const b1 = await makeBooking({
    car: car('DHA-1201'), renter: u.user1, owner: u.owner1,
    start: daysFromNow(-20), end: daysFromNow(-16), status: 'completed', paymentStatus: 'paid',
  });
  const b2 = await makeBooking({
    car: car('DHA-1202'), renter: u.user2, owner: u.owner1,
    start: daysFromNow(-35), end: daysFromNow(-30), status: 'completed', paymentStatus: 'paid',
  });
  const b3 = await makeBooking({
    car: car('DHA-2101'), renter: u.user3, owner: u.owner2,
    start: daysFromNow(-50), end: daysFromNow(-47), status: 'completed', paymentStatus: 'paid',
  });
  const b4 = await makeBooking({
    car: car('DHA-3101'), renter: u.user1, owner: u.owner3,
    start: daysFromNow(-10), end: daysFromNow(-7), status: 'completed', paymentStatus: 'paid',
  });

  // Upcoming, confirmed & paid
  await makeBooking({
    car: car('DHA-2102'), renter: u.user4, owner: u.owner2,
    start: daysFromNow(5), end: daysFromNow(8), status: 'confirmed', paymentStatus: 'paid',
  });
  const b6 = await makeBooking({
    car: car('DHA-3103'), renter: u.user2, owner: u.owner3,
    start: daysFromNow(12), end: daysFromNow(14), status: 'confirmed', paymentStatus: 'paid',
  });

  // Accepted, awaiting payment
  const b7 = await makeBooking({
    car: car('DHA-1204'), renter: u.user3, owner: u.owner1,
    start: daysFromNow(20), end: daysFromNow(23), status: 'accepted',
  });
  const b8 = await makeBooking({
    car: car('DHA-2103'), renter: u.user5, owner: u.owner2,
    start: daysFromNow(7), end: daysFromNow(9), status: 'accepted',
  });

  // Pending, awaiting host response
  const b9 = await makeBooking({
    car: car('DHA-1205'), renter: u.user4, owner: u.owner1,
    start: daysFromNow(30), end: daysFromNow(33), status: 'pending',
  });
  const b10 = await makeBooking({
    car: car('DHA-3102'), renter: u.user5, owner: u.owner3,
    start: daysFromNow(4), end: daysFromNow(5), status: 'pending',
  });

  // Rejected
  const b11 = await makeBooking({
    car: car('CTG-4101'), renter: u.user1, owner: u.owner3,
    start: daysFromNow(15), end: daysFromNow(17), status: 'rejected',
    extra: { rejectReason: 'Vehicle is scheduled for maintenance that week' },
  });

  // Cancelled
  await makeBooking({
    car: car('DHA-1203'), renter: u.user2, owner: u.owner1,
    start: daysFromNow(2), end: daysFromNow(4), status: 'cancelled',
    extra: { cancelledBy: 'renter', cancelReason: 'Trip plans changed' },
  });

  console.log('Creating reviews...');
  const reviewFixtures = [
    { booking: b1, rating: 5, comment: "Smooth ride and the host was super responsive. Would rent again.", reply: '' },
    {
      booking: b2, rating: 4,
      comment: 'Clean car, easy pickup. Slight delay getting the keys but otherwise great.',
      reply: "Thanks for the feedback — we've adjusted our handover process for next time.",
    },
    { booking: b3, rating: 5, comment: 'Perfect for our trip out of the city. Great mileage on the highway.', reply: '' },
    {
      booking: b4, rating: 3,
      comment: 'Car was fine overall but had a slightly rattling noise on rough roads.',
      reply: '',
    },
  ];
  for (const r of reviewFixtures) {
    const review = await Review.create({
      booking: r.booking._id,
      car: r.booking.car,
      user: r.booking.renter,
      owner: r.booking.owner,
      rating: r.rating,
      comment: r.comment,
      ownerReply: r.reply,
      ownerReplyAt: r.reply ? new Date() : undefined,
    });
    const stats = await Review.aggregate([
      { $match: { car: review.car } },
      { $group: { _id: '$car', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    await Car.findByIdAndUpdate(review.car, {
      ratingAvg: Math.round(stats[0].avg * 10) / 10,
      ratingCount: stats[0].count,
    });
  }

  console.log('Creating notifications...');
  await Notification.create([
    {
      user: u.owner1._id, type: 'booking_request', title: 'New booking request',
      message: `${u.user4.name} requested the Mercedes-Benz C-Class for 3 day(s)`, link: '/owner/bookings', isRead: false,
    },
    {
      user: u.owner3._id, type: 'booking_request', title: 'New booking request',
      message: `${u.user5.name} requested the Suzuki Alto for 1 day(s)`, link: '/owner/bookings', isRead: false,
    },
    {
      user: u.user3._id, type: 'booking_accepted', title: 'Booking accepted!',
      message: 'BMW 3 Series is reserved for you — complete payment to confirm.',
      link: `/booking/${b7._id}/payment`, isRead: false,
    },
    {
      user: u.user5._id, type: 'booking_accepted', title: 'Booking accepted!',
      message: 'Nissan X-Trail is reserved for you — complete payment to confirm.',
      link: `/booking/${b8._id}/payment`, isRead: false,
    },
    {
      user: u.user1._id, type: 'booking_rejected', title: 'Booking request declined',
      message: `Your request for Toyota Hiace was declined: ${b11.rejectReason}`,
      link: '/dashboard/bookings', isRead: true,
    },
    {
      user: u.user2._id, type: 'review_reply', title: 'The host replied to your review',
      message: 'The host replied to your review of Honda CR-V', link: '/dashboard/reviews', isRead: false,
    },
    {
      user: u.owner3._id, type: 'payment_success', title: 'Payment received',
      message: `Payment received for Kia Sportage — the booking is confirmed.`, link: '/owner/bookings', isRead: false,
    },
  ]);

  console.log('Creating complaints...');
  await Complaint.create([
    {
      raisedBy: u.user1._id, booking: b4._id,
      subject: 'Unusual noise from rented vehicle',
      message: "The Pajero had a rattling noise on rough roads during my trip. Flagging in case there's a mechanical issue.",
      status: 'resolved',
      adminResponse: "Thanks for flagging this — the host has been asked to get the vehicle inspected before its next rental.",
    },
    {
      raisedBy: u.owner1._id, booking: b1._id,
      subject: 'Vehicle returned late',
      message: 'The renter returned the Corolla about four hours after the agreed drop-off time without notice.',
      status: 'open',
    },
  ]);

  console.log('\nDone! Demo accounts (all use the password: ' + DEMO_PASSWORD + ')');
  console.log('  Admin  → admin@vroomly.dev');
  console.log('  Host   → owner1@vroomly.dev (also owner2, owner3 — pre-approved)');
  console.log('  Host   → owner4@vroomly.dev (pending admin approval — good for demoing that flow)');
  console.log('  Renter → user1@vroomly.dev (also user2..user5)');

  await mongoose.disconnect();
  process.exit(0);
}

async function destroy() {
  await mongoose.connect(process.env.MONGO_URI);
  await wipeDatabase();
  console.log('All collections cleared.');
  await mongoose.disconnect();
  process.exit(0);
}

const run = process.argv.includes('--destroy') ? destroy : seed;
run().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
