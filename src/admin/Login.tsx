import { useState } from 'react';
import type { FormEvent } from 'react';
import { ApiError, login } from './api';

export default function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(password);
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not reach the server.');
      setPassword('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-login">
      <form className="admin-card" onSubmit={submit}>
        <span className="label">The Committee</span>
        <h1 className="h2">Admin sign in</h1>
        <label className="field">
          <span className="label">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && (
          <p role="alert" className="admin-error">
            {error}
          </p>
        )}
        <button className="btn btn--primary" type="submit" disabled={busy || !password}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <a className="admin-link" href="/">
          Back to the site
        </a>
      </form>
    </main>
  );
}
