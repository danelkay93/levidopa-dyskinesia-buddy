import { ScheduleSchema, type Schedule } from '@/domain/schedule';
import { SCHEDULE_FIXTURES } from '@/fixtures/schedules';

export type AppView = 'my-day' | 'analyze' | 'schedule';
export interface InitialUrlState {
  view: AppView;
  schedule: Schedule;
  now: string;
  selectedDoseId: string | null;
  selectedPeriodKind: string | null;
  openOverview: boolean;
  openShare: boolean;
  importError: string | null;
}

function decodeSchedule(value: string): Schedule {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const decoded = window.atob(padded);
  return ScheduleSchema.parse(JSON.parse(decoded));
}

export function encodeSchedule(schedule: Schedule): string {
  return window.btoa(JSON.stringify(schedule)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function readInitialUrlState(): InitialUrlState {
  const params = new URLSearchParams(window.location.search);
  const requestedView = params.get('view');
  const view: AppView = requestedView === 'analyze' || requestedView === 'schedule' ? requestedView : 'my-day';
  const fixture = SCHEDULE_FIXTURES[params.get('fixture') ?? 'default'] ?? SCHEDULE_FIXTURES.default;
  let schedule = fixture;
  let importError: string | null = null;
  const shared = params.get('s');
  if (shared) {
    try { schedule = decodeSchedule(shared); }
    catch { importError = 'This shared schedule could not be read. Your current schedule was left unchanged.'; }
  }
  const state = params.get('state') ?? 'default';
  return {
    view,
    schedule,
    now: params.get('now') ?? `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
    selectedDoseId: state.startsWith('dose-') ? state.replace(/^dose-/, '') : null,
    selectedPeriodKind: state.startsWith('period-') ? state.replace(/^period-/, '') : null,
    openOverview: state === 'overview',
    openShare: state === 'sharing',
    importError,
  };
}

export function updateUrl(values: Record<string, string | null>): void {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(values)) {
    if (value === null) url.searchParams.delete(key); else url.searchParams.set(key, value);
  }
  window.history.replaceState({}, '', url);
}
