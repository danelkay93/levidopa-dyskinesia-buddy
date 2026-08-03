import { useMemo, useState } from 'react';
import { bisector, max } from 'd3-array';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { LinePath } from '@visx/shape';
import { occurrencesInDisplayWindow, type ModelResult } from '@/model/pk';
import { minuteToTime } from '@/domain/schedule';

export function ExposureChart({ model, selectedDoseId, onSelectDose }: { model: ModelResult; selectedDoseId: string | null; onSelectDose: (id: string | null) => void }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const width = 680, height = 400, margin = { top: 26, right: 20, bottom: 50, left: 52 };
  const x = useMemo(() => scaleLinear({ domain: [model.times[0], model.times.at(-1)!], range: [margin.left, width-margin.right] }), [model.times]);
  const maxY = Math.max(1, max(model.total) ?? 1);
  const y = useMemo(() => scaleLinear({ domain: [0, maxY], range: [height-margin.bottom, margin.top] }), [maxY]);
  const displayedOccurrences = useMemo(() => occurrencesInDisplayWindow(model), [model]);
  const selected = selectedDoseId ? displayedOccurrences.find((item) => item.doseId === selectedDoseId) : null;
  const nearest = bisector<number, number>((d) => d).center;
  const selectStrongestDoseAt = (index: number) => {
    let strongest = displayedOccurrences[0];
    for (const occurrence of displayedOccurrences.slice(1)) {
      if (occurrence.displayCurve[index] > strongest.displayCurve[index]) strongest = occurrence;
    }
    if (strongest?.displayCurve[index] > 0.04) onSelectDose(strongest.doseId);
  };
  return <div className="technical-chart"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="chart-title chart-desc" onPointerMove={(event) => { const bounds=event.currentTarget.getBoundingClientRect(); const local=((event.clientX-bounds.left)/bounds.width)*width; setSelectedIndex(nearest(model.times, x.invert(local))); }} onPointerLeave={() => setSelectedIndex(null)} onClick={() => { if (selectedIndex !== null) selectStrongestDoseAt(selectedIndex); }}>
    <title id="chart-title">Technical modeled exposure curve</title><desc id="chart-desc">A 24-hour modeled curve from 06:00 to 06:00. Use the accessible dose list below to select individual contributions.</desc>
    <Group>{Array.from({length:5},(_,i)=>{const value=maxY*(i/4);return <line key={i} x1={margin.left} x2={width-margin.right} y1={y(value)} y2={y(value)} className="chart-grid"/>})}<rect x={margin.left} y={y(0.10)} width={width-margin.left-margin.right} height={height-margin.bottom-y(0.10)} className="chart-low-zone"/><LinePath data={model.times} x={(minute)=>x(minute)} y={(_,index)=>y(model.total[index])} stroke="var(--accent-strong)" strokeWidth={5}/>{selected ? <LinePath data={model.times} x={(minute)=>x(minute)} y={(_,index)=>y(selected.displayCurve[index])} stroke="var(--period-building)" strokeWidth={3} strokeDasharray="7 6"/> : null}{displayedOccurrences.map((occurrence)=><g key={occurrence.doseId} onClick={(event)=>{event.stopPropagation();onSelectDose(occurrence.doseId)}}><line x1={x(occurrence.time)} x2={x(occurrence.time)} y1={margin.top} y2={height-margin.bottom} className="dose-guide"/><rect x={x(occurrence.time)-21} y={margin.top-2} width={42} height={28} rx={12} className={selectedDoseId===occurrence.doseId?'dose-marker is-selected':'dose-marker'}/><text x={x(occurrence.time)} y={margin.top+17} textAnchor="middle" className="dose-marker-text">{occurrence.mg}</text></g>)}{selectedIndex!==null ? <><line x1={x(model.times[selectedIndex])} x2={x(model.times[selectedIndex])} y1={margin.top} y2={height-margin.bottom} className="chart-cursor"/><circle cx={x(model.times[selectedIndex])} cy={y(model.total[selectedIndex])} r={7} className="chart-cursor-dot"/></>:null}<AxisLeft left={margin.left} scale={y} numTicks={4} tickFormat={(value)=>`${Math.round(Number(value)*100)}%`} hideAxisLine hideTicks tickLabelProps={()=>({fill:'var(--text-muted)',fontSize:13,textAnchor:'end',dx:-8,dy:4})}/><AxisBottom top={height-margin.bottom} scale={x} tickValues={[360,720,1080,1440,1800]} tickFormat={(value)=>minuteToTime(Number(value))} hideAxisLine hideTicks tickLabelProps={()=>({fill:'var(--text-muted)',fontSize:13,textAnchor:'middle',dy:14})}/></Group>
  </svg>{selectedIndex!==null?<div className="chart-readout" aria-live="polite">{minuteToTime(model.times[selectedIndex])} · {Math.round(model.total[selectedIndex]*100)}% of the isolated 200 mg reference peak</div>:null}</div>;
}
