import { CheckCircleIcon, DownloadSimpleIcon, LinkSimpleIcon, WarningCircleIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import type { Schedule } from '@/domain/schedule';
import { encodeSchedule } from '@/app/url-state';
import { Button } from '@/components/ui/Button';
import { downloadSchedule } from './download-schedule';

export function ShareDisclosure({ schedule }: { schedule: Schedule }) {
  const [status, setStatus] = useState('');
  const [fallbackUrl, setFallbackUrl] = useState('');

  const create = async () => {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('s', encodeSchedule(schedule));
    const shareUrl = url.toString();
    setFallbackUrl('');

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'Levodopa Day Map schedule',
          text: 'Open this schedule in Levodopa Day Map.',
          url: shareUrl,
        });
        setStatus('Share sheet opened.');
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          setFallbackUrl(shareUrl);
          setStatus('Sharing canceled. The link is ready below.');
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus('Share link copied.');
    } catch {
      setFallbackUrl(shareUrl);
      setStatus('Share link ready. Copy it below.');
    }
  };

  return <div className="share-disclosure"><p>Share without an account or cloud record.</p><section><h3>What will be shared</h3><ul><li>Scheduled dose times</li><li>Levodopa amounts</li><li>Whole or half-tablet form</li><li>Model schema version</li></ul></section><section className="share-excluded"><h3><WarningCircleIcon/>Not included</h3><p>Names, notes, symptoms, or hidden metadata.</p></section><Button variant="primary" onPress={create}><LinkSimpleIcon/>Share schedule</Button><Button variant="secondary" onPress={() => downloadSchedule(schedule)}><DownloadSimpleIcon/>Export schedule file</Button>{status?<p className="share-status" role="status">{fallbackUrl ? <LinkSimpleIcon/> : <CheckCircleIcon/>}{status}</p>:null}{fallbackUrl ? <label className="share-fallback"><span>Share link</span><input type="url" readOnly value={fallbackUrl} onFocus={(event) => event.currentTarget.select()} /></label> : null}</div>;
}
