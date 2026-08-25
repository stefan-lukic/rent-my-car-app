import { describe, expect, it } from 'vitest';
import { isValidPhoneNumber, normalizePhoneNumber } from './phoneNumber';

describe('phone number helpers', () => {
  it.each(['+381 60 123 4567', '061/234-5678', '(021) 123 456'])(
    'accepts a supported phone number format: %s',
    (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(true);
    }
  );

  it.each(['', 'phone', '12345', '+381 60 ABC 123'])(
    'rejects an invalid phone number: %s',
    (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    }
  );

  it('removes separators while preserving an international prefix', () => {
    expect(normalizePhoneNumber('+381 (60) 123-4567')).toBe('+381601234567');
  });
});
