/**
 * SignUpButton.test.tsx
 *
 * SignUpButton komponenta prikazuje CTA dugme "Sign Up Now"
 * samo ako korisnik NIJE ulogovan. Ako je session dostupna,
 *   vraća null.
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test — proveravamo conditional render
 *   baziran na useSession hook-u.
 * - next-auth/react je mockovan da ne bismo izvodili stvarnu
 *   autentikaciju.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - SignUpButton je "conditional leaf" komponenta — ima samo
 *   jednu poslovnu logiku (prikazati ili sakriti dugme).
 * - Zato testiramo: prikaz dugmeta za gosta, null za ulogovanog
 *   korisnika, i ispravan href za Sign Up link.
 */

import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignUpButton from './SignUpButton';
import l from '@/helper/en';

const mocks = vi.hoisted(() => ({
  mockUseSession: vi.fn(),
}));

vi.mock('next-auth/react', () => ({
  useSession: mocks.mockUseSession,
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('SignUpButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * TEST 1: Renderuje Sign Up dugme kada korisnik nije ulogovan
   * ZAŠTO: Glavni slučaj upotrebe — gost treba da vidi CTA.
   * KAKO: Mockujemo useSession da vrati null data i
   *   status='unauthenticated', proveravamo prisustvo dugmeta.
   */
  it('renders sign up button for unauthenticated users', () => {
    mocks.mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<SignUpButton />);

    expect(screen.getByText(l.common.signUpNow)).toBeInTheDocument();
  });

  /**
   * TEST 2: Dugme ima ispravan href za /sign-up
   * ZAŠTO: Klik na dugme treba da odvede na registracionu stranu.
   * KAKO: getByRole('link', { name: l.common.signUpNow }) pronazi
   *   <a> element (jer je next/link mockovan kao <a>).
   */
  it('links to the sign up page', () => {
    mocks.mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<SignUpButton />);

    const link = screen.getByRole('link', { name: l.common.signUpNow });

    expect(link).toHaveAttribute('href', '/sign-up');
  });

  /**
   * TEST 3: Vraća null kada je korisnik ulogovan
   * ZAŠTO: Ne želimo da prikažemo Sign Up dugme korisnicima
   *   koji su već napravili nalog.
   * KAKO: Mockujemo useSession za authenticated state,
   *   proveravamo da dokument nema dugme.
   */
  it('returns null when user is authenticated', () => {
    mocks.mockUseSession.mockReturnValue({
      data: { user: { name: 'Marko', email: 'marko@example.com' } },
      status: 'authenticated',
    });

    const { container } = render(<SignUpButton />);

    expect(container.innerHTML).toBe('');
  });

  /**
   * TEST 4: Renderuje Sign Up dugme dok se sesija učitava
   * ZAŠTO: Dok se sesija učitava, SignUpButton još ne zna da li
   *   je korisnik ulogovan — u ovom stanju `session` je null,
   *   pa komponenta prikazuje dugme (ovo je trenutno ponašanje).
   * KAKO: Mockujemo status='loading' sa data=null, proveravamo
   *   da dugme postoji (session je null => nije authentificiran).
   */
  it('renders sign up button while session is loading', () => {
    mocks.mockUseSession.mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<SignUpButton />);

    expect(screen.getByText(l.common.signUpNow)).toBeInTheDocument();
  });
});
