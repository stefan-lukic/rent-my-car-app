import { describe, expect, it } from 'vitest';
import { generateVerificationToken, hashToken } from './emailVerification';

describe('generateVerificationToken', () => {
  it('returns rawToken, hash, and expires fields', () => {
    const result = generateVerificationToken();

    expect(result).toHaveProperty('rawToken');
    expect(result).toHaveProperty('hash');
    expect(result).toHaveProperty('expires');
    expect(result.expires instanceof Date).toBe(true);
  });

  it('generates a 64-character hex rawToken', () => {
    const result = generateVerificationToken();
    expect(result.rawToken).toHaveLength(64);
  });

  it('generates a sha256 matching hash', () => {
    const result = generateVerificationToken();
    expect(result.hash).toHaveLength(64);
  });

  it('sets expiry 24 hours from now', () => {
    const before = Date.now();
    const result = generateVerificationToken();
    const after = Date.now();
    const expected = new Date(before + 24 * 60 * 60 * 1000);

    expect(result.expires.getTime()).toBeGreaterThanOrEqual(expected.getTime());
    expect(result.expires.getTime()).toBeLessThanOrEqual(
      after + 24 * 60 * 60 * 1000
    );
  });

  it('generates unique tokens on each call', () => {
    const first = generateVerificationToken();
    const second = generateVerificationToken();
    expect(first.rawToken).not.toBe(second.rawToken);
  });
});

describe('hashToken', () => {
  it('returns a sha256 hex hash of the input', () => {
    const token = 'my-secret-token';
    const result = hashToken(token);

    expect(result).toHaveLength(64);
    expect(result).toMatch(/^[0-9a-f]+$/);
  });

  it('produces consistent hashes for the same input', () => {
    const token = 'consistent-input';
    const first = hashToken(token);
    const second = hashToken(token);
    expect(first).toBe(second);
  });
});
