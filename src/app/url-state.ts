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

const STORAGE_KEY = 'levodopa-day-map-schedule-v1';
const LEGACY_STORAGE_KEY = 'levodopa-day-map-doses-v3';

function decodeSchedule(value: string): Schedule {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const decoded = window.atob(padded);
  return ScheduleSchema.parse(JSON.parse(decoded));
}

function migrateLegacySchedule(value: unknown): Schedule | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > 12) return null;

  const doses = value.map((entry, index) => {
    if (!entry || typeof entry !== 'object') return null;
    const { time, mg } = entry as { time?: unknown; mg?: unknown };
    if (typeof time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
    const amount = Number(mg);
    if (!Number.isInteger(amount) || amount < 25 || amount > 400) return null;

    return {
      id: `legacy-${time.replace(':', '')}-${index}`,
      time,
      mg: amount,
      formulation: 'CR' as const,
      // The old prototype stored only time and amount. Preserve its displayed
      // convention: 200 mg as a whole tablet and smaller doses as a half.
      tabletFraction: amount >= 200 ? 1 as const : 0.5 as const,
    };
  });

  if (doses.some((dose) => dose === null)) return null;
  return ScheduleSchema.parse({ version: 1, doses });
}

function readSavedSchedule(): Schedule | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return ScheduleSchema.parse(JSON.parse(saved));

    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacy) return null;
    const migrated = migrateLegacySchedule(JSON.parse(legacy));
    if (!migrated) return null;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  } catch {
    return null;
  }
}

export function encodeSchedule(schedule: Schedule): string {
  return window.btoa(JSON.stringify(schedule)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function encodeDoseState(doseId: string): string {
  return doseId.startsWith('dose-') ? doseId : `dose-${doseId}`;
}

export function readInitialUrlState(): InitialUrlState {
  const params = new URLSearchParams(window.location.search);
  const requestedView = params.get('view');
  const view: AppView = requestedView === 'analyze' || requestedView === 'schedule' ? requestedView : 'my-day';
  const fixtureName = params.get('fixture');
  let schedule = fixtureName
    ? (SCHEDULE_FIXTURES[fixtureName] ?? SCHEDULE_FIXTURES.default)
    : (readSavedSchedule() ?? SCHEDULE_FIXTURES.default);
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
