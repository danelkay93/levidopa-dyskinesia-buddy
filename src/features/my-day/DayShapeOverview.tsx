import { LinePath } from '@visx/shape';
import { scaleLinear } from '@visx/scale';
import type { Schedule } from '@/domain/schedule';
import { minuteToTime, resolveDisplayMinute } from '@/domain/schedule';
import type { ModelResult } from '@/model/pk';
import type { DerivedPeriod } from '@/interpretation/periods';

const kindClass = (kind: string) => `overview-period overview-period--${kind}`;

export function DayShapeOverview({ schedule, model, periods, nowMinute, onOpen }: { schedule: Schedule; model: ModelResult; periods: DerivedPeriod[]; nowMinute: number; onOpen: () => void }) {
  const width = 330, height = 76, left = 10, right = 10, top = 20, bottom = 18;
  const x = scaleLinear({ domain: [model.times[0], model.times.at(-1)!], range: [left, width - right] });
  const max = Math.max(1, ...model.total);
  const y = scaleLinear({ domain: [0, max], range: [height - bottom, top] });
  const normalizedNow = nowMinute < 360 ? nowMinute + 1440 : nowMinute;
  const doseTimes = schedule.doses.map((dose) => dose.time).join(', ');

  return <button className="day-overview" onClick={onOpen} aria-label={`Modeled day overview. Now at ${minuteToTime(normalizedNow)}. Scheduled doses at ${doseTimes}. Open full day overview.`} data-testid="day-overview">
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <defs><pattern id="overview-low-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="2" opacity=".22"/></pattern></defs>
      {periods.map((period) => <rect key={period.id} className={kindClass(period.kind)} x={x(period.start)} y={top} width={Math.max(2, x(period.end)-x(period.start))} height={height-top-bottom} rx="5" />)}
      <LinePath data={model.times} x={(minute) => x(minute)} y={(_, index) => y(model.total[index])} stroke="var(--accent-strong)" strokeWidth={5} />
      {schedule.doses.map((dose) => <circle key={dose.id} cx={x(resolveDisplayMinute(dose.time))} cy={height - 7} r="3.5" className="overview-dose-marker" />)}
      <line x1={x(normalizedNow)} x2={x(normalizedNow)} y1={8} y2={height-4} className="overview-now-line" />
      <circle cx={x(normalizedNow)} cy={y(model.total[Math.max(0, Math.min(model.total.length-1, Math.round((normalizedNow-model.times[0])/5)))])} r="6" className="overview-now-dot" />
      <rect x={Math.max(3, Math.min(width-43, x(normalizedNow)-20))} y="1" width="40" height="20" rx="10" className="overview-now-label" />
      <text x={Math.max(23, Math.min(width-23, x(normalizedNow)))} y="15" textAnchor="middle" className="overview-now-text">Now</text>
    </svg>
  </button>;
}
