/**
 * LogoutButton.test.tsx
 *
 * LogoutButton komponenta je jednostavan button/div za odjavu korisnika.
 * Koristi signOut iz next-auth/react i prosleduje callbackUrl='/sign-in'.
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test — testiraju se samo UI elementi i
 *   interakcija sa signOut funkcijom.
 * - signOut je mockovan (vi.hoisted) da ne bismo izvodili stvarnu
 *   odjavu iz Next.js sesije.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - LogoutButton je "leaf" komponenta — ima samo jednu akciju
 *   (onClick poziva signOut).
 * - Zato testiramo: da li se tekst "Log out" renderuje i da li
 *   signOut callback poziva sa ispravnim argumentima.
 */

import React from 'react';
import {  render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LogoutButton from './LogoutButton';

/**
 * mocks.signOut: cross-module mock za signOut funkciju.
 * Znacaj: LogoutButton koristi signOut({ callbackUrl: '/sign-in' }) za
 * odjavu korisnika. Mockujemo da ne bismo izvodili stvarnu odjavu.
 *
 * Koristimo vi.hoisted() jer LogoutButton.tsx importuje signOut
 * na top nivou, a mock factory takode treba pristup istom mocku.
 */
const mocks = vi.hoisted(() => ({
  signOut: vi.fn(),
}));

/**
 * Mockujemo next-auth/react signOut funkciju.
 * Znacaj: Ovo je jedini spoljni modul koji LogoutButton koristi.
 * Zato ga mockujemo da proverimo da li je pozvan sa ispravnim
 * argumentima ({ callbackUrl: '/sign-in' }).
 */
vi.mock('next-auth/react', () => ({
  signOut: mocks.signOut,
}));

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * TEST 1: Renderovanje "Log out" teksta
   * ZAŠTO: Osnovna provera da komponenta renderuje logout tekst
   * iz l.common.logOut.
   * KAKO: getByText('Log out') — koristimo string direktno jer
   * LogoutButton ne importuje l objekat (koristi hardcoded string).
   */
  it('renders logout text', async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  /**
   * TEST 2: Klik na Log out poziva signOut sa callbackUrl
   * ZAŠTO: Treba verifikovati da korisnikova akcija (klik) pravilno
   * poziva signOut sa tacnim argumentima — redirect na sign-in stranu.
   * KAKO:
   * 1. fireEvent.click na "Log out" element
   * 2. Provera da mocks.signOut nije prazan
   * 3. Provera da je pozvan sa { callbackUrl: '/sign-in' }
   *
   * Znacaj: Koristimo toHaveBeenCalledWith za preciznu proveru
   * argumenta — ovo osigurava da se redirect dešava na tacan URL.
   */
  it('calls signOut with callbackUrl on click', async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);
    await user.click(screen.getByText('Log out'));
    expect(mocks.signOut).toHaveBeenCalledWith({ callbackUrl: '/sign-in' });
  });
});

