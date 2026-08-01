import { ChartLineUpIcon, HouseIcon, SlidersHorizontalIcon } from '@phosphor-icons/react';
import type { AppView } from '@/app/url-state';
import { Button } from '@/components/ui/Button';

const items = [
  { id: 'my-day' as const, label: 'My Day', Icon: HouseIcon },
  { id: 'analyze' as const, label: 'Analyze', Icon: ChartLineUpIcon },
  { id: 'schedule' as const, label: 'Schedule', Icon: SlidersHorizontalIcon },
];
export function BottomNavigation({ view, onChange }: { view: AppView; onChange: (view: AppView) => void }) {
  return <nav className="primary-nav" aria-label="Primary navigation">{items.map(({ id, label, Icon }) => (
    <Button key={id} variant="quiet" className={view === id ? 'primary-nav__item is-active' : 'primary-nav__item'} aria-current={view === id ? 'page' : undefined} onPress={() => onChange(id)}>
      <Icon size={25} weight={view === id ? 'fill' : 'regular'} aria-hidden="true" />
      <span>{label}</span>
    </Button>
  ))}</nav>;
}
