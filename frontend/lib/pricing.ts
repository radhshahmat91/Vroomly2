import { daysBetween } from "./utils";

/**
 * Mirrors backend/src/utils/pricing.js for an instant on-page estimate.
 * The server is the source of truth and recalculates this from scratch
 * when the booking is actually created — this is display-only.
 */
export function estimateBookingPrice({
  pricePerDay,
  startDate,
  endDate,
  discountWeeklyPercent = 0,
  discountMonthlyPercent = 0,
  commissionPercent = 12,
}: {
  pricePerDay: number;
  startDate: Date;
  endDate: Date;
  discountWeeklyPercent?: number;
  discountMonthlyPercent?: number;
  commissionPercent?: number;
}) {
  const totalDays = daysBetween(startDate, endDate);

  let discountPercent = 0;
  if (totalDays >= 30 && discountMonthlyPercent > 0) discountPercent = discountMonthlyPercent;
  else if (totalDays >= 7 && discountWeeklyPercent > 0) discountPercent = discountWeeklyPercent;

  const subtotal = totalDays * pricePerDay;
  const discountAmount = subtotal * (discountPercent / 100);
  const totalPrice = subtotal - discountAmount;
  const platformCommission = totalPrice * (commissionPercent / 100);

  return { totalDays, subtotal, discountPercent, discountAmount, totalPrice, platformCommission };
}
