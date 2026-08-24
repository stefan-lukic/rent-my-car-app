/**
 * Header.test.tsx
 *
 * Header komponenta prikazuje navigaciju za celu aplikaciju:
 *   - Logo i brend na svim uredajima
 *   - Navigacioni linkovi (Katalog, How It Works, Moj Profil) na desktopu
 *   - Login/Logout dugme i avatar korisnika kada je ulogovan
 *   - Sign In / Sign Up linkovi kada nije ulogovan
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test — testiraju se UI elementi i state promene
 *   (loading, authenticated, unauthenticated).
 * - usePathname je mockovan iz next/navigation da odredi da li se
 *   Header renderuje (null na sign-in/sign-up).
 * - useAuth je mockovan da kontrolišemo autentikacioni state.
 * - LogoutButton je mockovan jer je "leaf" sa spoljnom zavisnošcu.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - Header je "layout" komponenta — odgovorna za navigaciju.
 * - Zato testiramo: uslovni render (null na auth stranama),
 *   prikaz logoa, prikaz linkova, i razlicite auth stanja.
 */

import React from 'react';
import {  render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Header from './Header';
import l from '@/helper/en';

/**
 * Koristimo vi.hoisted() za cross-module mockove jer vi.mock()
 * je hoisted na vrh fajla. Ovo omogucava da factory funkcije
 * pristupe mockovima definisanim ispod.
 */
const mocks = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockUseAuth: vi.fn(),
  mockSignIn: vi.fn(),
  mockSignOut: vi.fn(),
  mockUseSession: vi.fn(),
  mockUsePathname: vi.fn(),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props || {};
    return React.createElement('img', { src, alt, width, height, ...rest });
  },
}));

vi.mock('next/navigation', () => ({
  usePathname: mocks.mockUsePathname,
  useRouter: () => ({ push: mocks.mockPush }),
}));

vi.mock('next-auth/react', () => ({
  useSession: mocks.mockUseSession,
  signIn: mocks.mockSignIn,
  signOut: mocks.mockSignOut,
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: mocks.mockUseAuth,
}));

