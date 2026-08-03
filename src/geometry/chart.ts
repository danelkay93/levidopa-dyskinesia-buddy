import type { ModelResult } from '@/model/pk';

export interface ChartPoint { x: number; y: number; minute: number; value: number; index: number }

export function chartPoints(model: ModelResult, width: number, height: number, padding = { left: 32, right: 12, top: 22, bottom: 30 }): ChartPoint[] {
  const innerWidth = Math.max(1, width - padding.left - padding.right);
  const innerHeight = Math.max(1, height - padding.top - padding.bottom);
  const minMinute = model.times[0];
  const maxMinute = model.times[model.times.length - 1];
  const maxValue = Math.max(1, ...model.total);
  return model.times.map((minute, index) => ({
    x: padding.left + ((minute - minMinute) / (maxMinute - minMinute)) * innerWidth,
    y: padding.top + (1 - model.total[index] / maxValue) * innerHeight,
    minute,
    value: model.total[index],
    index,
  }));
}

export function nearestPoint(points: ChartPoint[], x: number): ChartPoint {
  let best = points[0];
  let distance = Math.abs(points[0].x - x);
  for (const point of points.slice(1)) {
    const nextDistance = Math.abs(point.x - x);
    if (nextDistance < distance) { best = point; distance = nextDistance; }
  }
  return best;
}
