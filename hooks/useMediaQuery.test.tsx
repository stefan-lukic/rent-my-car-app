/**
 * useMediaQuery.test.tsx
 *
 * useMediaQuery hook omogućava reakciju na promene media query-ja
 * (npr. promena veličine ekrana). Hook:
 *   - Inicijalizuje matches state od window.matchMedia(query).matches
 *   - Dodaje 'change' event listener za ažuriranje matches
 *   - Uklanja event listener pri unmount-u (cleanup)
 *   - Ponovo subscribuje kada se query promeni
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je hook test — testiraju se stvarni state i lifecycle hook-a.
 * - Koristimo renderHook + act iz React Testing Library.
 * - window.matchMedia je mockovani global (vi.stubGlobal) da ne bismo
 *   zavisili od stvarnog browsera.
 * - MatchMedia mock prati subscribe/unsubscribe kroz Set i mock
 *   funkcije za addEventListener/removeEventListener.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - useMediaQuery zavisi od browser global-a (window.matchMedia).
 * - Zato ga ne možemo testirati direktno — moramo da mockujemo.
 * - Testiramo: inicijalnu vrednost, ažuriranje na change event,
 *   cleanup pri unmount-u, i re-subscribe pri query promeni.
 */

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useMediaQuery from './useMediaQuery';

describe('useMediaQuery', () => {
  /**
   * listeners: Set koji prati sve registrovane callback-e za change event.
   * Značaj: Omogućava nam da simuliramo media query change event
   * i da proverimo da hook ispravno reaguje.
   */
  let listeners: Set<(event: MediaQueryListEvent) => void>;
  let removeEventListener: ReturnType<typeof vi.fn>;
  let matches = false;

  beforeEach(() => {
    /**
     * Inicijalizacija listeners i removeEventListener za svaki test.
     * Značaj: Svaki test počinje sa čistim listener Set-om i
     * mockovanim removeEventListener funkcijom (za proveru cleanup-a).
     */
    listeners = new Set();
    removeEventListener = vi.fn();

    /**
     * Mockujemo window.matchMedia global.
     * Značaj: useMediaQuery koristi window.matchMedia(query) da bi
     * dobio MediaQueryList objekat. U jsdom ovo ne postoji, pa
     * moramo da mockujemo.
     *
     * Mock vraća objekat sa:
     * - get matches(): getter koji vraća trenutnu vrednost `matches`
     * - addEventListener: dodaje callback u listeners Set ako je event 'change'
     * - removeEventListener: mock za proveru cleanup-a
     * - addListener/removeListener: legacy metode (ne koristimo)
     * - dispatchEvent: mock za proveru da li je event dispatch-ovan
     */
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
    /**
     * Cleanup: Uklanjamo sve stubove nakon svakog testa.
     * Značaj: Ovo osigurava da mockovi iz jednog testa ne utiču
     * na drugi test.
     */
    vi.unstubAllGlobals();
  });

  /**
   * TEST 1: Inicijalna vrednost matches
   * ZAŠTO: useMediaQuery treba da vrati trenutnu vrednost
   * window.matchMedia(query).matches pri prvom render-u.
   * KAKO:
   * 1. Postavimo matches = true (simuliramo da query match-uje)
   * 2. Renderujemo hook sa query '(max-width: 680px)'
   * 3. Proveravamo da je result.current = true
   */
  it('returns the initial matchMedia value', () => {
    matches = true;

    const { result } = renderHook(() =>
      useMediaQuery('(max-width: 680px)')
    );

    expect(result.current).toBe(true);
  });

  /**
   * TEST 2: Ažuriranje nakon media query change event-a
   * ZAŠTO: Kada se promeni media query (npr. korisnik resize-uje
   * prozor), useMediaQuery treba da ažurira svoj matches state.
   * KAKO:
   * 1. Postavimo matches = false (inicijalno ne match-uje)
   * 2. Renderujemo hook
   * 3. Proveravamo da je result.current = false
   * 4. Simuliramo change event: postavimo matches = true i
   *    pozovemo sve registrovane listener-e
   * 5. Proveravamo da je result.current ažuriran na true
   */
  it('updates after media query change event', () => {
    matches = false;

    const { result } = renderHook(() =>
      useMediaQuery('(max-width: 680px)')
    );

    expect(result.current).toBe(false);

    act(() => {
      matches = true;

      listeners.forEach((listener) => {
        listener({ matches: true } as MediaQueryListEvent);
      });
    });

    expect(result.current).toBe(true);
  });

  /**
   * TEST 3: Uklanjanje listener-a pri unmount-u
   * ZAŠTO: useMediaQuery treba da očisti (ukloni) event listener
   * pri unmount-u da ne bi došlo do memory leak-a.
   * KAKO:
   * 1. Renderujemo hook
   * 2. Unmount-ujemo hook (pozivamo unmount())
   * 3. Proveravamo da je removeEventListener pozvan sa
   *    'change' i bilo kojom funkcijom (expect.any(Function))
   */
  it('removes the change listener when unmounted', () => {
    const { unmount } = renderHook(() =>
      useMediaQuery('(max-width: 680px)')
    );

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  /**
   * TEST 4: Ponovno subscribe pri promeni query-ja
   * ZAŠTO: Kada se promeni query string (npr. sa '(max-width: 680px)'
   * na '(min-width: 681px)'), useMediaQuery treba da:
   * 1. Kreira novi matchMedia objekat sa novim query-jem
   * 2. Dodaje novi event listener
   * KAKO:
   * 1. Renderujemo hook sa initialProps: query: '(max-width: 680px)'
   * 2. Rerenderujemo hook sa novim query: '(min-width: 681px)'
   * 3. Proveravamo da je window.matchMedia pozvan sa novim query-jem
   */
  it('creates a new subscription when query changes', () => {
    const { rerender } = renderHook(
      ({ query }) => useMediaQuery(query),
      {
        initialProps: {
          query: '(max-width: 680px)',
        },
      }
    );

    rerender({
      query: '(min-width: 681px)',
    });

    expect(window.matchMedia).toHaveBeenCalledWith(
      '(min-width: 681px)'
    );
  });
});