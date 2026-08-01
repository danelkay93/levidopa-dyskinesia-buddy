import { DEFAULT_SCHEDULE } from '@/domain/schedule';
import { readInitialUrlState } from './url-state';

describe('initial URL and local schedule state', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/?now=09:30');
  });

  it('restores a valid locally saved schedule', () => {
    const saved = { ...DEFAULT_SCHEDULE, doses: DEFAULT_SCHEDULE.doses.map((dose) => dose.id === 'dose-1130' ? { ...dose, time: '12:00' } : dose) };
    localStorage.setItem('levodopa-day-map-schedule-v1', JSON.stringify(saved));
    expect(readInitialUrlState().schedule.doses[1].time).toBe('12:00');
  });

  it('migrates the legacy prototype schedule without losing dose times or amounts', () => {
    localStorage.setItem('levodopa-day-map-doses-v3', JSON.stringify([
      { time: '07:30', mg: 200 },
      { time: '11:45', mg: 100 },
      { time: '15:00', mg: 100 },
      { time: '19:00', mg: 100 },
    ]));

    const schedule = readInitialUrlState().schedule;
    expect(schedule.doses.map(({ time, mg }) => ({ time, mg }))).toEqual([
      { time: '07:30', mg: 200 },
      { time: '11:45', mg: 100 },
      { time: '15:00', mg: 100 },
      { time: '19:00', mg: 100 },
    ]);
    expect(schedule.doses[0].tabletFraction).toBe(1);
    expect(schedule.doses[1].tabletFraction).toBe(0.5);
    expect(localStorage.getItem('levodopa-day-map-schedule-v1')).not.toBeNull();
  });

  it('keeps the saved schedule when a shared URL is malformed', () => {
    localStorage.setItem('levodopa-day-map-schedule-v1', JSON.stringify(DEFAULT_SCHEDULE));
    window.history.replaceState({}, '', '/?s=malformed&now=09:30');
    const state = readInitialUrlState();
    expect(state.schedule).toEqual(DEFAULT_SCHEDULE);
    expect(state.importError).toMatch(/left unchanged/i);
  });
});
