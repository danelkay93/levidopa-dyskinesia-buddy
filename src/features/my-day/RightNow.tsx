import type { Schedule } from '@/domain/schedule';
import { resolveDisplayMinute } from '@/domain/schedule';
import type { ModelResult } from '@/model/pk';
import type { DerivedPeriod, PeriodKind } from '@/interpretation/periods';
import { PERIOD_COPY, periodAtMinute } from '@/interpretation/periods';
import { ForecastGlyph } from '@/components/icons/ForecastGlyph';
import { DayShapeOverview } from './DayShapeOverview';

function currentExplanation(kind: PeriodKind, schedule: Schedule, nowMinute: number): string {
  const normalizedNow = nowMinute < 360 ? nowMinute + 1440 : nowMinute;
  const latest = schedule.doses
    .map((dose) => ({ dose, minute: resolveDisplayMinute(dose.time) }))
    .filter((item) => item.minute <= normalizedNow)
    .sort((a, b) => b.minute - a.minute)[0];

  switch (kind) {
    case 'building': return latest ? `Rising after ${latest.dose.time}.` : 'Rising after a scheduled dose.';
    case 'overlap': return 'Two modeled dose contributions overlap here.';
    case 'fading': return latest ? `Descending after the ${latest.dose.time} dose.` : 'Descending toward a lower part of the day.';
    case 'low': return 'Near practical zero before the next rise.';
    case 'steady': return 'The modeled level is changing more slowly here.';
  }
}

export function RightNow({ schedule, model, periods, nowMinute, onOverview }: { schedule: Schedule; model: ModelResult; periods: DerivedPeriod[]; nowMinute: number; onOverview: () => void }) {
  const period = periodAtMinute(periods, nowMinute);
  const copy = PERIOD_COPY[period.kind];
  return <section className="right-now" aria-labelledby="right-now-heading" data-testid="right-now">
    <div className="right-now__label">Right now</div>
    <div className="right-now__main"><div><h2 id="right-now-heading">{copy.label}</h2><p>{currentExplanation(period.kind, schedule, nowMinute)}</p></div><div className="right-now__glyph"><ForecastGlyph kind={period.kind} size={54}/></div></div>
    <DayShapeOverview model={model} periods={periods} nowMinute={nowMinute} onOpen={onOverview}/>
  </section>;
}
