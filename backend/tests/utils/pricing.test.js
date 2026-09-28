const { calculateBookingPrice } = require('../../src/utils/pricing');

describe('calculateBookingPrice', () => {
  test('charges for a plain 3-day rental with no discount', () => {
    const result = calculateBookingPrice({
      pricePerDay: 50,
      startDate: '2026-01-01',
      endDate: '2026-01-04',
      commissionPercent: 10,
    });
    expect(result.totalDays).toBe(3);
    expect(result.subtotal).toBe(150);
    expect(result.discountPercent).toBe(0);
    expect(result.totalPrice).toBe(150);
    expect(result.platformCommission).toBe(15);
    expect(result.ownerEarning).toBe(135);
  });

  test('applies the weekly discount at 7+ days', () => {
    const result = calculateBookingPrice({
      pricePerDay: 100,
      startDate: '2026-01-01',
      endDate: '2026-01-08', // 7 days
      discountWeeklyPercent: 10,
      discountMonthlyPercent: 25,
      commissionPercent: 10,
    });
    expect(result.totalDays).toBe(7);
    expect(result.discountPercent).toBe(10);
    expect(result.subtotal).toBe(700);
    expect(result.discountAmount).toBe(70);
    expect(result.totalPrice).toBe(630);
  });

  test('applies the monthly discount instead of weekly at 30+ days', () => {
    const result = calculateBookingPrice({
      pricePerDay: 100,
      startDate: '2026-01-01',
      endDate: '2026-01-31', // 30 days
      discountWeeklyPercent: 10,
      discountMonthlyPercent: 25,
      commissionPercent: 10,
    });
    expect(result.totalDays).toBe(30);
    expect(result.discountPercent).toBe(25);
    expect(result.totalPrice).toBe(2250);
  });

  test('never returns fewer than 1 billable day', () => {
    const result = calculateBookingPrice({
      pricePerDay: 40,
      startDate: '2026-01-01',
      endDate: '2026-01-01',
      commissionPercent: 10,
    });
    expect(result.totalDays).toBe(1);
  });

  test('rounds currency amounts to 2 decimal places', () => {
    const result = calculateBookingPrice({
      pricePerDay: 33.33,
      startDate: '2026-01-01',
      endDate: '2026-01-04',
      commissionPercent: 12.5,
    });
    expect(Number.isInteger(result.subtotal * 100)).toBe(true);
    expect(Number.isInteger(result.platformCommission * 100)).toBe(true);
  });
});
