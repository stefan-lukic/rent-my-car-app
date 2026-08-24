import { describe, expect, it, vi, afterEach } from 'vitest';
import { isMobileCSR } from './deviceDetectionCSR';

describe('isMobileCSR', () => {
  const originalWidth = window.innerWidth;

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalWidth,
    });
  });

  it('returns true when width is 680 or less', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 680,
    });

    expect(isMobileCSR()).toBe(true);
  });

  it('returns false when width is above 680', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    expect(isMobileCSR()).toBe(false);
  });

  it('returns true at exactly 680', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 680,
    });

    expect(isMobileCSR()).toBe(true);
  });

  it('returns true at exactly 1', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1,
    });

    expect(isMobileCSR()).toBe(true);
  });
});
