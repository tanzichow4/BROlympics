import { createHmac, createHash, timingSafeEqual } from 'node:crypto';

export const COOKIE = 'brolympics_admin';
const SESSION_MS = 8 * 60 * 60 * 1000; // 8 hours

const b64 = (s: string) => Buffer.from(s).toString('base64url');
const mac = (data: string, secret: string) =>
  createHmac('sha256', secret).update(data).digest('base64url');

function safeEqual(a: string, b: string): boolean {
  // Hash first so both buffers are the same length, then compare in constant time.
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export const passwordMatches = (given: unknown, expected: string) =>
  typeof given === 'string' && safeEqual(given, expected);

/** A signed, expiring session token. Nothing secret is stored in it. */
export function createToken(secret: string, now = Date.now()): string {
  const payload = b64(JSON.stringify({ exp: now + SESSION_MS }));
  return `${payload}.${mac(payload, secret)}`;
}

export function verifyToken(token: string | undefined, secret: string, now = Date.now()): boolean {
  if (!token) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig || !safeEqual(sig, mac(payload, secret))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return typeof exp === 'number' && exp > now;
  } catch {
    return false;
  }
}

export function readCookie(header: string | undefined, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return undefined;
}

export function cookieHeader(value: string, secure: boolean, maxAgeSeconds = SESSION_MS / 1000) {
  return [
    `${COOKIE}=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${maxAgeSeconds}`,
    secure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');
}
