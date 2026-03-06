import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'admin_session';
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error('ADMIN_PASSWORD env var is not set');
  return secret;
}

export function checkPassword(input: string): boolean {
  const expected = getSecret();
  if (input.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(input), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function createToken(): string {
  const timestamp = Date.now().toString();
  const hmac = createHmac('sha256', getSecret()).update(timestamp).digest('hex');
  return `${timestamp}.${hmac}`;
}

export function verifyToken(token: string): boolean {
  const [timestamp, hmac] = token.split('.');
  if (!timestamp || !hmac) return false;

  const age = Date.now() - Number(timestamp);
  if (isNaN(age) || age < 0 || age > TOKEN_TTL_MS) return false;

  const expected = createHmac('sha256', getSecret()).update(timestamp).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(hmac), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function isAuthenticated(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return false;
  return verifyToken(match[1]);
}

export function sessionCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400`;
}

export function clearCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
}
