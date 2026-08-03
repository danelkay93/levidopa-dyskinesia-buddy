import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, vi } from 'vitest';
import { DEFAULT_SCHEDULE } from '@/domain/schedule';
import { ShareDisclosure } from './ShareDisclosure';

describe('ShareDisclosure', () => {
  afterEach(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
  });

  it('uses the native share sheet when available', async () => {
    const user = userEvent.setup();
    const share = vi.fn().mockResolvedValue(undefined);
    const writeText = vi.fn();
    Object.defineProperty(navigator, 'share', { configurable: true, value: share });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    render(<ShareDisclosure schedule={DEFAULT_SCHEDULE} />);

    await user.click(screen.getByRole('button', { name: 'Share schedule' }));

    expect(share).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('?s=') }));
    expect(writeText).not.toHaveBeenCalled();
    expect(await screen.findByText('Share sheet opened.')).toBeInTheDocument();
  });

  it('renders a selectable URL when native sharing and clipboard access are unavailable', async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    render(<ShareDisclosure schedule={DEFAULT_SCHEDULE} />);

    await user.click(screen.getByRole('button', { name: 'Share schedule' }));

    expect(await screen.findByText('Share link ready. Copy it below.')).toBeInTheDocument();
    expect((screen.getByRole('textbox', { name: 'Share link' }) as HTMLInputElement).value).toContain('?s=');
  });
});
