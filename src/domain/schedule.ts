import { z } from 'zod';

export const TabletFractionSchema = z.union([z.literal(0.5), z.literal(1)]);
export const DoseSchema = z.object({
  id: z.string().min(1),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  mg: z.number().int().min(25).max(400),
  formulation: z.literal('CR').default('CR'),
  tabletFraction: TabletFractionSchema,
});
export const ScheduleSchema = z.object({
  version: z.literal(1),
  doses: z.array(DoseSchema).min(1).max(12),
});

export type Dose = z.infer<typeof DoseSchema>;
export type Schedule = z.infer<typeof ScheduleSchema>;

export const DEFAULT_SCHEDULE: Schedule = {
  version: 1,
  doses: [
    { id: 'dose-0730', time: '07:30', mg: 200, formulation: 'CR', tabletFraction: 1 },
    { id: 'dose-1130', time: '11:30', mg: 100, formulation: 'CR', tabletFraction: 0.5 },
    { id: 'dose-1500', time: '15:00', mg: 100, formulation: 'CR', tabletFraction: 0.5 },
    { id: 'dose-1900', time: '19:00', mg: 100, formulation: 'CR', tabletFraction: 0.5 },
  ],
};

export function timeToMinute(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minuteToTime(minute: number): string {
  const normalized = ((Math.round(minute) % 1440) + 1440) % 1440;
  return `${String(Math.floor(normalized / 60)).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')}`;
}

export function normalizeSchedule(schedule: Schedule): Schedule {
  return {
    ...schedule,
    doses: schedule.doses
      .map((dose) => ({ ...dose }))
      .sort((a, b) => timeToMinute(a.time) - timeToMinute(b.time)),
  };
}

export function resolveDisplayMinute(time: string, displayStart = 360): number {
  const minute = timeToMinute(time);
  return minute < displayStart ? minute + 1440 : minute;
}

export function nextDose(schedule: Schedule, nowMinute: number): { dose: Dose; absoluteMinute: number; minutesUntil: number } {
  const candidates = schedule.doses.flatMap((dose) => {
    const minute = timeToMinute(dose.time);
    return [minute, minute + 1440].map((absoluteMinute) => ({ dose, absoluteMinute }));
  });
  const normalizedNow = nowMinute < 360 ? nowMinute + 1440 : nowMinute;
  const next = candidates
    .filter((item) => item.absoluteMinute >= normalizedNow)
    .sort((a, b) => a.absoluteMinute - b.absoluteMinute)[0] ?? {
      dose: schedule.doses[0],
      absoluteMinute: timeToMinute(schedule.doses[0].time) + 1440,
    };
  return { ...next, minutesUntil: Math.max(0, next.absoluteMinute - normalizedNow) };
}

export function formatDuration(minutes: number): string {
  const rounded = Math.max(0, Math.round(minutes));
  const hours = Math.floor(rounded / 60);
  const rest = rounded % 60;
  if (!hours) return `${rest} min`;
  return `${hours} hr${hours === 1 ? '' : 's'}${rest ? ` ${rest} min` : ''}`;
}

export function tabletLabel(dose: Dose): string {
  return dose.tabletFraction === 1 ? '1 tablet' : 'half tablet';
}
