export type DoseFixture = {
  time: string;
  mg: number;
};

export type ScheduleFixture = {
  id: string;
  label: string;
  purpose: string;
  doses: DoseFixture[];
};

export const schedules = {
  defaultDay: {
    id: 'default-day',
    label: 'Default day',
    purpose: 'Current four-dose production schedule.',
    doses: [
      { time: '07:30', mg: 200 },
      { time: '11:30', mg: 100 },
      { time: '15:00', mg: 100 },
      { time: '19:00', mg: 100 },
    ],
  },
  overlap: {
    id: 'overlap',
    label: 'Close-spacing overlap',
    purpose: 'Creates a pronounced contribution overlap and close-spacing braces.',
    doses: [
      { time: '07:00', mg: 200 },
      { time: '09:00', mg: 200 },
      { time: '11:00', mg: 100 },
      { time: '13:00', mg: 100 },
    ],
  },
  longLow: {
    id: 'long-low',
    label: 'Long low period',
    purpose: 'Creates a long schedule-derived low/OFF-shaped stretch.',
    doses: [
      { time: '07:30', mg: 100 },
      { time: '13:30', mg: 100 },
      { time: '20:30', mg: 100 },
      { time: '23:30', mg: 100 },
    ],
  },
  midnightWrap: {
    id: 'midnight-wrap',
    label: 'Midnight wrapping',
    purpose: 'Exercises doses and low periods around the 06:00-to-06:00 day boundary.',
    doses: [
      { time: '05:30', mg: 100 },
      { time: '11:30', mg: 100 },
      { time: '17:30', mg: 100 },
      { time: '23:30', mg: 100 },
    ],
  },
  oneDose: {
    id: 'one-dose',
    label: 'One-dose schedule',
    purpose: 'Exercises the minimum useful deterministic schedule.',
    doses: [{ time: '08:00', mg: 200 }],
  },
  dense: {
    id: 'dense',
    label: 'Unusually dense schedule',
    purpose: 'Exercises collision handling and editor reflow with many doses.',
    doses: [
      { time: '06:30', mg: 100 },
      { time: '08:00', mg: 100 },
      { time: '09:30', mg: 100 },
      { time: '11:00', mg: 100 },
      { time: '12:30', mg: 100 },
      { time: '14:00', mg: 100 },
      { time: '15:30', mg: 100 },
      { time: '17:00', mg: 100 },
      { time: '18:30', mg: 100 },
      { time: '20:00', mg: 100 },
    ],
  },
} satisfies Record<string, ScheduleFixture>;

export const requiredViewports = [
  { id: 'phone-320x568', width: 320, height: 568 },
  { id: 'phone-375x667', width: 375, height: 667 },
  { id: 'phone-390x844', width: 390, height: 844 },
  { id: 'phone-430x932', width: 430, height: 932 },
  { id: 'phone-landscape-844x390', width: 844, height: 390 },
  { id: 'tablet-768x1024', width: 768, height: 1024 },
  { id: 'tablet-1024x1366', width: 1024, height: 1366 },
] as const;
