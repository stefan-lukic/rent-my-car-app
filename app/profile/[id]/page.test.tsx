import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  connectToDatabase: vi.fn(),
  findById: vi.fn(),
  select: vi.fn(),
  lean: vi.fn(),
  findCars: vi.fn(),
  selectCars: vi.fn(),
  leanCars: vi.fn(),
  rentalExists: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock('next-auth/next', () => ({
  getServerSession: mocks.getServerSession,
}));

vi.mock('@/lib/authOptions', () => ({ authOptions: {} }));

vi.mock('@/lib/db/mongoose', () => ({
  default: mocks.connectToDatabase,
}));

vi.mock('@/lib/model/User', () => ({
  default: { findById: mocks.findById },
}));

vi.mock('@/lib/model/Rental', () => ({
  default: { exists: mocks.rentalExists },
}));

vi.mock('@/lib/model/car/Car', () => ({
  default: { find: mocks.findCars },
}));

vi.mock('next/navigation', () => ({
  notFound: mocks.notFound,
}));

vi.mock('@/components/OwnerProfileHeader', () => ({
  default: () => <div data-testid="owner-profile-header" />,
}));

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <span>{alt}</span>,
}));

import RenterProfilePage from './page';
import {
  getProfilePageProjection,
  PUBLIC_USER_PROFILE_PROJECTION,
} from '@/lib/profileAccess';

const profileOwnerId = '507f1f77bcf86cd799439011';
const viewerId = '507f1f77bcf86cd799439012';
const ownerEmail = 'owner@example.com';
const ownerPhone = '+381601234567';
const today = new Date('2026-09-01T00:00:00.000Z');

const eligibleRentalFilter = {
  client: viewerId,
  renter: profileOwnerId,
  status: 'active',
  'rentalPeriod.endDate': { $gte: today },
};

const profileUser = {
  name: 'Owner Name',
  email: ownerEmail,
  contactInfo: ownerPhone,
  images: ['/owner.jpg'],
  rating: 4.8,
  ratingCount: 12,
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
  emailVerified: new Date('2025-01-02T00:00:00.000Z'),
};

const profileCar = {
  _id: '507f1f77bcf86cd799439013',
  make: 'MERCEDES',
  carModel: 'C-Class',
  city: 'NOVI SAD',
  engine: 'PETROL',
  power: '150',
  seats: 5,
  carType: 'SALOON',
  firstRegistration: new Date('2020-01-01T00:00:00.000Z'),
  milage: 50000,
  averageConsumption: '7.5',
  images: ['/car.jpg'],
  pricePerDay: 50,
  rating: 4.5,
  ratingCount: 2,
};

async function renderProfile() {
  render(await RenterProfilePage({ params: { id: profileOwnerId } }));
}

describe('public owner profile contact privacy', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-01T12:00:00.000Z'));
    vi.clearAllMocks();
    mocks.connectToDatabase.mockResolvedValue(undefined);
    mocks.findById.mockReturnValue({ select: mocks.select });
    mocks.select.mockReturnValue({ lean: mocks.lean });
    mocks.lean.mockResolvedValue(profileUser);
    mocks.findCars.mockReturnValue({ select: mocks.selectCars });
    mocks.selectCars.mockReturnValue({ lean: mocks.leanCars });
    mocks.leanCars.mockResolvedValue([profileCar]);
    mocks.rentalExists.mockResolvedValue(null);
    mocks.notFound.mockImplementation(() => {
      throw new Error('NEXT_NOT_FOUND');
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not fetch or display contact details for an anonymous visitor', async () => {
    mocks.getServerSession.mockResolvedValue(null);

    await renderProfile();

    expect(mocks.select).toHaveBeenCalledWith(getProfilePageProjection(false));
    expect(mocks.rentalExists).not.toHaveBeenCalled();
    expect(screen.queryByText(ownerEmail)).not.toBeInTheDocument();
    expect(screen.queryByText(ownerPhone)).not.toBeInTheDocument();
  });

  it('does not fetch or display contact details for a stranger', async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: viewerId } });

    await renderProfile();

    expect(mocks.rentalExists).toHaveBeenCalledWith(eligibleRentalFilter);
    expect(mocks.select).toHaveBeenCalledWith(getProfilePageProjection(false));
    expect(screen.queryByText(ownerEmail)).not.toBeInTheDocument();
    expect(screen.queryByText(ownerPhone)).not.toBeInTheDocument();
  });

  it('displays contact details to the profile owner', async () => {
    mocks.getServerSession.mockResolvedValue({
      user: { id: profileOwnerId },
    });

    await renderProfile();

    expect(mocks.rentalExists).not.toHaveBeenCalled();
    expect(mocks.select).toHaveBeenCalledWith(getProfilePageProjection(true));
    expect(screen.getByText(ownerEmail)).toBeInTheDocument();
    expect(screen.getByText(ownerPhone)).toBeInTheDocument();
  });

  it('displays contact details to a client with an active current rental', async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: viewerId } });
    mocks.rentalExists.mockResolvedValue({ _id: 'rental-id' });

    await renderProfile();

    expect(mocks.rentalExists).toHaveBeenCalledWith(eligibleRentalFilter);
    expect(mocks.select).toHaveBeenCalledWith(getProfilePageProjection(true));
    expect(screen.getByText(ownerEmail)).toBeInTheDocument();
    expect(screen.getByText(ownerPhone)).toBeInTheDocument();
  });

  it('keeps the shared API public projection minimal', () => {
    expect(PUBLIC_USER_PROFILE_PROJECTION).toBe(
      'name images rating ratingCount'
    );
    expect(PUBLIC_USER_PROFILE_PROJECTION).not.toContain('email');
    expect(PUBLIC_USER_PROFILE_PROJECTION).not.toContain('contactInfo');
  });

  it('returns not found for a malformed profile id before querying data', async () => {
    await expect(
      RenterProfilePage({ params: { id: 'not-a-valid-id' } })
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.getServerSession).not.toHaveBeenCalled();
    expect(mocks.connectToDatabase).not.toHaveBeenCalled();
    expect(mocks.findById).not.toHaveBeenCalled();
  });

  it("displays the owner's cars with links to their details", async () => {
    mocks.getServerSession.mockResolvedValue(null);

    await renderProfile();

    expect(mocks.findCars).toHaveBeenCalledWith({ renter: profileOwnerId });
    expect(mocks.selectCars).toHaveBeenCalledWith(
      'make carModel city engine power seats carType firstRegistration milage averageConsumption images pricePerDay rating ratingCount'
    );
    expect(
      screen.getByRole('heading', { name: 'MERCEDES C-Class', level: 3 })
    ).toBeInTheDocument();
    expect(screen.getByText('Saloon')).toBeInTheDocument();
    expect(screen.getByText('Petrol')).toBeInTheDocument();
    expect(screen.getByText('150 HP')).toBeInTheDocument();
    expect(screen.getByText('7.5 l/100km')).toBeInTheDocument();
    expect(screen.getByText('5 seats')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();
    expect(screen.getByText('50,000 km')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute(
      'href',
      `/cars/${profileCar._id}`
    );
  });
});
