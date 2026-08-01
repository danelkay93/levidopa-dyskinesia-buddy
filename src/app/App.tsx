import { useEffect, useMemo, useState } from 'react';
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
import { AnalyzeView } from '@/features/analyze/AnalyzeView';
import { ScheduleView } from '@/features/schedule/ScheduleView';
import { ShareDisclosure } from '@/features/share/ShareDisclosure';

export function App() {
  const initial = useMemo(readInitialUrlState, []);
  const [view,setView]=useState<AppView>(initial.view);
  const [schedule,setSchedule]=useState<Schedule>(initial.schedule);
  const [selectedDoseId,setSelectedDoseId]=useState<string|null>(()=>{
    if (!initial.selectedDoseId) return null;
    return schedule.doses.find((dose)=>dose.id.endsWith(initial.selectedDoseId!))?.id ?? schedule.doses[0]?.id ?? null;
  });
  const [selectedPeriod,setSelectedPeriod]=useState<DerivedPeriod|null>(null);
  const [overviewOpen,setOverviewOpen]=useState(initial.openOverview);
  const [shareOpen,setShareOpen]=useState(initial.openShare);
  const [importError,setImportError]=useState(initial.importError);
  const model=useMemo(()=>buildModel(schedule),[schedule]);
  const periods=useMemo(()=>derivePeriods(model),[model]);
  const selectedDose=schedule.doses.find((dose)=>dose.id===selectedDoseId)??null;
  const selectedDoseKind=selectedDose?forecastForDose(selectedDose,schedule,model):null;
  useEffect(()=>{if(initial.selectedPeriodKind){setSelectedPeriod(periods.find((period)=>period.kind===initial.selectedPeriodKind)??periods[0]??null)}},[initial.selectedPeriodKind,periods]);

  const changeView=(next:AppView)=>{setView(next);updateUrl({view:next==='my-day'?null:next,state:null});};
  const openDose=(id:string)=>{setSelectedDoseId(id);setSelectedPeriod(null);setOverviewOpen(false);updateUrl({state:`dose-${id}`});};
  const closeContext=()=>{setSelectedDoseId(null);setSelectedPeriod(null);setOverviewOpen(false);setShareOpen(false);updateUrl({state:null});};
  const contextTitle=shareOpen?'Share or export':overviewOpen?'Today at a glance':selectedDose?`${selectedDose.time} dose`:selectedPeriod?selectedPeriod.label:'Selection details';

  return <div className="app-shell" data-testid="app-shell"><a href="#main-content" className="skip-link">Skip to content</a><header className="app-header"><h1>{view==='my-day'?'My Day':view==='analyze'?'Analyze':'Schedule'}</h1>{view==='my-day'?<Button onPress={()=>changeView('schedule')}>Schedule</Button>:null}</header>{importError?<div className="import-alert" role="alert"><WarningCircleIcon size={24}/><span>{importError}</span><Button variant="quiet" aria-label="Dismiss import error" onPress={()=>setImportError(null)}>Dismiss</Button></div>:null}<div className="app-layout"><div className="app-content">{view==='my-day'?<MyDayView schedule={schedule} model={model} periods={periods} now={initial.now} onOverview={()=>{setOverviewOpen(true);setShareOpen(false);setSelectedDoseId(null);setSelectedPeriod(null);updateUrl({state:'overview'});}} onSelectDose={openDose}/>:null}{view==='analyze'?<AnalyzeView schedule={schedule} model={model} periods={periods} selectedDoseId={selectedDoseId} onSelectDose={setSelectedDoseId}/>:null}{view==='schedule'?<ScheduleView schedule={schedule} onChange={(next)=>{setSchedule(next);try{localStorage.setItem('levodopa-day-map-schedule-v1',JSON.stringify(next));}catch{}changeView('my-day');}} onShare={()=>{setShareOpen(true);setOverviewOpen(false);setSelectedDoseId(null);setSelectedPeriod(null);updateUrl({state:'sharing'});}}/>:null}</div><ContextSheet open={Boolean(selectedDose||selectedPeriod||overviewOpen||shareOpen)} title={contextTitle} onClose={closeContext}>{overviewOpen?<OverviewSheet periods={periods} onSelect={(period)=>{setOverviewOpen(false);setSelectedPeriod(period);updateUrl({state:`period-${period.kind}`});}}/>:null}{selectedDose&&selectedDoseKind?<DoseDetails dose={selectedDose} kind={selectedDoseKind} onAnalyze={()=>changeView('analyze')}/>:null}{selectedPeriod?<PeriodDetails period={selectedPeriod} onAnalyze={()=>changeView('analyze')}/>:null}{shareOpen?<ShareDisclosure schedule={schedule}/>:null}</ContextSheet></div><BottomNavigation view={view} onChange={changeView}/></div>;
}
