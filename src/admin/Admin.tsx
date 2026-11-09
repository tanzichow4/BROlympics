import { useCallback, useEffect, useState } from 'react';
import type { Season } from '../data/types';
import { getSeason, getSession, logout } from './api';
import Editor from './Editor';
import Login from './Login';
import './admin.css';

type State = { kind: 'loading' } | { kind: 'login' } | { kind: 'editing'; season: Season };

/** /admin: sign in, then edit the season. Everything is enforced again on the server. */
export default function Admin() {
  const [state, setState] = useState<State>({ kind: 'loading' });

  const load = useCallback(async () => {
    try {
      const { authenticated } = await getSession();
      if (!authenticated) return setState({ kind: 'login' });
      setState({ kind: 'editing', season: await getSeason() });
    } catch {
      setState({ kind: 'login' });
    }
  }, []);

  useEffect(() => {
    document.title = 'Admin — Brolympics';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  if (state.kind === 'loading') {
    return (
      <main className="admin-login">
        <p className="label">Loading…</p>
      </main>
    );
  }
  if (state.kind === 'login') return <Login onSuccess={load} />;

  return (
    <Editor
      initial={state.season}
      onSignedOut={() => setState({ kind: 'login' })}
      onLogout={async () => {
        await logout().catch(() => undefined);
        setState({ kind: 'login' });
      }}
    />
  );
}
