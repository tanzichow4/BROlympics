import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DEFAULT_SEASON } from '../data/defaults';
import Admin from './Admin';

type Handler = (init?: RequestInit) => { status?: number; body: unknown };

function mockApi(routes: Record<string, Handler>) {
  const calls: { url: string; init?: RequestInit }[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, init });
      const handler = routes[`${init?.method ?? 'GET'} ${url}`];
      const { status = 200, body } = handler ? handler(init) : { status: 404, body: {} };
      return { ok: status < 400, status, json: async () => body } as Response;
    }),
  );
  return calls;
}

afterEach(() => vi.unstubAllGlobals());

describe('Admin', () => {
  it('asks signed-out visitors to log in', async () => {
    mockApi({ 'GET /api/session': () => ({ body: { authenticated: false } }) });
    render(<Admin />);
    expect(await screen.findByRole('heading', { name: /admin sign in/i })).toBeInTheDocument();
  });

  it('shows an error for a wrong password', async () => {
    mockApi({
      'GET /api/session': () => ({ body: { authenticated: false } }),
      'POST /api/login': () => ({ status: 401, body: { error: 'Wrong password.' } }),
    });
    render(<Admin />);
    await userEvent.type(await screen.findByLabelText(/password/i), 'nope');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Wrong password.');
  });

  it('lets a signed-in admin edit and save', async () => {
    const calls = mockApi({
      'GET /api/session': () => ({ body: { authenticated: true } }),
      'GET /api/season': () => ({ body: DEFAULT_SEASON }),
      'PUT /api/season': (init) => ({ body: JSON.parse(String(init?.body)) }),
    });
    render(<Admin />);

    const name = await screen.findByDisplayValue('Team Navy');
    const save = screen.getByRole('button', { name: /save changes/i });
    expect(save).toBeDisabled();

    await userEvent.clear(name);
    await userEvent.type(name, 'Team Midnight');
    expect(save).toBeEnabled();
    await userEvent.click(save);

    expect(await screen.findByRole('status')).toHaveTextContent('Saved');
    const put = calls.find((c) => c.init?.method === 'PUT');
    expect(JSON.parse(String(put?.init?.body)).teams.navy.name).toBe('Team Midnight');
  });

  it('blocks saving invalid data client-side', async () => {
    const calls = mockApi({
      'GET /api/session': () => ({ body: { authenticated: true } }),
      'GET /api/season': () => ({ body: DEFAULT_SEASON }),
    });
    render(<Admin />);
    const name = await screen.findByDisplayValue('Team Navy');
    await userEvent.clear(name);
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/needs a name/i);
    expect(calls.some((c) => c.init?.method === 'PUT')).toBe(false);
  });
});
