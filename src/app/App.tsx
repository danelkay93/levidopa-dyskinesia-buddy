import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { WarningCircleIcon } from '@phosphor-icons/react';
import type { AppView } from './url-state';
import { readInitialUrlState, updateUrl } from './url-state';
import type { Schedule } from '@/domain/schedule';
import { buildModel } from '@/model/pk';
import { derivePeriods, forecastForDose } from '@/interpretation/periods';
import type { DerivedPeriod } from '@/interpretation/periods';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ContextSheet } from '@/components/ContextSheet';
import { Button } from '@/components/ui/Button';
import { MyDayView } from '@/features/my-day/MyDayView';
import { OverviewSheet } from '@/features/my-day/OverviewSheet';
import { DoseDetails, PeriodDetails } from '@/features/my-day/SelectionDetails';
import { ShareDisclosure } from '@/features/share/ShareDisclosure';

const AnalyzeView = lazy(() => import('@/features/analyze/AnalyzeView').then((module) => ({ default: module.AnalyzeView })));
const ScheduleView = lazy(() => import('@/features/schedule/ScheduleView').then((module) => ({ default: module.ScheduleView })));

function LoadingView() {
  return <main className="view" id="main-content" aria-busy="true"><p>Loading view…</p></main>;
}

export function App() {
  const initial = useMemo(readInitialUrlState, []);
  const [view, setView] = useState<AppView>(initial.view);
  const [schedule, setSchedule] = useState<Schedule>(initial.schedule);
  const [selectedDoseId, setSelectedDoseId] = useState<string | null>(() => {
    if (!initial.selectedDoseId) return null;
    return schedule.doses.find((dose) => dose.id.endsWith(initial.selectedDoseId!))?.id ?? schedule.doses[0]?.id ?? null;
  });
  const [selectedPeriod, setSelectedPeriod] = useState<DerivedPeriod | null>(null);
  const [overviewOpen, setOverviewOpen] = useState(initial.openOverview);
  const [shareOpen, setShareOpen] = useState(initial.openShare);
  const [importError, setImportError] = useState(initial.importError);

  const model = useMemo(() => buildModel(schedule), [schedule]);
  const periods = useMemo(() => derivePeriods(model), [model]);
  const selectedDose = schedule.doses.find((dose) => dose.id === selectedDoseId) ?? null;
  const selectedDoseKind = selectedDose ? forecastForDose(selectedDose, schedule, model) : null;

  useEffect(() => {
    if (initial.selectedPeriodKind) {
      setSelectedPeriod(periods.find((period) => period.kind === initial.selectedPeriodKind) ?? periods[0] ?? null);
    }
  }, [initial.selectedPeriodKind, periods]);

  const clearContext = () => {
    setSelectedDoseId(null);
    setSelectedPeriod(null);
    setOverviewOpen(false);
    setShareOpen(false);
  };

  const changeView = (next: AppView) => {
    clearContext();
    setView(next);
    updateUrl({ view: next === 'my-day' ? null : next, state: null });
  };

  const openDose = (id: string) => {
    setSelectedDoseId(id);
    setSelectedPeriod(null);
    setOverviewOpen(false);
    setShareOpen(false);
    updateUrl({ state: `dose-${id}` });
  };

  const openAnalyzeDose = (id: string) => {
    setView('analyze');
    setSelectedDoseId(id);
    setSelectedPeriod(null);
    setOverviewOpen(false);
    setShareOpen(false);
    updateUrl({ view: 'analyze', state: `dose-${id}` });
  };

  const openAnalyze = () => {
    clearContext();
    setView('analyze');
    updateUrl({ view: 'analyze', state: null });
  };

  const selectAnalyzeDose = (id: string | null) => {
    setSelectedDoseId(id);
    updateUrl({ state: id ? `dose-${id}` : null });
  };

  const closeContext = () => {
    clearContext();
    updateUrl({ state: null });
  };

  const contextOpen = Boolean(
    overviewOpen || shareOpen || (view === 'my-day' && (selectedDose || selectedPeriod)),
  );
  const contextTitle = shareOpen
    ? 'Share or export'
    : overviewOpen
      ? 'Today at a glance'
      : selectedDose
        ? `${selectedDose.time} dose`
        : selectedPeriod
          ? selectedPeriod.label
          : 'Selection details';

  return <div className="app-shell" data-testid="app-shell">
    <a href="#main-content" className="skip-link">Skip to content</a>
    <header className="app-header">
      <h1>{view === 'my-day' ? 'My Day' : view === 'analyze' ? 'Analyze' : 'Schedule'}</h1>
      {view === 'my-day' ? <Button onPress={() => changeView('schedule')}>Schedule</Button> : null}
    </header>

    {importError ? <div className="import-alert" role="alert"><WarningCircleIcon size={24}/><span>{importError}</span><Button variant="quiet" aria-label="Dismiss import error" onPress={() => setImportError(null)}>Dismiss</Button></div> : null}

    <div className="app-layout">
      <div className="app-content">
        {view === 'my-day' ? <MyDayView schedule={schedule} model={model} periods={periods} now={initial.now} onOverview={() => { setOverviewOpen(true); setShareOpen(false); setSelectedDoseId(null); setSelectedPeriod(null); updateUrl({ state: 'overview' }); }} onSelectDose={openDose}/> : null}
        <Suspense fallback={<LoadingView/>}>
          {view === 'analyze' ? <AnalyzeView schedule={schedule} model={model} periods={periods} selectedDoseId={selectedDoseId} onSelectDose={selectAnalyzeDose}/> : null}
          {view === 'schedule' ? <ScheduleView schedule={schedule} onChange={(next) => { setSchedule(next); try { localStorage.setItem('levodopa-day-map-schedule-v1', JSON.stringify(next)); } catch {} changeView('my-day'); }} onShare={() => { setShareOpen(true); setOverviewOpen(false); setSelectedDoseId(null); setSelectedPeriod(null); updateUrl({ state: 'sharing' }); }}/> : null}
        </Suspense>
      </div>

      <ContextSheet open={contextOpen} title={contextTitle} onClose={closeContext}>
        {overviewOpen ? <OverviewSheet periods={periods} onSelect={(period) => { setOverviewOpen(false); setSelectedPeriod(period); updateUrl({ state: `period-${period.kind}` }); }}/> : null}
        {selectedDose && selectedDoseKind && view === 'my-day' ? <DoseDetails dose={selectedDose} kind={selectedDoseKind} onAnalyze={() => openAnalyzeDose(selectedDose.id)}/> : null}
        {selectedPeriod && view === 'my-day' ? <PeriodDetails period={selectedPeriod} onAnalyze={openAnalyze}/> : null}
        {shareOpen ? <ShareDisclosure schedule={schedule}/> : null}
      </ContextSheet>
    </div>

    <BottomNavigation view={view} onChange={changeView}/>
  </div>;
}
