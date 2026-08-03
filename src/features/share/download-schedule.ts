import type { Schedule } from '@/domain/schedule';

export function downloadSchedule(schedule: Schedule): void {
  const blob = new Blob([JSON.stringify(schedule, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = 'levodopa-day-map-schedule.json';
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}
