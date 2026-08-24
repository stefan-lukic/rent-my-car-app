import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MobileProfilePage from './MobileProfilePage';
import l from '@/helper/en';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/components/mobile/MobileUserProfileInfoCard', () => ({
  __esModule: true,
  default: () => <div data-testid="user-info-card">User Info</div>,
}));

vi.mock('./MobileProfileInteractiveSection', () => ({
  __esModule: true,
  default: ({ activeTab }: any) => (
    <div data-testid="interactive-section">Active tab: {activeTab}</div>
  ),
}));

const mockUser = {
  _id: 'user-1',
  name: 'Marko Markovic',
  email: 'marko@example.com',
  contactInfo: '+381 60 123 4567',
  images: ['/avatar.jpg'],
  createdAt: '2024-01-15T00:00:00.000Z',
  rating: 4.8,
} as any;

const mockCars = [
  {
    _id: 'car-1',
    make: 'BMW',
    carModel: 'X5',
    images: ['/car1.jpg'],
    status: 'available',
  },
] as any;

const mockRentals = [
  {
    _id: 'rental-1',
    car: {
      _id: 'car-1',
      make: 'BMW',
      carModel: 'X5',
      images: ['/car1.jpg'],
    },
    rentalPeriod: {
      startDate: '2026-08-01T00:00:00.000Z',
      endDate: '2026-08-05T00:00:00.000Z',
    },
    totalCost: 320,
  },
] as any;

describe('MobileProfilePage', () => {
  const defaultProps = {
    user: mockUser,
    cars: mockCars,
    rentals: mockRentals,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user info card', async () => {
    const user = userEvent.setup();
    render(<MobileProfilePage {...defaultProps} />);
    expect(screen.getByTestId('user-info-card')).toBeInTheDocument();
  });

  it('renders add car button', async () => {
    const user = userEvent.setup();
    render(<MobileProfilePage {...defaultProps} />);
    expect(screen.getByText(l.profile.addNewCar)).toBeInTheDocument();
  });

  it('navigates to add car page when Add New Car is clicked', async () => {
    const user = userEvent.setup();
    render(<MobileProfilePage {...defaultProps} />);

    await user.click(screen.getByText(l.profile.addNewCar));

    expect(mockPush).toHaveBeenCalledWith('/cars/add-car');
  });

  it('renders My Cars and My Rentals tabs', async () => {
    const user = userEvent.setup();
    render(<MobileProfilePage {...defaultProps} />);

    expect(screen.getByText(l.profile.myCars)).toBeInTheDocument();
    expect(screen.getByText(l.profile.myRentals)).toBeInTheDocument();
  });

  it('renders cars tab as active by default', async () => {
    const user = userEvent.setup();
    render(<MobileProfilePage {...defaultProps} />);

    expect(screen.getByText('Active tab: cars')).toBeInTheDocument();
  });

  it('switches to rentals tab when My Rentals is clicked', async () => {
    const user = userEvent.setup();
    render(<MobileProfilePage {...defaultProps} />);

    await user.click(screen.getByText(l.profile.myRentals));

    expect(screen.getByText('Active tab: rentals')).toBeInTheDocument();
  });

  it('switches to cars tab when My Cars is clicked', async () => {
    const user = userEvent.setup();
    render(<MobileProfilePage {...defaultProps} />);

    await user.click(screen.getByText(l.profile.myRentals));
    await user.click(screen.getByText(l.profile.myCars));

    expect(screen.getByText('Active tab: cars')).toBeInTheDocument();
  });

  it('renders interactive section with cars and rentals data', async () => {
    const user = userEvent.setup();
    render(<MobileProfilePage {...defaultProps} />);

    expect(screen.getByTestId('interactive-section')).toBeInTheDocument();
  });
});
