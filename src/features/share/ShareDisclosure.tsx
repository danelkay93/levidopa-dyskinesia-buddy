import { CheckCircleIcon, DownloadSimpleIcon, LinkSimpleIcon, WarningCircleIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import type { Schedule } from '@/domain/schedule';
import { encodeSchedule } from '@/app/url-state';
import { Button } from '@/components/ui/Button';

export function ShareDisclosure({ schedule }: { schedule: Schedule }) {
  const [status,setStatus]=useState('');
  const create=async()=>{const url=new URL(window.location.href);url.search='';url.searchParams.set('s',encodeSchedule(schedule));try{await navigator.clipboard.writeText(url.toString());setStatus('Share link copied.');}catch{setStatus('Share link created. Copy it from the address bar.');}};
  return <div className="share-disclosure"><p>Share without an account or cloud record.</p><section><h3>What will be shared</h3><ul><li>Scheduled dose times</li><li>Levodopa amounts</li><li>Whole or half-tablet form</li><li>Model schema version</li></ul></section><section className="share-excluded"><h3><WarningCircleIcon/>Not included</h3><p>Names, notes, symptoms, or hidden metadata.</p></section><Button variant="primary" onPress={create}><LinkSimpleIcon/>Create share link</Button><Button variant="secondary" onPress={()=>{const blob=new Blob([JSON.stringify(schedule,null,2)],{type:'application/json'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='levodopa-day-map-schedule.json';link.click();URL.revokeObjectURL(link.href);}}><DownloadSimpleIcon/>Export schedule file</Button>{status?<p className="share-status" role="status"><CheckCircleIcon/>{status}</p>:null}</div>;
}
