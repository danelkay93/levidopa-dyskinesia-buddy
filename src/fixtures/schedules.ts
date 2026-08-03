import type { Schedule } from '@/domain/schedule';
import { DEFAULT_SCHEDULE } from '@/domain/schedule';

const dose = (id: string, time: string, mg: number, fraction: 0.5 | 1 = 0.5) => ({ id, time, mg, formulation: 'CR' as const, tabletFraction: fraction });

export const SCHEDULE_FIXTURES: Record<string, Schedule> = {
  default: DEFAULT_SCHEDULE,
  overlap: { version: 1, doses: [dose('a','07:30',200,1), dose('b','09:30',100), dose('c','11:30',100), dose('d','14:00',100), dose('e','18:00',100)] },
  low: { version: 1, doses: [dose('a','08:00',200,1)] },
  midnight: { version: 1, doses: [dose('a','05:30',100), dose('b','11:30',100), dose('c','17:30',100), dose('d','23:30',100)] },
  dense: { version: 1, doses: Array.from({ length: 10 }, (_, index) => dose(`d${index}`, `${String(6 + Math.floor(index * 1.7)).padStart(2,'0')}:${index % 2 ? '30' : '00'}`, index === 0 ? 200 : 100, index === 0 ? 1 : 0.5)) },
  one: { version: 1, doses: [dose('a','07:30',200,1)] },
};
