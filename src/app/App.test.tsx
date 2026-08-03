import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { App } from './App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/?now=09:30');
  });

  it('renders the calm My Day hierarchy and opens a dose explanation', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Medication is building' })).toBeInTheDocument();
    const nextDose = screen.getByRole('button', { name: /Next dose at 11:30/i });
    await user.click(nextDose);
    expect(screen.getByText(/deterministic schedule model/i)).toBeInTheDocument();
  });

  it('navigates to Analyze and closes the phone context sheet', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Next dose at 11:30/i }));
    expect(new URL(window.location.href).searchParams.get('state')).toBe('dose-1130');
    await user.click(screen.getByRole('button', { name: /See dose in Analyze/i }));
    expect(await screen.findByRole('heading', { name: 'Analyze', level: 1 })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(new URL(window.location.href).searchParams.get('state')).toBe('dose-1130');
  });

  it('creates a share link from the unsaved editor draft', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    window.history.replaceState({}, '', '/?view=schedule&now=09:30');
    render(<App />);

    await user.click(await screen.findByRole('button', { name: /Increase 07:30 dose/i }));
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(await screen.findByRole('button', { name: 'Share schedule' }));

    const sharedUrl = new URL(writeText.mock.calls[0][0]);
    const encoded = sharedUrl.searchParams.get('s')!;
    const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(window.atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')));
    expect(decoded.doses[0].mg).toBe(225);
  });

  it('orders later doses chronologically across the 06:00 display boundary', async () => {
    window.history.replaceState({}, '', '/?fixture=midnight&now=10:00');
    render(<App />);

    const doseStations = await screen.findAllByRole('button', { name: /dose at/i });
    expect(doseStations.map((station) => station.getAttribute('aria-label'))).toEqual([
      expect.stringMatching(/Next dose at 11:30/i),
      expect.stringMatching(/Dose at 17:30/i),
      expect.stringMatching(/Dose at 23:30/i),
      expect.stringMatching(/Dose at 05:30/i),
    ]);
  });

  it('labels Analyze periods with clock times rather than internal model minutes', async () => {
    const user = userEvent.setup();
    window.history.replaceState({}, '', '/?view=analyze&fixture=midnight&now=10:00');
    render(<App />);

    await user.click(await screen.findByRole('tab', { name: 'Periods' }));
    expect(await screen.findByText('06:00–07:40')).toBeInTheDocument();
    expect(screen.queryByText(/modeled minutes/i)).not.toBeInTheDocument();
  });
});
