import type { SVGProps } from 'react';
export function TabletIllustration({ half = false, ...props }: SVGProps<SVGSVGElement> & { half?: boolean }) {
  return (
    <svg viewBox="0 0 54 36" role="img" aria-label={half ? 'Half tablet' : 'Whole tablet'} {...props}>
      <path d="M13 10.5h28a8.5 8.5 0 0 1 0 17H13a8.5 8.5 0 0 1 0-17Z" fill="var(--surface)" stroke="currentColor" strokeWidth="2.5" />
      {half ? <path d="M27 11.5h14a7.5 7.5 0 0 1 0 15H27Z" fill="var(--accent-soft)" /> : null}
      <path d="M27 11.5v15" stroke="currentColor" strokeWidth="2" />
      <path d="M27 3v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
