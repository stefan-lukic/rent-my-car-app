import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  connectToDatabase: vi.fn(),
  findUser: vi.fn(),
  findCars: vi.fn(),
  findRentals: vi.fn(),
  isMobileSSR: vi.fn(),
}));

vi.mock('next-auth/next', () => ({
  getServerSession: mocks.getServerSession,
}));

vi.mock('@/lib/authOptions', () => ({ authOptions: {} }));

vi.mock('@/lib/db/mongoose', () => ({
  default: mocks.connectToDatabase,
}));

vi.mock('@/lib/model/User', () => ({
  default: { findById: mocks.findUser },
}));

vi.mock('@/lib/model/car/Car', () => ({
  default: { find: mocks.findCars },
}));

vi.mock('@/lib/model/Rental', () => ({
  default: { find: mocks.findRentals },
}));

vi.mock('@/utils/deviceDetectionSSR', () => ({
  isMobileSSR: mocks.isMobileSSR,
}));

vi.mock('@/components/ProfilePage', () => ({
  default: ({ cars, rentals, ownerBookings }: any) => (
    <div>
      <p>
        Cars: {cars.length}, Rentals: {rentals.length}, Owner bookings:{' '}
        {ownerBookings.length}
      </p>
      <p>Rental car: {rentals[0]?.car?.carModel ?? 'missing'}</p>
      <p>Owner booking car: {ownerBookings[0]?.car?.carModel ?? 'missing'}</p>
    </div>
  ),
}));

vi.mock('@/components/mobile/MobileProfilePage', () => ({
  default: ({ rentals }: any) => <div>Mobile rentals: {rentals.length}</div>,
}));

import MyProfilePage from './page';

const userId = '507f1f77bcf86cd799439011';
const user = { _id: userId, name: 'Marko' };
const cars = [{ _id: 'car-1' }];
const rentals = [{ _id: 'rental-1' }, { _id: 'rental-2' }];
const ownerBookings = [{ _id: 'booking-1' }];

describe('MyProfilePage profile data loading', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getServerSession.mockResolvedValue({ user: { id: userId } });
    mocks.connectToDatabase.mockResolvedValue(undefined);
    mocks.isMobileSSR.mockReturnValue(false);

    mocks.findUser.mockReturnValue({
      select: () => ({ lean: () => Promise.resolve(user) }),
    });
    mocks.findCars.mockReturnValue({ lean: () => Promise.resolve(cars) });
    mocks.findRentals.mockImplementation((filter) => {
      if ('client' in filter) {
        return {
          populate: () => ({ lean: () => Promise.resolve(rentals) }),
        };
      }

      return {
        sort: () => ({
          populate: () => ({
            populate: () => ({
              lean: () => Promise.resolve(ownerBookings),
            }),
          }),
        }),
      };
    });
  });

  it('loads rentals directly and passes the complete result to the profile', async () => {
    render(await MyProfilePage());

    expect(mocks.findRentals).toHaveBeenCalledWith({ client: userId });
    expect(mocks.findRentals).toHaveBeenCalledWith({ renter: userId });
    expect(
      screen.getByText('Cars: 1, Rentals: 2, Owner bookings: 1')
    ).toBeInTheDocument();
  });

  it('shows an error instead of presenting a failed rentals query as zero', async () => {
    mocks.findRentals.mockImplementation((filter) => {
      if ('client' in filter) {
        return {
          populate: () => ({
            lean: () => Promise.reject(new Error('Rental query failed')),
          }),
        };
      }

      return {
        sort: () => ({
          populate: () => ({
            populate: () => ({
              lean: () => Promise.resolve(ownerBookings),
            }),
          }),
        }),
      };
    });

    render(await MyProfilePage());

    expect(screen.queryByText(/Rentals: 0/)).not.toBeInTheDocument();
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });

  it('restores deleted cars from rental snapshots', async () => {
    const historicalRental = {
      _id: 'rental-history',
      car: null,
      carSnapshot: {
        carId: 'car-deleted',
        make: 'BMW',
        carModel: 'X5',
        images: [],
        city: 'Belgrade',
        carLocation: 'New Belgrade',
        pricePerDay: 90,
      },
    };

    mocks.findRentals.mockImplementation(() => ({
      populate: () => ({
        lean: () => Promise.resolve([historicalRental]),
      }),
      sort: () => ({
        populate: () => ({
          populate: () => ({
            lean: () => Promise.resolve([historicalRental]),
          }),
        }),
      }),
    }));

    render(await MyProfilePage());

    expect(screen.getByText('Rental car: X5')).toBeInTheDocument();
    expect(screen.getByText('Owner booking car: X5')).toBeInTheDocument();
  });
});
