import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows the next event in the hero', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/dodgeball/i);
  });

  it('lists all eight events in the schedule', () => {
    render(<App />);
    const list = document.querySelector('#schedule ol') as HTMLElement;
    expect(within(list).getAllByRole('listitem')).toHaveLength(8);
  });

  it('shows a zero-point table before any event is played', () => {
    render(<App />);
    const body = document.querySelector('#standings tbody') as HTMLElement;
    const rows = within(body).getAllByRole('row');
    expect(rows).toHaveLength(5);
    expect(rows[0]).not.toHaveClass('is-leader');
  });

  it('shows TBD for events without a date', () => {
    render(<App />);
    const list = document.querySelector('#schedule ol') as HTMLElement;
    expect(within(list).getAllByText('TBD', { exact: false }).length).toBeGreaterThanOrEqual(7);
  });

  it('toggles and remembers the theme', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Day' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'day');
    expect(localStorage.getItem('brolympics-theme')).toBe('day');
    expect(screen.getByRole('button', { name: 'Night' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('switches events with the keyboard', async () => {
    render(<App />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    tabs[0].focus();
    await userEvent.keyboard('{End}');
    expect(tabs[7]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent(/flag football/i);
    await userEvent.keyboard('{ArrowRight}');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('shows an empty state for an event with no result yet', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('tab', { name: /basketball/i }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent(/no result yet/i);
  });
});
