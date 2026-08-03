import { CaretRightIcon } from '@phosphor-icons/react';
import type { Dose } from '@/domain/schedule';
import { formatDuration, tabletLabel } from '@/domain/schedule';
import type { PeriodKind } from '@/interpretation/periods';
import { PERIOD_COPY } from '@/interpretation/periods';
import { ForecastGlyph } from '@/components/icons/ForecastGlyph';
import { TabletIllustration } from '@/components/icons/TabletIllustration';

function forecastLabel(kind: PeriodKind, next: boolean): string {
  if (next && kind === 'overlap') return 'Builds into overlap';
  if (kind === 'fading') return 'Fading afterward';
  return PERIOD_COPY[kind].shortLabel;
}

export function DoseStation({ dose, kind, next = false, minutesUntil, onSelect }: { dose: Dose; kind: PeriodKind; next?: boolean; minutesUntil?: number; onSelect: () => void }) {
  const label = forecastLabel(kind, next);
  return <button className={`dose-station ${next ? 'dose-station--next' : ''}`} onClick={onSelect} aria-label={`${next ? 'Next dose' : 'Dose'} at ${dose.time}, ${dose.mg} milligrams, ${tabletLabel(dose)}. Forecast: ${label}. Opens dose details.`} data-testid={`dose-${dose.id}`}>
    <span className="journey-node" aria-hidden="true" />
    <span className="dose-station__copy">{next ? <span className="dose-station__eyebrow">Next dose</span> : null}<strong className="dose-station__time">{dose.time}</strong><span className="dose-station__amount">{dose.mg} mg · {tabletLabel(dose)}</span>{next && minutesUntil !== undefined ? <span className="dose-station__until">in {formatDuration(minutesUntil)}</span> : null}</span>
    <span className="dose-station__visual"><TabletIllustration half={dose.tabletFraction === 0.5} className="tablet-illustration"/><span className="dose-station__forecast"><ForecastGlyph kind={kind} size={38}/><span>{label}</span></span></span>
    <CaretRightIcon className="dose-station__chevron" size={22} weight="bold" aria-hidden="true" />
  </button>;
}
