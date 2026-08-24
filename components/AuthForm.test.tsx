import React from 'react';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AuthForm from './AuthForm';
import l from '@/helper/en';

/**
 * mocks.useSession: cross-module mock za useSession hook.
 * Značaj: AuthForm koristi useSession da bi odlučila šta da renderuje.
 * - loading: prikaži spinner
 * - authenticated: prikaži ništa (null)
 * - unauthenticated: prikaži ProfileForm ili MobileProfileForm
 *
 * vi.hoisted() je potreban jer AuthForm.tsx importuje useSession
 * na top nivou, a mock factory takođe treba pristup istom mocku.
 */
const mocks = vi.hoisted(() => ({
  useSession: vi.fn(),
}));

/**
 * Mockujemo next-auth/react useSession hook.
 * Značaj: Ovo je jedini modul koji AuthForm direktno koristi za
 * autentikaciju. Ostali (router, searchParams, deviceDetection) se
 * koriste za UI odluke.
 */
vi.mock('next-auth/react', () => ({
  useSession: mocks.useSession,
}));

/**
 * Mockujemo next/navigation hooks.
 * Značaj: AuthForm koristi useRouter za redirect i useSearchParams
 * za dobijanje callbackUrl. Mockujemo da ne bismo izvodili stvarni
 * Next.js routing.
 */
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => ({ get: () => '/' }),
}));

/**
 * Mockujemo deviceDetectionCSR utility.
 * Značaj: AuthForm koristi isMobileCSR() da odluči da li da prikaže
 * ProfileForm ili MobileProfileForm. U testovima fiksiramo na false
 * da testiramo Desktop verziju (ProfileForm).
 */
vi.mock('@/utils/deviceDetectionCSR', () => ({
  isMobileCSR: () => false,
}));

/**
 * Mockujemo next/link komponentu.
 * Značaj: Next.js Link komponenta zahteva Next.js kontekst koji nije
 * prisutan u jsdom. Zato vraćamo običan <a> tag sa href atributom.
 * Ovo omogućava da testovi proveravaju href linkova.
 */
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * TEST 1: Loading spinner dok se sesija učitava
   * ZAŠTO: Kada je status="loading", AuthForm treba da prikaže
   * spinner dok Next.js proveri da li je korisnik ulogovan.
   * KAKO: Mockujemo useSession da vrati status: 'loading', zatim
   * proveravamo da postoji element sa klasom .animate-spin.
   */
  it('renders loading spinner while session is loading', () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<AuthForm type="sign-in" />);

    expect(document.querySelector('.animate-spin')).toBeTruthy();
  });

  /**
   * TEST 2: Ništa se ne renderuje za authenticated korisnika
   * ZAŠTO: Ako je korisnik već ulogovan, AuthForm treba da vrati
   * null (redirect se odvija u useEffect-u).
   * KAKO: Mockujemo useSession da vrati status: 'authenticated',
   * zatim proveravamo da container.innerHTML prazno string.
   */
  it('renders nothing when user is already authenticated', () => {
    mocks.useSession.mockReturnValue({
      data: { user: { name: 'Marko' } },
      status: 'authenticated',
    });

    const { container } = render(<AuthForm type="sign-in" />);
    expect(container.innerHTML).toBe('');
  });

  /**
   * TEST 3: Sign-in forma za unauthenticated korisnika
   * ZAŠTO: Treba verifikovati da se prikaže tačan heading i subtitle
   * za sign-in scenariju.
   * KAKO: Mockujemo useSession za unauthenticated, renderujemo
   * AuthForm sa type="sign-in", proveravamo heading i subtitle iz l.
   */
  it('renders sign-in form for unauthenticated user', () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AuthForm type="sign-in" />);

    expect(screen.getByText(l.auth.logInToRentMyCar)).toBeInTheDocument();
    expect(screen.getByText(l.auth.enterDetails)).toBeInTheDocument();
  });

  /**
   * TEST 4: Sign-up forma za unauthenticated korisnika
   * ZAŠTO: Treba verifikovati da se prikaže tačan heading i subtitle
   * za sign-up scenariju.
   */
  it('renders sign-up form for unauthenticated user', () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AuthForm type="sign-up" />);

    expect(screen.getByText(l.auth.createAnAccount)).toBeInTheDocument();
    expect(screen.getByText(l.auth.startJourney)).toBeInTheDocument();
  });

  /**
   * TEST 5: Footer "Don't have an account?" za sign-in
   * ZAŠTO: Sign-in forma treba da ima link ka sign-up strani.
   * KAKO: Proveravamo da postoji tekst "Don't have an account?" i
   * da link ima href="/sign-up".
   */
  it('shows sign-in footer on sign-in form', () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AuthForm type="sign-in" />);

    expect(screen.getByText(l.auth.dontHaveAccount)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: l.common.signUp })).toHaveAttribute(
      'href',
      '/sign-up'
    );
  });

  /**
   * TEST 6: Footer "Already have an account?" za sign-up
   * ZAŠTO: Sign-up forma treba da ima link ka sign-in strani.
   */
  it('shows sign-up footer on sign-up form', () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AuthForm type="sign-up" />);

    expect(screen.getByText(l.auth.alreadyHaveAccount)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: l.common.logIn })).toHaveAttribute(
      'href',
      '/sign-in'
    );
  });

  /**
   * TEST 7: ProfileForm renderuje email i password za sign-in
   * ZAŠTO: Treba verifikovati da AuthForm ispravno prosleđuje
   * type i callbackUrl ProfileForm komponenti.
   * KAKO: Proveravamo da postoje email i password placeholderi
   * unutar ProfileForm (koji je renderovan kao deo AuthForm).
   */
  it('renders ProfileForm with email and password fields', () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AuthForm type="sign-in" />);

    expect(screen.getByPlaceholderText(l.common.email)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(l.common.password)).toBeInTheDocument();
  });

  /**
   * TEST 8: Google sign-up button renderuje za sign-up
   * ZAŠTO: ProfileForm treba da prikaže Google sign-up button
   * samo za sign-up mod.
   * Značaj: Koristimo getByText().closest('button') jer je
   * "Sign up with Google" tekst unutar <button> elementa, ali
   * postoji i <img> unutar istog button-a. Zbog toga
   * getByRole('button', { name: ... }) može da nađe više
   * elemenata. getByText().closest('button') je pouzdaniji.
   */
  it('renders Google sign-up button on sign-up form', () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AuthForm type="sign-up" />);

    expect(
      screen.getByText(l.common.signUpWithGoogle).closest('button')
    ).toBeInTheDocument();
  });
});
