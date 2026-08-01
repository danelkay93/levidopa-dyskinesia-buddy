import { buildModel } from '@/model/pk';
import { SCHEDULE_FIXTURES } from '@/fixtures/schedules';
import { derivePeriods } from './periods';

describe('derived schedule periods', () => {
  it('labels overlap without changing the model', () => {
    const model = buildModel(SCHEDULE_FIXTURES.overlap);
    const before = [...model.total];
    const periods = derivePeriods(model);
    expect(periods.some((period) => period.kind === 'overlap')).toBe(true);
    expect(model.total).toEqual(before);
  });
  it('keeps a long practical-low period for sparse schedules', () => {
    const periods = derivePeriods(buildModel(SCHEDULE_FIXTURES.one));
    expect(periods.some((period) => period.kind === 'low' && period.end-period.start > 180)).toBe(true);
  });
});
