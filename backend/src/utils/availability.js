const Booking = require('../models/Booking');

/** Whether two inclusive date ranges [aStart, aEnd] and [bStart, bEnd] overlap. */
function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return new Date(aStart) <= new Date(bEnd) && new Date(bStart) <= new Date(aEnd);
}

// Only accepted/confirmed bookings actually hold a date range — a
// 'pending' request is just a request, so several renters can request the
// same dates and the owner picks one (see bookingController.acceptBooking,
// which auto-rejects the rest once that happens).
const BLOCKING_STATUSES = ['accepted', 'confirmed'];

/**
 * True if `car` has no confirmed/accepted booking and no owner-declared
 * maintenance block overlapping [startDate, endDate].
 */
async function isCarAvailable(car, startDate, endDate, excludeBookingId = null) {
  const bookingQuery = {
    car: car._id || car,
    status: { $in: BLOCKING_STATUSES },
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  };
  if (excludeBookingId) bookingQuery._id = { $ne: excludeBookingId };

  const conflictingBooking = await Booking.findOne(bookingQuery).select('_id');
  if (conflictingBooking) return false;

  if (car.unavailableDates && car.unavailableDates.length) {
    const blocked = car.unavailableDates.some((block) =>
      rangesOverlap(startDate, endDate, block.start, block.end)
    );
    if (blocked) return false;
  }

  return true;
}

/** Merges booked ranges + owner-blocked ranges into one list for the calendar UI. */
async function getUnavailableRanges(car) {
  const bookings = await Booking.find({
    car: car._id || car,
    status: { $in: BLOCKING_STATUSES },
  }).select('startDate endDate status');

  const fromBookings = bookings.map((b) => ({
    start: b.startDate,
    end: b.endDate,
    reason: b.status === 'confirmed' ? 'Booked' : 'Reserved',
  }));

  const fromOwner = (car.unavailableDates || []).map((b) => ({
    start: b.start,
    end: b.end,
    reason: b.reason || 'Unavailable',
  }));

  return [...fromBookings, ...fromOwner];
}

module.exports = { rangesOverlap, isCarAvailable, getUnavailableRanges, BLOCKING_STATUSES };
