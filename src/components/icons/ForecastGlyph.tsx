import type { PeriodKind } from '@/interpretation/periods';
export function ForecastGlyph({ kind, size = 48 }: { kind: PeriodKind; size?: number }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 3.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg className={`forecast-glyph forecast-glyph--${kind}`} width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      {kind === 'building' ? <><path {...common} d="M6 34c8 0 9-10 17-13 7-3 11-2 19-10"/><circle cx="42" cy="11" r="3" fill="currentColor"/></> : null}
      {kind === 'overlap' ? <><path {...common} d="M5 30c8-19 17-19 25 0"/><path {...common} d="M18 33c8-19 17-19 25 0"/></> : null}
      {kind === 'fading' ? <><path {...common} d="M5 13c11 0 13 8 20 14 6 5 11 7 18 8"/><path {...common} strokeDasharray="3 5" d="M28 40h15"/></> : null}
      {kind === 'low' ? <><path {...common} strokeWidth="5" d="M5 31h38"/><path {...common} strokeDasharray="3 5" d="M5 19h38"/></> : null}
      {kind === 'steady' ? <><path {...common} d="M5 25c8-2 14 2 21 0 7-2 10 2 17 0"/></> : null}
    </svg>
  );
}
