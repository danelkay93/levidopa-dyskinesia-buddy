import type { Schedule } from '@/domain/schedule';
import { timeToMinute } from '@/domain/schedule';

export const DAY = 1440;
export const DISPLAY_START = 360;
export const DISPLAY_END = 1800;
export const STEP_MINUTES = 5;
export const PRACTICAL_ZERO = 0.08;

export const MODEL_PARAMETERS = Object.freeze({
  delay: 0.10,
  release: 5.0,
  releaseShape: 1.80,
  releaseScale: 0.42,
  absorptionRate: 3.0,
  halfLife: 1.5,
  effectHalfLife: 0.24,
  bioavailability: 0.725,
});

export interface DoseOccurrence {
  doseId: string;
  doseIndex: number;
  time: number;
  mg: number;
  dayOffset: number;
  curve: number[];
  displayCurve: number[];
}

export interface ModelResult {
  times: number[];
  rawTotal: number[];
  total: number[];
  occurrences: DoseOccurrence[];
  referencePeak: number;
}

export const MODEL_TIMES = Array.from(
  { length: Math.floor((DISPLAY_END - DISPLAY_START) / STEP_MINUTES) + 1 },
  (_, index) => DISPLAY_START + index * STEP_MINUTES,
);

function gammaWeight(value: number, shape: number, scale: number): number {
  if (value <= 0) return 0;
  return value ** (shape - 1) * Math.exp(-value / scale);
}

export function plasmaCurve(timePoints: number[], doseMinute: number, mg: number): number[] {
  const curve = new Array<number>(timePoints.length).fill(0);
  const fragments = 60;
  const weights: number[] = [];
  let weightTotal = 0;
  for (let fragment = 0; fragment < fragments; fragment += 1) {
    const releaseAt = ((fragment + 0.5) * MODEL_PARAMETERS.release) / fragments;
    const weight = gammaWeight(releaseAt + 0.03, MODEL_PARAMETERS.releaseShape, MODEL_PARAMETERS.releaseScale);
    weights.push(weight);
    weightTotal += weight;
  }
  const eliminationRate = Math.log(2) / MODEL_PARAMETERS.halfLife;
  for (let index = 0; index < timePoints.length; index += 1) {
    let total = 0;
    for (let fragment = 0; fragment < fragments; fragment += 1) {
      const released = MODEL_PARAMETERS.delay + ((fragment + 0.5) * MODEL_PARAMETERS.release) / fragments;
      const elapsed = (timePoints[index] - doseMinute) / 60 - released;
      if (elapsed <= 0) continue;
      const absorptionRate = MODEL_PARAMETERS.absorptionRate;
      const kernel = Math.abs(absorptionRate - eliminationRate) < 0.001
        ? absorptionRate * elapsed * Math.exp(-absorptionRate * elapsed)
        : (absorptionRate / (absorptionRate - eliminationRate))
          * (Math.exp(-eliminationRate * elapsed) - Math.exp(-absorptionRate * elapsed));
      total += (mg * MODEL_PARAMETERS.bioavailability * weights[fragment] * kernel) / weightTotal;
    }
    curve[index] = total;
  }
  return curve;
}

export function effectSite(plasma: number[], halfLife = MODEL_PARAMETERS.effectHalfLife, stepMinutes = STEP_MINUTES): number[] {
  const output = new Array<number>(plasma.length).fill(0);
  output[0] = plasma[0] ?? 0;
  const rate = Math.log(2) / halfLife;
  const fraction = 1 - Math.exp((-rate * stepMinutes) / 60);
  for (let index = 1; index < plasma.length; index += 1) {
    output[index] = output[index - 1] + fraction * (plasma[index] - output[index - 1]);
  }
  return output;
}

export function practicalLevel(value: number): number {
  if (!Number.isFinite(value) || value <= PRACTICAL_ZERO) return 0;
  return (value - PRACTICAL_ZERO) / (1 - PRACTICAL_ZERO);
}

function referencePeak(): number {
  const refTimes = Array.from({ length: Math.floor(720 / STEP_MINUTES) + 1 }, (_, index) => index * STEP_MINUTES);
  const raw = effectSite(plasmaCurve(refTimes, 0, 200));
  return Math.max(...raw) || 1;
}

export const REFERENCE_PEAK = referencePeak();

function addCurves(curves: number[][]): number[] {
  const total = new Array<number>(MODEL_TIMES.length).fill(0);
  for (const curve of curves) {
    for (let index = 0; index < curve.length; index += 1) total[index] += curve[index];
  }
  return total;
}

export function buildModel(schedule: Schedule): ModelResult {
  const occurrences: DoseOccurrence[] = [];
  for (const dayOffset of [-1, 0, 1]) {
    schedule.doses.forEach((dose, doseIndex) => {
      const absoluteMinute = timeToMinute(dose.time) + dayOffset * DAY;
      if (absoluteMinute > DISPLAY_END + 120 || absoluteMinute < DISPLAY_START - 36 * 60) return;
      const raw = effectSite(plasmaCurve(MODEL_TIMES, absoluteMinute, dose.mg));
      const curve = raw.map((value) => value / REFERENCE_PEAK);
      occurrences.push({
        doseId: dose.id,
        doseIndex,
        time: absoluteMinute,
        mg: dose.mg,
        dayOffset,
        curve,
        displayCurve: new Array<number>(MODEL_TIMES.length).fill(0),
      });
    });
  }

  const rawTotal = addCurves(occurrences.map((item) => item.curve));
  const total = rawTotal.map(practicalLevel);
  for (let index = 0; index < MODEL_TIMES.length; index += 1) {
    const ratio = rawTotal[index] > 0 ? total[index] / rawTotal[index] : 0;
    for (const occurrence of occurrences) occurrence.displayCurve[index] = occurrence.curve[index] * ratio;
  }
  return { times: MODEL_TIMES, rawTotal, total, occurrences, referencePeak: REFERENCE_PEAK };
}

export function nearestModelIndex(minute: number): number {
  const normalized = minute < DISPLAY_START ? minute + DAY : minute;
  return Math.max(0, Math.min(MODEL_TIMES.length - 1, Math.round((normalized - DISPLAY_START) / STEP_MINUTES)));
}
