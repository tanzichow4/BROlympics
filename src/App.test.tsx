import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('renders the heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /brolympics/i })).toBeInTheDocument();
  });

  it('increments the counter on click', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('Count is 1');
  });
});
