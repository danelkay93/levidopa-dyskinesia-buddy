import type { DerivedPeriod } from '@/interpretation/periods';
import { minuteToTime } from '@/domain/schedule';
import { ForecastGlyph } from '@/components/icons/ForecastGlyph';
export function OverviewSheet({ periods, onSelect }: { periods: DerivedPeriod[]; onSelect: (period: DerivedPeriod) => void }) {
  return <div className="overview-list"><p className="model-boundary">A compact modeled shape—not a symptom forecast.</p>{periods.map((period) => <button key={period.id} className={`period-row period-row--${period.kind}`} onClick={() => onSelect(period)}><span><small>{minuteToTime(period.start)}–{minuteToTime(period.end)}</small><strong>{period.label}</strong></span><ForecastGlyph kind={period.kind} size={42}/></button>)}</div>;
}
