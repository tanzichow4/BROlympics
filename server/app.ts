import { existsSync } from 'node:fs';
import { join } from 'node:path';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { validateSeason } from '../src/data/validate';
import {
  COOKIE,
  cookieHeader,
  createToken,
  passwordMatches,
  readCookie,
  verifyToken,
} from './auth';
import { createStore } from './store';

export interface AppOptions {
  password: string;
  secret: string;
  dataFile: string;
  /** Built site to serve. Skipped if the folder does not exist (dev uses Vite). */
  distDir?: string;
  secureCookie?: boolean;
}

const MAX_FAILS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export function createApp(opts: AppOptions) {
  const app = express();
  const store = createStore(opts.dataFile);
  const secure = opts.secureCookie ?? false;
  const fails = new Map<string, { count: number; first: number }>();

  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'same-origin');
    next();
  });
  app.use('/api', (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  app.use(express.json({ limit: '256kb' }));

  const isAdmin = (req: Request) =>
    verifyToken(readCookie(req.headers.cookie, COOKIE), opts.secret);

  function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (!isAdmin(req)) return void res.status(401).json({ error: 'Not signed in.' });
    next();
  }

  app.get('/api/season', async (_req, res) => {
    res.json(await store.read());
  });

  app.get('/api/session', (req, res) => {
    res.json({ authenticated: isAdmin(req) });
  });

  app.post('/api/login', (req, res) => {
    const ip = req.ip ?? 'unknown';
    const now = Date.now();
    const rec = fails.get(ip);
    if (rec && now - rec.first > WINDOW_MS) fails.delete(ip);
    const current = fails.get(ip);
    if (current && current.count >= MAX_FAILS) {
      return void res.status(429).json({ error: 'Too many attempts. Try again later.' });
    }

    if (!passwordMatches(req.body?.password, opts.password)) {
      fails.set(ip, { count: (current?.count ?? 0) + 1, first: current?.first ?? now });
      return void res.status(401).json({ error: 'Wrong password.' });
    }
    fails.delete(ip);
    res.setHeader('Set-Cookie', cookieHeader(createToken(opts.secret), secure));
    res.json({ authenticated: true });
  });

  app.post('/api/logout', (_req, res) => {
    res.setHeader('Set-Cookie', cookieHeader('', secure, 0));
    res.json({ authenticated: false });
  });

  app.put('/api/season', requireAdmin, async (req, res) => {
    const errors = validateSeason(req.body);
    if (errors.length) return void res.status(400).json({ error: 'Invalid season data.', errors });
    await store.write(req.body);
    res.json(req.body);
  });

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found.' });
  });

  if (opts.distDir && existsSync(opts.distDir)) {
    const dist = opts.distDir;
    app.use(express.static(dist));
    // Single-page app: /admin and anything else serves the shell.
    app.use((req, res, next) => {
      if (req.method !== 'GET') return next();
      res.sendFile(join(dist, 'index.html'));
    });
  }

  // Last-resort error handler (bad JSON, write failures). Never leaks internals.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status && err.status < 500 ? err.status : 500;
    if (status === 500) console.error(err);
    res.status(status).json({ error: status === 500 ? 'Server error.' : 'Bad request.' });
  });

  return app;
}
