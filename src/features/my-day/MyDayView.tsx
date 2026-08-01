import type { Schedule } from '@/domain/schedule';
import { timeToMinute } from '@/domain/schedule';
import type { ModelResult } from '@/model/pk';
import type { DerivedPeriod } from '@/interpretation/periods';
import { RightNow } from './RightNow';
import { MedicationJourney } from './MedicationJourney';

export function MyDayView({ schedule, model, periods, now, onOverview, onSelectDose }: { schedule: Schedule; model: ModelResult; periods: DerivedPeriod[]; now: string; onOverview: () => void; onSelectDose: (id: string) => void }) {
  return <main className="view view--my-day" id="main-content"><RightNow model={model} periods={periods} nowMinute={timeToMinute(now)} onOverview={onOverview}/><MedicationJourney schedule={schedule} model={model} nowMinute={timeToMinute(now)} onSelectDose={onSelectDose}/><p className="page-boundary">This app explains a modeled schedule shape. It does not measure levodopa, symptoms, or provide dosing advice.</p></main>;
}
