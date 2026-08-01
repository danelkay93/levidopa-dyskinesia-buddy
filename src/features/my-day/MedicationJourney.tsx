import type { Schedule } from '@/domain/schedule';
import { nextDose, timeToMinute } from '@/domain/schedule';
import type { ModelResult } from '@/model/pk';
import { forecastForDose } from '@/interpretation/periods';
import { DoseStation } from './DoseStation';

export function MedicationJourney({ schedule, model, nowMinute, onSelectDose }: { schedule: Schedule; model: ModelResult; nowMinute: number; onSelectDose: (id: string) => void }) {
  const next = nextDose(schedule, nowMinute);
  const normalizedNow = nowMinute < 360 ? nowMinute + 1440 : nowMinute;
  const ordered = schedule.doses.map((dose) => ({ dose, minute: timeToMinute(dose.time) < 360 ? timeToMinute(dose.time)+1440 : timeToMinute(dose.time) }));
  const future = ordered.filter((item) => item.minute >= normalizedNow && item.dose.id !== next.dose.id);
  return <section className="journey" aria-labelledby="journey-heading"><h2 id="journey-heading">Your medication day</h2><div className="journey-rail" aria-hidden="true"/><DoseStation dose={next.dose} kind={forecastForDose(next.dose, schedule, model)} next minutesUntil={next.minutesUntil} onSelect={() => onSelectDose(next.dose.id)}/>{future.length ? <div className="journey-label">Later today</div> : null}{future.map(({ dose }) => <DoseStation key={dose.id} dose={dose} kind={forecastForDose(dose, schedule, model)} onSelect={() => onSelectDose(dose.id)}/>)}</section>;
}
