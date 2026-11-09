// @vitest-environment node
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { DEFAULT_SEASON } from '../src/data/defaults';
import { createApp } from './app';
import { createToken, verifyToken } from './auth';

const PASSWORD = 'correct horse';
const SECRET = 'a-test-secret-that-is-long-enough';

let dir: string;
let app: ReturnType<typeof createApp>;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'brolympics-'));
  app = createApp({ password: PASSWORD, secret: SECRET, dataFile: join(dir, 'season.json') });
});
afterEach(() => rm(dir, { recursive: true, force: true }));

async function signIn() {
  const res = await request(app).post('/api/login').send({ password: PASSWORD });
  return res.headers['set-cookie'] as unknown as string[];
}

describe('public API', () => {
  it('serves the default season when nothing is saved', async () => {
    const res = await request(app).get('/api/season');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(DEFAULT_SEASON);
  });

  it('reports signed-out sessions', async () => {
    const res = await request(app).get('/api/session');
    expect(res.body).toEqual({ authenticated: false });
  });
});

describe('login', () => {
  it('rejects a wrong password', async () => {
    const res = await request(app).post('/api/login').send({ password: 'nope' });
    expect(res.status).toBe(401);
    expect(res.headers['set-cookie']).toBeUndefined();
  });

  it('sets an HttpOnly, SameSite=Strict cookie on success', async () => {
    const res = await request(app).post('/api/login').send({ password: PASSWORD });
    expect(res.status).toBe(200);
    const cookie = (res.headers['set-cookie'] as unknown as string[])[0];
    expect(cookie).toMatch(/HttpOnly/);
    expect(cookie).toMatch(/SameSite=Strict/);
  });

  it('locks out after repeated failures', async () => {
    for (let i = 0; i < 5; i++) await request(app).post('/api/login').send({ password: 'bad' });
    const res = await request(app).post('/api/login').send({ password: PASSWORD });
    expect(res.status).toBe(429);
  });

  it('recognises a signed-in session', async () => {
    const cookie = await signIn();
    const res = await request(app).get('/api/session').set('Cookie', cookie);
    expect(res.body).toEqual({ authenticated: true });
  });
});

describe('saving', () => {
  it('refuses to save without signing in', async () => {
    const res = await request(app).put('/api/season').send(DEFAULT_SEASON);
    expect(res.status).toBe(401);
  });

  it('refuses a forged cookie', async () => {
    const res = await request(app)
      .put('/api/season')
      .set('Cookie', 'brolympics_admin=abc.def')
      .send(DEFAULT_SEASON);
    expect(res.status).toBe(401);
  });

  it('rejects invalid data with a list of problems', async () => {
    const cookie = await signIn();
    const bad = structuredClone(DEFAULT_SEASON);
    bad.events[0].results.pop();
    const res = await request(app).put('/api/season').set('Cookie', cookie).send(bad);
    expect(res.status).toBe(400);
    expect(res.body.errors.join(' ')).toMatch(/all five teams/);
  });

  it('saves valid data and serves it back publicly', async () => {
    const cookie = await signIn();
    const next = structuredClone(DEFAULT_SEASON);
    next.teams.navy.name = 'Team Midnight';
    const put = await request(app).put('/api/season').set('Cookie', cookie).send(next);
    expect(put.status).toBe(200);

    const get = await request(app).get('/api/season');
    expect(get.body.teams.navy.name).toBe('Team Midnight');
    expect(JSON.parse(await readFile(join(dir, 'season.json'), 'utf-8')).teams.navy.name).toBe(
      'Team Midnight',
    );
  });

  it('signs out', async () => {
    const res = await request(app).post('/api/logout');
    expect((res.headers['set-cookie'] as unknown as string[])[0]).toMatch(/Max-Age=0/);
  });
});

describe('tokens', () => {
  it('expire and reject tampering', () => {
    const now = 1_000_000;
    const token = createToken(SECRET, now);
    expect(verifyToken(token, SECRET, now + 1000)).toBe(true);
    expect(verifyToken(token, SECRET, now + 9 * 60 * 60 * 1000)).toBe(false);
    expect(verifyToken(token, 'another-secret-entirely', now)).toBe(false);
    expect(verifyToken(token.replace(/.$/, 'x'), SECRET, now)).toBe(false);
    expect(verifyToken(undefined, SECRET)).toBe(false);
  });
});