vi.mock('../LogoutButton', () => ({
  __esModule: true,
  default: () => <button data-testid="logout-btn">Log out</button>,
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
    });
    mocks.mockUsePathname.mockReturnValue('/');
    mocks.mockPush.mockClear();
  });

  /**
   * TEST 1: Header je null na sign-in strani
   * ZAŠTO: Landing i auth stranice nemaju glavnu navigaciju —
   *   Header se ne prikazuje da ne bi duplirao navigaciju.
   * KAKO:
   * 1. Mockujemo usePathname da vrati '/sign-in'
   * 2. Renderujemo Header
   * 3. Proveravamo da je dokument prazan (null je vracen)
   */
  it('returns null on sign-in page', async () => {
    const user = userEvent.setup();
    mocks.mockUsePathname.mockReturnValue('/sign-in');

    const { container } = render(<Header />);

    expect(container.innerHTML).toBe('');
  });

  /**
   * TEST 2: Header je null na sign-up strani
   * ZAŠTO: Isto kao sign-in — ne želimo glavnu navigaciju na
   *   registracionoj strani.
   * KAKO: Isto kao prethodni test, ali za '/sign-up'.
   */
  it('returns null on sign-up page', async () => {
    const user = userEvent.setup();
    mocks.mockUsePathname.mockReturnValue('/sign-up');

    const { container } = render(<Header />);

    expect(container.innerHTML).toBe('');
  });

  /**
   * TEST 3: Renderuje logo na pocetnoj (katalog) strani
   * ZAŠTO: Logo je centralni deo brenda i treba biti vidljiv
   *   na svim stranama osim auth strana.
   * KAKO:
   * 1. Mockujemo usePathname da vrati '/'
   * 2. Mockujemo useAuth za loading=false, isAuthenticated=false
   * 3. Proveravamo da postoji text 'RentMyCar' i Compass ikona.
   */
  it('renders brand logo on catalog page for unauthenticated user', async () => {
    const user = userEvent.setup();
    mocks.mockUsePathname.mockReturnValue('/');
    mocks.mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
    });

    render(<Header />);

    expect(screen.getAllByText(/RentMy/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Car/).length).toBeGreaterThanOrEqual(1);
  });

  /**
   * TEST 4: Desktop navigacija je vidljiva na vecim ekranima
   * ZAŠTO: Header ima desktop (md:flex) i mobile (md:hidden) verzije.
   *   Oba dela treba da budu dostupna u DOM-u.
   * KAKO: Proveravamo prisustvo desktop nav linkova (Katalog,
   *   How It Works, Moj Profil) cak i ako su sakriveni CSS-om.
   */
  it('renders desktop navigation links', async () => {
    const user = userEvent.setup();
    mocks.mockUsePathname.mockReturnValue('/');
    mocks.mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
    });

    render(<Header />);

    expect(screen.getByText(l.navigation.catalog)).toBeInTheDocument();
    expect(screen.getByText(l.navigation.howItWorksNav)).toBeInTheDocument();
    expect(screen.getByText(l.navigation.myProfileRentals)).toBeInTheDocument();
  });

  /**
   * TEST 5: Prikazuje Sign In i Sign Up za neulogovanog korisnika
   * ZAŠTO: Kada korisnik nije ulogovan, Header treba da prikaže
   *   linkove za prijavu i registraciju.
   * KAKO: getByText za 'Sign In' i 'Get Started' (l.common.getStarted).
   */
  it('shows Sign In and Sign Up for unauthenticated users', async () => {
    const user = userEvent.setup();
    mocks.mockUsePathname.mockReturnValue('/');
    mocks.mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
    });

    render(<Header />);

    expect(screen.getAllByText(l.navigation.signIn).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(l.common.getStarted).length).toBeGreaterThanOrEqual(1);
  });

  /**
   * TEST 6: Prikazuje Logout i avatar za ulogovanog korisnika
   * ZAŠTO: Kada je korisnik ulogovan, Sign In/Up linkovi treba da
   *   budu zamenjeni Logout dugmetom i avatarom sa inicijalima imena.
   * KAKO:
   * 1. Mockujemo useAuth za authenticated state sa user.name
   * 2. Proveravamo da postoji LogoutButton (mockovan kao test-id)
   * 3. Proveravamo da postoji avatar sa inicijalom 'M'.
   */
  it('shows Logout button and avatar for authenticated users', async () => {
    const user = userEvent.setup();
    mocks.mockUsePathname.mockReturnValue('/');
    mocks.mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { name: 'Marko Markovic', email: 'marko@example.com' },
    });

    render(<Header />);

    expect(screen.getAllByTestId('logout-btn').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('M').length).toBeGreaterThanOrEqual(1);
  });

  /**
   * TEST 7: Avatar prikazuje fallback inicijal kada nema imena
   * ZAŠTO: Ako user.name nedostaje, avatar treba da prikaže
   *   podrazumevani inicijal iz lokalizacije (l.common.profileInitial).
   * KAKO: Mockujemo user.name kao undefined, proveravamo fallback.
   */
  it('shows profile initial fallback when user name is missing', async () => {
    const user = userEvent.setup();
    mocks.mockUsePathname.mockReturnValue('/');
    mocks.mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { name: null, email: 'marko@example.com' },
    });

    render(<Header />);

    expect(screen.getAllByText(l.common.profileInitial).length).toBeGreaterThanOrEqual(1);
  });

  /**
   * TEST 8: Poziva onHowItWorksClick kada se klikne How It Works
   * ZAŠTO: Header prima callback za prikaz HowItWorksModal-a.
   *   Treba verifikovati da callback poziva na klik.
   * KAKO:
   * 1. Mockujemo usePathname za '/' i useAuth za unauthenticated
   * 2. Prosledujemo onHowItWorksClick kao prop
   * 3. fireEvent.click na "How It Works" link
   * 4. Proveravamo da je mock pozvan jednom.
   */
  it('calls onHowItWorksClick when How It Works button is clicked', async () => {
    const user = userEvent.setup();
    const onHowItWorksClick = vi.fn();

    mocks.mockUsePathname.mockReturnValue('/');
    mocks.mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
    });

    render(<Header onHowItWorksClick={onHowItWorksClick} />);

    await user.click(screen.getByText(l.navigation.howItWorksNav));

    expect(onHowItWorksClick).toHaveBeenCalledTimes(1);
  });
});


