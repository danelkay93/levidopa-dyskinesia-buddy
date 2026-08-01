import { DEFAULT_SCHEDULE } from '@/domain/schedule';
import { buildModel, practicalLevel, PRACTICAL_ZERO, REFERENCE_PEAK } from './pk';

describe('deterministic PK/effect-site model', () => {
  it('keeps the validated practical-zero transform', () => {
    expect(practicalLevel(Number.NaN)).toBe(0);
    expect(practicalLevel(PRACTICAL_ZERO)).toBe(0);
    expect(practicalLevel(1)).toBeCloseTo(1, 8);
  });
  it('is deterministic and keeps component totals proportional', () => {
    const a = buildModel(DEFAULT_SCHEDULE);
    const b = buildModel(DEFAULT_SCHEDULE);
    expect(a.total).toEqual(b.total);
    expect(REFERENCE_PEAK).toBeGreaterThan(0);
    for (let index = 0; index < a.total.length; index += 12) {
      const sum = a.occurrences.reduce((total, occurrence) => total + occurrence.displayCurve[index], 0);
      expect(sum).toBeCloseTo(a.total[index], 8);
    }
  });
});
