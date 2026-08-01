import { useMemo, useState } from 'react';
import { DownloadSimpleIcon, LinkSimpleIcon, MinusIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react';
import type { Dose, Schedule } from '@/domain/schedule';
import { normalizeSchedule } from '@/domain/schedule';
import { Button } from '@/components/ui/Button';
import { TabletIllustration } from '@/components/icons/TabletIllustration';

export function ScheduleView({ schedule, onChange, onShare }: { schedule: Schedule; onChange: (schedule: Schedule) => void; onShare: () => void }) {
  const [draft, setDraft] = useState(schedule);
  const [removedDose, setRemovedDose] = useState<Dose | null>(null);

  const duplicateTimes = useMemo(() => {
    const counts = new Map<string, number>();
    for (const dose of draft.doses) counts.set(dose.time, (counts.get(dose.time) ?? 0) + 1);
    return new Set([...counts.entries()].filter(([, count]) => count > 1).map(([time]) => time));
  }, [draft.doses]);

  const updateDose = (id: string, patch: Partial<Dose>) => {
    setDraft((current) => ({
      ...current,
      doses: current.doses.map((dose) => dose.id === id ? { ...dose, ...patch } : dose),
    }));
  };

  const save = () => {
    if (duplicateTimes.size === 0) onChange(normalizeSchedule(draft));
  };

  const add = () => {
    setDraft((current) => ({
      ...current,
      doses: [
        ...current.doses,
        { id: `dose-${Date.now()}`, time: '21:00', mg: 100, formulation: 'CR', tabletFraction: 0.5 },
      ],
    }));
  };

  const remove = (dose: Dose) => {
    if (draft.doses.length === 1) return;
    setRemovedDose(dose);
    setDraft((current) => ({ ...current, doses: current.doses.filter((item) => item.id !== dose.id) }));
  };

  const undoRemove = () => {
    if (!removedDose) return;
    setDraft((current) => normalizeSchedule({ ...current, doses: [...current.doses, removedDose] }));
    setRemovedDose(null);
  };

  return <main className="view view--schedule" id="main-content">
    <header className="view-heading view-heading--action">
      <div><h2>Edit schedule</h2><p>Large controls; no precision dragging.</p></div>
      <Button variant="primary" onPress={save} isDisabled={duplicateTimes.size > 0}>Done</Button>
    </header>

    {duplicateTimes.size > 0 ? <p className="editor-alert" role="alert">Choose a different time for each dose before saving.</p> : null}

    <div className="editor-list">
      {draft.doses.map((dose) => {
        const duplicate = duplicateTimes.has(dose.time);
        const errorId = `dose-time-error-${dose.id}`;
        return <fieldset className="dose-editor" key={dose.id}>
          <legend className="sr-only">Dose at {dose.time}</legend>
          <label>
            <span>Time</span>
            <input
              type="time"
              lang="en-GB"
              step={60}
              value={dose.time}
              aria-invalid={duplicate || undefined}
              aria-describedby={duplicate ? errorId : undefined}
              onChange={(event) => updateDose(dose.id, { time: event.target.value })}
            />
          </label>
          {duplicate ? <p className="dose-editor__error" id={errorId}>Another dose already uses this time.</p> : null}

          <label>
            <span>Levodopa</span>
            <div className="stepper">
              <Button variant="icon" aria-label={`Decrease ${dose.time} dose`} onPress={() => updateDose(dose.id, { mg: Math.max(25, dose.mg - 25) })}><MinusIcon/></Button>
              <output>{dose.mg} mg</output>
              <Button variant="icon" aria-label={`Increase ${dose.time} dose`} onPress={() => updateDose(dose.id, { mg: Math.min(400, dose.mg + 25) })}><PlusIcon/></Button>
            </div>
          </label>

          <div className="tablet-toggle" role="group" aria-label={`Tablet form for ${dose.time}`}>
            <Button className={dose.tabletFraction === 1 ? 'is-selected' : ''} onPress={() => updateDose(dose.id, { tabletFraction: 1 })}><TabletIllustration className="tablet-toggle__icon"/>Whole</Button>
            <Button className={dose.tabletFraction === 0.5 ? 'is-selected' : ''} onPress={() => updateDose(dose.id, { tabletFraction: 0.5 })}><TabletIllustration half className="tablet-toggle__icon"/>Half</Button>
          </div>

          <Button variant="quiet" className="remove-dose" aria-label={`Remove dose at ${dose.time}`} onPress={() => remove(dose)} isDisabled={draft.doses.length === 1}><TrashIcon/>Remove</Button>
        </fieldset>;
      })}
    </div>

    {removedDose ? <div className="undo-removal" role="status"><span>Dose at {removedDose.time} removed.</span><Button variant="quiet" onPress={undoRemove}>Undo</Button></div> : null}

    <Button className="add-dose" onPress={add}><PlusIcon/>Add another dose</Button>
    <section className="share-entry"><div><h2>Share or export schedule</h2><p>Review exactly what the link contains.</p></div><Button variant="quiet" onPress={onShare}><LinkSimpleIcon/>Open</Button></section>
    <Button variant="secondary" className="export-button" onPress={() => { const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'levodopa-day-map-schedule.json'; link.click(); URL.revokeObjectURL(link.href); }}><DownloadSimpleIcon/>Export schedule file</Button>
  </main>;
}
