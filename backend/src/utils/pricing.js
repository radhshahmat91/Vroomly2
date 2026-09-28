const MS_PER_DAY = 1000 * 60 * 60 * 24;

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Pure pricing calculator shared by the booking and payment controllers.
 * A rental of >=30 days gets the monthly discount, >=7 days gets the
 * weekly discount, otherwise no discount is applied.
 *
 * @returns {{totalDays:number, subtotal:number, discountPercent:number,
 *            discountAmount:number, totalPrice:number,
 *            platformCommission:number, ownerEarning:number}}
 */
function calculateBookingPrice({
  pricePerDay,
  startDate,
  endDate,
  discountWeeklyPercent = 0,
  discountMonthlyPercent = 0,
  commissionPercent = 12,
}) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.max(1, Math.round((end - start) / MS_PER_DAY));

  let discountPercent = 0;
  if (totalDays >= 30 && discountMonthlyPercent > 0) {
    discountPercent = discountMonthlyPercent;
  } else if (totalDays >= 7 && discountWeeklyPercent > 0) {
    discountPercent = discountWeeklyPercent;
  }

  const subtotal = round2(totalDays * pricePerDay);
  const discountAmount = round2(subtotal * (discountPercent / 100));
  const totalPrice = round2(subtotal - discountAmount);
  const platformCommission = round2(totalPrice * (commissionPercent / 100));
  const ownerEarning = round2(totalPrice - platformCommission);

  return {
    totalDays,
    subtotal,
    discountPercent,
    discountAmount,
    totalPrice,
    platformCommission,
    ownerEarning,
  };
}

module.exports = { calculateBookingPrice, round2 };
