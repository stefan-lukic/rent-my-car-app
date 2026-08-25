import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useMediaQuery from './useMediaQuery';

describe('useMediaQuery', () => {
  let listeners: Set<(event: MediaQueryListEvent) => void>;
  let removeEventListener: ReturnType<typeof vi.fn>;
  let matches = false;

  beforeEach(() => {
    listeners = new Set();
    removeEventListener = vi.fn();

    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        get matches() {
          return matches;
        },
        media: '',
        onchange: null,
        addEventListener: (
          eventName: string,
          callback: (event: MediaQueryListEvent) => void
        ) => {
          if (eventName === 'change') {
            listeners.add(callback);
          }
        },
        removeEventListener,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the initial matchMedia value', () => {
    matches = true;

    const { result } = renderHook(() => useMediaQuery('(max-width: 680px)'));

    expect(result.current).toBe(true);
  });

  it('updates after media query change event', () => {
    matches = false;

    const { result } = renderHook(() => useMediaQuery('(max-width: 680px)'));

    expect(result.current).toBe(false);

    act(() => {
      matches = true;

      listeners.forEach((listener) => {
        listener({ matches: true } as MediaQueryListEvent);
      });
    });

    expect(result.current).toBe(true);
  });

  it('removes the change listener when unmounted', () => {
    const { unmount } = renderHook(() => useMediaQuery('(max-width: 680px)'));

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('creates a new subscription when query changes', () => {
    const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: {
        query: '(max-width: 680px)',
      },
    });

    rerender({
      query: '(min-width: 681px)',
    });

    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 681px)');
  });
});
