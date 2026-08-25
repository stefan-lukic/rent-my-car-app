import React from 'react';
import { render, screen, within } from '@testing-library/react';
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

  it('renders Header component', () => {
    render(<ProfilePage {...defaultProps} />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders user name in hero section', () => {
    render(<ProfilePage {...defaultProps} />);

    expect(screen.getByText('Marko Markovic')).toBeInTheDocument();
  });

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

  it('renders member since information', () => {
    render(<ProfilePage {...defaultProps} />);

    expect(screen.getByText(/Member since/)).toBeInTheDocument();
  });

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

  it('links to the Edit Profile page', () => {
    render(<ProfilePage {...defaultProps} />);

    expect(
      screen.getByRole('link', { name: l.profile.editProfileBtn })
    ).toHaveAttribute('href', '/profile/edit');
  });

  it('passes cars and rentals data to ProfileInteractiveSection', () => {
    render(<ProfilePage {...defaultProps} />);

    const interactiveSection = screen.getByTestId('profile-interactive');

    expect(interactiveSection).toHaveTextContent('Cars: 1');
    expect(interactiveSection).toHaveTextContent('Rentals: 1');
  });

  it('renders zero stats when user has no cars and rentals', () => {
    render(<ProfilePage user={mockUser} cars={[]} rentals={[]} />);

    const zeroValues = screen.getAllByText('0');

    expect(zeroValues.length).toBeGreaterThanOrEqual(2);
  });

  it('counts only rentals that can be displayed', () => {
    const rentalWithoutCar = { ...mockRentals[0], _id: 'rental-2', car: null };

    render(
      <ProfilePage
        user={mockUser}
        cars={mockCars}
        rentals={[...mockRentals, rentalWithoutCar]}
      />
    );

    const statistics = screen.getByRole('region', {
      name: 'Profile statistics',
    });

    expect(within(statistics).getAllByText('1')).toHaveLength(2);
  });
});
