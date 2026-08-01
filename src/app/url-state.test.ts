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

  it('keeps the saved schedule when a shared URL is malformed', () => {
    localStorage.setItem('levodopa-day-map-schedule-v1', JSON.stringify(DEFAULT_SCHEDULE));
    window.history.replaceState({}, '', '/?s=malformed&now=09:30');
    const state = readInitialUrlState();
    expect(state.schedule).toEqual(DEFAULT_SCHEDULE);
    expect(state.importError).toMatch(/left unchanged/i);
  });
});
