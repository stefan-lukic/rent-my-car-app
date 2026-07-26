/**
 * useAuth.test.tsx
 *
 * useAuth hook upravlja autentikacionim state-om aplikacije:
 *   - loading: true dok se sesija učitava
 *   - isAuthenticated: true ako je korisnik ulogovan
 *   - user: objekat sa podacima korisnika (iz NextAuth session)
 *   - login(email, password): poziva signIn('credentials') i vraća Promise
 *   - logout(): poziva signOut({ redirect: false })
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je hook test — testiraju se stvarni state i grane hook-a.
 * - Koristimo renderHook + act iz React Testing Library.
 * - next-auth/react je mockovan (vi.hoisted) da ne bismo izvodili
 *   stvarnu autentikaciju.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - useAuth je "thin" hook — samo omotuje NextAuth funkcionalnosti.
 * - Zato testiramo: state za loading/authenticated, pozive signIn/signOut,
 *   i error handling za login.
 * - Ovo je jednostavnije nego da testiramo direktno NextAuth.
 */

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from './useAuth';

/**
 * mocks: cross-module mockovi za useSession, signIn i signOut.
 * Značaj: useAuth hook koristi sve tri funkcije iz next-auth/react.
 * Zato ih sve mockujemo na jednom mestu kako bi bio lakše upravljanje.
 *
 * vi.hoisted() je potreban jer useAuth.tsx importuje ove funkcije
 * na top nivou, a mock factory takođe treba pristup istim mockovima.
 */
const mocks = vi.hoisted(() => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

/**
 * Mockujemo next-auth/react module.
 * Značaj: useAuth direktno koristi useSession, signIn i signOut.
 * Zato ih sve zamenjujemo sa mockovima da ne bismo izvodili
 * stvarnu NextAuth autentikaciju.
 */
vi.mock('next-auth/react', () => ({
  useSession: mocks.useSession,
  signIn: mocks.signIn,
  signOut: mocks.signOut,
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * TEST 1: Loading state dok se sesija učitava
   * ZAŠTO: useAuth treba da vrati loading: true kada je NextAuth
   * status 'loading' (proverava da li je korisnik ulogovan).
   * KAKO:
   * 1. Mockujemo useSession da vrati status: 'loading'
   * 2. Pozivamo useAuth hook
   * 3. Proveravamo da je result.current.loading === true
   * 4. Proveravamo da je isAuthenticated === false (još ne znamo)
   * 5. Proveravamo da je user === undefined (nema session podataka)
   */
  it('returns loading state while the session is loading', () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'loading',
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeUndefined();
  });

  /**
   * TEST 2: Authenticated state sa podacima korisnika
   * ZAŠTO: Kada je korisnik ulogovan, useAuth treba da vrati
   * isAuthenticated: true i user objekat sa podacima.
   * KAKO:
   * 1. Mockujemo useSession da vrati status: 'authenticated'
   *    i data.user sa imenom
   * 2. Pozivamo useAuth hook
   * 3. Proveravamo da je loading === false
   * 4. Proveravamo da je isAuthenticated === true
   * 5. Proveravamo da user odgovara prosleđenim podacima
   */
  it('returns authenticated user data', () => {
    mocks.useSession.mockReturnValue({
      data: {
        user: {
          name: 'Marko Markovic',
        },
      },
      status: 'authenticated',
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({
      name: 'Marko Markovic',
    });
  });

  /**
   * TEST 3: Uspešan login — poziv signIn sa credentials
   * ZAŠTO: Treba verifikovati da login() metoda poziva signIn sa
   * tačnim argumentima (email, password, redirect: false).
   * KAKO:
   * 1. Mockujemo useSession za unauthenticated stanje
   * 2. Mockujemo signIn da vrati ok: true (uspeh)
   * 3. Pozivamo useAuth hook
   * 4. Koristimo act() za async poziv login() metoda
   *    (act je potreban jer login() vraća Promise)
   * 5. Proveravamo da je signIn pozvan sa 'credentials' i
   *    tačnim email i password vrednostima
   */
  it('calls signIn with credential data', async () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    mocks.signIn.mockResolvedValue({
      ok: true,
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login(
        'marko@example.com',
        'sigurna-lozinka'
      );
    });

    expect(mocks.signIn).toHaveBeenCalledWith('credentials', {
      redirect: false,
      email: 'marko@example.com',
      password: 'sigurna-lozinka',
    });
  });

  /**
   * TEST 4: Neuspešan login — throw greške
   * ZAŠTO: Ako signIn vrati ok: false i error string, login() metoda
   * treba da baci (throw) tu grešku kako bi je caller mogao da uhvati.
   * KAKO:
   * 1. Mockujemo signIn da vrati ok: false i error: 'Invalid credentials'
   * 2. Pozivamo useAuth hook
   * 3. Koristimo expect().rejects.toThrow() jer login() treba da baci
   *    grešku — ovo je standardan način da se testiraju async funkcije
   *    koje throw-uju
   */
  it('throws signIn error to the caller', async () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    mocks.signIn.mockResolvedValue({
      ok: false,
      error: 'Invalid credentials',
    });

    const { result } = renderHook(() => useAuth());

    await expect(
      result.current.login('marko@example.com', 'wrong-password')
    ).rejects.toThrow('Invalid credentials');
  });

  /**
   * TEST 5: Logout — poziv signOut bez redirect-a
   * ZAŠTO: Treba verifikovati da logout() metoda poziva signOut
   * sa { redirect: false } kako bi korisnik ostao na istoj strani.
   * KAKO:
   * 1. Mockujemo useSession za unauthenticated (nije bitno za logout)
   * 2. Pozivamo useAuth hook
   * 3. Koristimo act() za logout() poziv (nije async, ali act
   *    osigurava da su svi state promene obrađene)
   * 4. Proveravamo da je signOut pozvan sa { redirect: false }
   */
  it('calls signOut without redirecting', () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(mocks.signOut).toHaveBeenCalledWith({
      redirect: false,
    });
  });
});