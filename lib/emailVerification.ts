import { randomBytes, createHash } from 'crypto';

export const EMAIL_VERIFICATION_EXPIRATION_MS = 24 * 60 * 60 * 1000;

export const PASSWORD_RESET_EXPIRATION_MS = 60 * 60 * 1000;

export function generateVerificationToken(
  expirationMs = EMAIL_VERIFICATION_EXPIRATION_MS
): {
  rawToken: string;
  hash: string;
  expires: Date;
} {
  const rawToken = randomBytes(32).toString('hex');
  const hash = createHash('sha256').update(rawToken).digest('hex');

  const expires = new Date(Date.now() + expirationMs);

  return { rawToken, hash, expires };
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
