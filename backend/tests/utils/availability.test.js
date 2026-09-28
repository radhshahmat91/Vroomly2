const { rangesOverlap } = require('../../src/utils/availability');

describe('rangesOverlap', () => {
  test('detects a partial overlap', () => {
    expect(rangesOverlap('2026-03-01', '2026-03-05', '2026-03-04', '2026-03-10')).toBe(true);
  });

  test('detects one range fully inside another', () => {
    expect(rangesOverlap('2026-03-01', '2026-03-10', '2026-03-03', '2026-03-05')).toBe(true);
  });

  test('detects touching ranges (same-day handover) as overlapping', () => {
    expect(rangesOverlap('2026-03-01', '2026-03-05', '2026-03-05', '2026-03-08')).toBe(true);
  });

  test('returns false for ranges with a gap between them', () => {
    expect(rangesOverlap('2026-03-01', '2026-03-05', '2026-03-06', '2026-03-10')).toBe(false);
  });
});
