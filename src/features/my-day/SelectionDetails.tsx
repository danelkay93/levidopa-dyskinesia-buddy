import { ChartLineUpIcon, InfoIcon } from '@phosphor-icons/react';
import type { Dose } from '@/domain/schedule';
import { tabletLabel, minuteToTime } from '@/domain/schedule';
import type { DerivedPeriod, PeriodKind } from '@/interpretation/periods';
import { PERIOD_COPY } from '@/interpretation/periods';
import { ForecastGlyph } from '@/components/icons/ForecastGlyph';
import { Button } from '@/components/ui/Button';

export function DoseDetails({ dose, kind, onAnalyze }: { dose: Dose; kind: PeriodKind; onAnalyze: () => void }) { return <div className="selection-details"><p className="selection-subtitle">{dose.mg} mg · {tabletLabel(dose)}</p><div className={`selection-callout selection-callout--${kind}`}><ForecastGlyph kind={kind}/><div><strong>{PERIOD_COPY[kind].label}</strong><p>{PERIOD_COPY[kind].explanation}</p></div></div><p className="model-boundary"><InfoIcon size={20}/>This is a deterministic schedule model, not a symptom report.</p><Button className="selection-action" onPress={onAnalyze}><ChartLineUpIcon size={21}/>See dose in Analyze</Button></div>; }
export function PeriodDetails({ period, onAnalyze }: { period: DerivedPeriod; onAnalyze: () => void }) { return <div className="selection-details"><p className="selection-subtitle">{minuteToTime(period.start)}–{minuteToTime(period.end)} · derived schedule period</p><div className={`selection-callout selection-callout--${period.kind}`}><ForecastGlyph kind={period.kind}/><div><strong>{PERIOD_COPY[period.kind].label}</strong><p>{PERIOD_COPY[period.kind].explanation}</p></div></div><p className="model-boundary"><InfoIcon size={20}/>This label describes modeled dose contributions. It does not mean an observed symptom.</p><Button className="selection-action" onPress={onAnalyze}><ChartLineUpIcon size={21}/>Open technical curve</Button></div>; }
