import type { Season } from '../data/types';

export class ApiError extends Error {
  status: number;
  errors: string[];
  constructor(status: number, message: string, errors: string[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, body.error ?? 'Request failed.', body.errors);
  return body as T;
}

export const getSession = () => request<{ authenticated: boolean }>('/api/session');
export const login = (password: string) =>
  request<{ authenticated: boolean }>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
export const logout = () => request<{ authenticated: boolean }>('/api/logout', { method: 'POST' });
export const getSeason = () => request<Season>('/api/season');
export const saveSeason = (season: Season) =>
  request<Season>('/api/season', { method: 'PUT', body: JSON.stringify(season) });
