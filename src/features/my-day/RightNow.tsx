import type { ModelResult } from '@/model/pk';
import type { DerivedPeriod } from '@/interpretation/periods';
import { PERIOD_COPY, periodAtMinute } from '@/interpretation/periods';
import { ForecastGlyph } from '@/components/icons/ForecastGlyph';
import { DayShapeOverview } from './DayShapeOverview';

export function RightNow({ model, periods, nowMinute, onOverview }: { model: ModelResult; periods: DerivedPeriod[]; nowMinute: number; onOverview: () => void }) {
  const period = periodAtMinute(periods, nowMinute);
  const copy = PERIOD_COPY[period.kind];
  return <section className="right-now" aria-labelledby="right-now-heading" data-testid="right-now">
    <div className="right-now__label">Right now</div>
    <div className="right-now__main"><div><h2 id="right-now-heading">{copy.label}</h2><p>{copy.explanation}</p></div><div className="right-now__glyph"><ForecastGlyph kind={period.kind} size={54}/></div></div>
    <DayShapeOverview model={model} periods={periods} nowMinute={nowMinute} onOpen={onOverview}/>
  </section>;
}
