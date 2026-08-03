import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { DEFAULT_SCHEDULE, MAX_SCHEDULE_DOSES, type Schedule } from '@/domain/schedule';
import { ScheduleView } from './ScheduleView';

describe('ScheduleView', () => {
  it('shares the current editor draft before it is saved', async () => {
    const user = userEvent.setup();
    const onShare = vi.fn();
    render(<ScheduleView schedule={DEFAULT_SCHEDULE} onChange={vi.fn()} onShare={onShare} />);

    await user.click(screen.getByRole('button', { name: /Increase 07:30 dose/i }));
    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(onShare).toHaveBeenCalledWith(expect.objectContaining({
      doses: expect.arrayContaining([expect.objectContaining({ id: 'dose-0730', mg: 225 })]),
    }));
  });

  it('stops adding doses at the schema limit', () => {
    const schedule: Schedule = {
      version: 1,
      doses: Array.from({ length: MAX_SCHEDULE_DOSES }, (_, index) => ({
        id: `dose-${index}`,
        time: `${String(6 + Math.floor(index / 2)).padStart(2, '0')}:${index % 2 ? '30' : '00'}`,
        mg: 100,
        formulation: 'CR',
        tabletFraction: 0.5,
      })),
    };

    render(<ScheduleView schedule={schedule} onChange={vi.fn()} onShare={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Add another dose' })).toBeDisabled();
    expect(screen.getByText(`Maximum of ${MAX_SCHEDULE_DOSES} doses reached.`)).toBeInTheDocument();
  });
});
