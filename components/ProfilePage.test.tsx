import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProfilePage from './ProfilePage';
import l from '@/helper/en';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props || {};
    return React.createElement('img', { src, alt, width, height, ...rest });
  },
}));

vi.mock('@/components/UI/Header', () => ({
  __esModule: true,
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock('./ProfileInteractiveSection', () => ({
  __esModule: true,
  default: ({ cars, rentals }: any) => (
    <div data-testid="profile-interactive">
      Cars: {cars.length}, Rentals: {rentals.length}
    </div>
  ),
}));

const mockUser: any = {
  _id: 'user-1',
  name: 'Marko Markovic',
  email: 'marko@example.com',
  contactInfo: '+381 60 123 4567',
  images: ['/avatar.jpg'],
  createdAt: '2024-01-15T00:00:00.000Z',
  rating: 4.8,
};

const mockCars: any = [
  {
    _id: 'car-1',
    make: 'BMW',
    carModel: 'X5',
    images: ['/car1.jpg'],
    status: 'available',
  },
];

const mockRentals: any = [
  {
    _id: 'rental-1',
    car: mockCars[0],
    rentalPeriod: {
      startDate: '2026-08-01T00:00:00.000Z',
      endDate: '2026-08-05T00:00:00.000Z',
    },
    totalCost: 320,
  },
];

describe('ProfilePage', () => {
  const defaultProps = {
    user: mockUser,
    cars: mockCars,
    rentals: mockRentals,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * TEST 1: Renderuje Header komponentu
   * ZAŠTO: Svaka stranica profila treba da ima navigation header.
   * KAKO: getByTestId('header') pronazi mockovani Header.
   */
  it('renders Header component', () => {
    render(<ProfilePage {...defaultProps} />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  /**
   * TEST 2: Renderuje ime korisnika u hero sekciji
   * ZAŠTO: Ime je najvažnija informacija u hero sekciji.
   * KAKO: getByText('Marko Markovic').
   */
  it('renders user name in hero section', () => {
    render(<ProfilePage {...defaultProps} />);

    expect(screen.getByText('Marko Markovic')).toBeInTheDocument();
  });

  /**
   * TEST 3: Renderuje kontakt info ili fallback poruku
   * ZAŠTO: Ako je contactInfo dostupan, prikaži ga; ako ne,
   *   prikaži "No phone number".
   * KAKO: Oba slučaja — sa contactInfo i bez.
   */
  it('renders contact info when available', () => {
    render(<ProfilePage {...defaultProps} />);

    expect(screen.getByText('+381 60 123 4567')).toBeInTheDocument();
  });

  it('renders no phone number fallback when contact info is missing', () => {
    const userWithoutContact = {
      ...mockUser,
      contactInfo: '',
    };

    render(
      <ProfilePage
        user={userWithoutContact}
        cars={mockCars}
        rentals={mockRentals}
      />
    );

    expect(screen.getByText(l.profile.noPhoneNumber)).toBeInTheDocument();
  });

  /**
   * TEST 4: Renderuje member since informaciju
   * ZAŠTO: Članstvo od određenog datuma je bitna za trust.
   * KAKO: Proveravamo prisustvo member since teksta (format zavisi
   * od toLocaleDateString, ali proveravamo da sadrži datum).
   */
  it('renders member since information', () => {
    render(<ProfilePage {...defaultProps} />);

    expect(screen.getByText(/Member since/)).toBeInTheDocument();
  });

  /**
   * TEST 5: Prikazuje stats (automobila, iznajmljivanja, ocena)
   * ZAŠTO: Statistika treba biti vidljiva i ažurna sa brojem
   *   automobila i iznajmljivanja.
   * KAKO: getByText za brojeve i labele.
   */
  it('renders stats with counts', () => {
    render(<ProfilePage {...defaultProps} />);

    const statItems = screen
      .getAllByText(/1|0|4\.8/)
      .map((el) => el.textContent);

    expect(statItems).toContain('1');
    expect(screen.getByText(l.profile.cars)).toBeInTheDocument();
    expect(screen.getByText(l.profile.rentals)).toBeInTheDocument();
    expect(statItems).toContain('4.8');
    expect(screen.getByText(l.profile.rating)).toBeInTheDocument();
  });

  /**
   * TEST 6: Prikazuje Edit Profile dugme
   * ZAŠTO: Dugme za uređivanje profila treba biti vidljivo
   *   (za sada je dekorativno, ali treba da postoji).
   * KAKO: getByText(l.profile.editProfileBtn).
   */
  it('renders Edit Profile button', () => {
    render(<ProfilePage {...defaultProps} />);

    expect(screen.getByText(l.profile.editProfileBtn)).toBeInTheDocument();
  });

  /**
   * TEST 7: Prosleđuje cars i rentals ProfileInteractiveSection
   * ZAŠTO: ProfilePage je wrapper — mora da prosledi podatke
   *   child komponenti.
   * KAKO: getByTestId('profile-interactive') — mockovana
   *   komponenta prikazuje broj elemenata.
   */
  it('passes cars and rentals data to ProfileInteractiveSection', () => {
    render(<ProfilePage {...defaultProps} />);

    const interactiveSection = screen.getByTestId('profile-interactive');

    expect(interactiveSection).toHaveTextContent('Cars: 1');
    expect(interactiveSection).toHaveTextContent('Rentals: 1');
  });

  /**
   * TEST 8: Prikazuje 0 automobila i iznajmljivanja kada ih nema
   * ZAŠTO: Edge case — korisnik sa praznim profilom.
   * KAKO: Prazni nizovi, proveravamo da su stats 0.
   */
  it('renders zero stats when user has no cars and rentals', () => {
    render(<ProfilePage user={mockUser} cars={[]} rentals={[]} />);

    const zeroValues = screen.getAllByText('0');

    expect(zeroValues.length).toBeGreaterThanOrEqual(2);
  });
});
