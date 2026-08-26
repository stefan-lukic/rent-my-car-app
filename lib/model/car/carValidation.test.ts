import { describe, expect, it } from 'vitest';
import {
  CAR_MODEL_PATTERN,
  isNumberInRange,
  normalizeLegacyNumericValue,
} from './carValidation';

describe('car validation', () => {
  it('accepts realistic alphanumeric car model names', () => {
    expect(CAR_MODEL_PATTERN.test('Golf 7')).toBe(true);
    expect(CAR_MODEL_PATTERN.test('A4')).toBe(true);
    expect(CAR_MODEL_PATTERN.test('CX-5')).toBe(true);
    expect(CAR_MODEL_PATTERN.test('!!!')).toBe(false);
  });

  it('validates whole and decimal numbers within their limits', () => {
    expect(isNumberInRange('150', 1, 2000, true)).toBe(true);
    expect(isNumberInRange('150.5', 1, 2000, true)).toBe(false);
    expect(isNumberInRange('6.5', 0.1, 100)).toBe(true);
    expect(isNumberInRange('z', 0.1, 100)).toBe(false);
    expect(isNumberInRange('101', 0.1, 100)).toBe(false);
    expect(isNumberInRange('50000', 0, 1000000, true)).toBe(true);
  });

  it('extracts numbers from legacy values containing units', () => {
    expect(normalizeLegacyNumericValue('7.5 L/100km')).toBe('7.5');
    expect(normalizeLegacyNumericValue('136 HP')).toBe('136');
  });
});
