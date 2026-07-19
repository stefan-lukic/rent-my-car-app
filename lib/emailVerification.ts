import { randomBytes, createHash } from 'crypto';

export function generateVerificationToken(): {
  rawToken: string;
  hash: string;
  expires: Date;
} {
  const rawToken = randomBytes(32).toString('hex');
  const hash = createHash('sha256').update(rawToken).digest('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); 
  return { rawToken, hash, expires };
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
