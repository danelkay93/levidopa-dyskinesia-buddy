import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    await user.click(screen.getByRole('button', { name: /See dose in Analyze/i }));
    expect(await screen.findByRole('heading', { name: 'Analyze', level: 1 })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
