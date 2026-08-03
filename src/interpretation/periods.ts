import type { Schedule, Dose } from '@/domain/schedule';
import { resolveDisplayMinute } from '@/domain/schedule';
import type { ModelResult } from '@/model/pk';
import { nearestModelIndex, STEP_MINUTES } from '@/model/pk';

export type PeriodKind = 'low' | 'building' | 'overlap' | 'steady' | 'fading';
export interface DerivedPeriod {
  id: string;
  kind: PeriodKind;
  start: number;
  end: number;
  label: string;
  shortLabel: string;
}

export const PERIOD_COPY: Record<PeriodKind, { label: string; shortLabel: string; explanation: string }> = {
  low: { label: 'Modeled level is low', shortLabel: 'Low', explanation: 'The modeled schedule is at or near practical zero.' },
  building: { label: 'Medication is building', shortLabel: 'Building', explanation: 'The modeled level is rising after a scheduled dose.' },
  overlap: { label: 'Higher and overlapping', shortLabel: 'More overlap', explanation: 'Two or more modeled dose contributions are substantial here.' },
  steady: { label: 'Relatively steady', shortLabel: 'Steady', explanation: 'The modeled level changes more slowly during this part of the schedule.' },
  fading: { label: 'Medication is fading', shortLabel: 'Fading', explanation: 'The modeled level is descending toward a lower part of the schedule.' },
};

function slopeAt(curve: number[], index: number): number {
  const window = 3;
  const before = Math.max(0, index - window);
  const after = Math.min(curve.length - 1, index + window);
  const hours = ((after - before) * STEP_MINUTES) / 60;
  return hours ? (curve[after] - curve[before]) / hours : 0;
}

export function derivePointKinds(model: ModelResult): PeriodKind[] {
  const slopes = model.total.map((_, index) => slopeAt(model.total, index));
  const maxRise = Math.max(...slopes, 0.001);
  const maxFall = Math.max(...slopes.map((value) => -value), 0.001);
  return model.total.map((level, index) => {
    if (level === 0) return 'low';
    const active = model.occurrences.filter((occurrence) => occurrence.displayCurve[index] > 0.08).length;
    if (active >= 2 && level >= 0.28) return 'overlap';
    if (slopes[index] > maxRise * 0.10) return 'building';
    if (-slopes[index] > maxFall * 0.10) return 'fading';
    return 'steady';
  });
}

export function derivePeriods(model: ModelResult): DerivedPeriod[] {
  const kinds = derivePointKinds(model);
  const periods: DerivedPeriod[] = [];
  let startIndex = 0;
  for (let index = 1; index <= kinds.length; index += 1) {
    if (index < kinds.length && kinds[index] === kinds[startIndex]) continue;
    const kind = kinds[startIndex];
    const start = model.times[startIndex];
    const end = model.times[Math.min(index, model.times.length - 1)];
    if (end - start >= 15 || periods.length === 0) {
      periods.push({ id: `${kind}-${start}`, kind, start, end, ...PERIOD_COPY[kind] });
    } else {
      const previous = periods[periods.length - 1];
      previous.end = end;
    }
    startIndex = index;
  }
  return periods;
}

export function periodAtMinute(periods: DerivedPeriod[], minute: number): DerivedPeriod {
  const normalized = minute < 360 ? minute + 1440 : minute;
  return periods.find((period) => normalized >= period.start && normalized <= period.end) ?? periods[0];
}

function gapToNextDose(dose: Dose, schedule: Schedule): number {
  const ordered = schedule.doses
    .map((item) => ({ dose: item, minute: resolveDisplayMinute(item.time) }))
    .sort((a, b) => a.minute - b.minute);
  const index = ordered.findIndex((item) => item.dose.id === dose.id);
  if (index < 0) return 0;
  const current = ordered[index].minute;
  const next = index === ordered.length - 1 ? ordered[0].minute + 1440 : ordered[index + 1].minute;
  return next - current;
}

export function forecastForDose(dose: Dose, schedule: Schedule, model: ModelResult): PeriodKind {
  // A long gap after the dose makes the broad journey cue “fading afterward” more useful
  // than describing a brief early overlap. This is a display heuristic, not a model change.
  if (gapToNextDose(dose, schedule) >= 480) return 'fading';

  const doseMinute = resolveDisplayMinute(dose.time);
  const lookAhead = nearestModelIndex(doseMinute + 120);
  const active = model.occurrences.filter((occurrence) => occurrence.displayCurve[lookAhead] > 0.08).length;
  if (active >= 2 && model.total[lookAhead] >= 0.28) return 'overlap';
  const next = Math.min(model.total.length - 1, lookAhead + 3);
  const previous = Math.max(0, lookAhead - 3);
  const direction = model.total[next] - model.total[previous];
  if (model.total[lookAhead] === 0) return 'low';
  return direction >= 0 ? 'building' : 'fading';
}

export function periodDescription(period: DerivedPeriod): string {
  return `${period.shortLabel}, ${Math.round((period.end - period.start) / 5) * 5} minutes. ${PERIOD_COPY[period.kind].explanation}`;
}
