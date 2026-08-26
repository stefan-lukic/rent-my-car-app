import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  isValidObjectId: vi.fn(),
  connectToDatabase: vi.fn(),
  findById: vi.fn(),
  select: vi.fn(),
  populate: vi.fn(),
  lean: vi.fn(),
  exec: vi.fn(),
}));

vi.mock('react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react')>()),
  cache: (callback: unknown) => callback,
}));

vi.mock('mongoose', () => ({
  default: {
    Types: {
      ObjectId: { isValid: mocks.isValidObjectId },
    },
  },
}));

vi.mock('@/lib/db/mongoose', () => ({
  default: mocks.connectToDatabase,
}));

vi.mock('@/lib/model/car/Car', () => ({
  default: { findById: mocks.findById },
}));

import { getCarDetails } from './carDetails';

describe('getCarDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isValidObjectId.mockReturnValue(true);
    mocks.findById.mockReturnValue({ select: mocks.select });
    mocks.select.mockReturnValue({ populate: mocks.populate });
    mocks.populate.mockReturnValue({ lean: mocks.lean });
    mocks.lean.mockReturnValue({ exec: mocks.exec });
  });

  it('maps the location and rating data used by the details page', async () => {
    mocks.exec.mockResolvedValue({
      _id: { toString: () => 'car-1' },
      make: 'TOYOTA',
      carModel: 'Corolla',
      engine: 'PETROL',
      power: '132',
      seats: 5,
      carType: 'SALOON',
      city: 'Novi Sad',
      carLocation: 'Center',
      milage: 10000,
      averageConsumption: '6.5',
      images: ['/car.jpg'],
      pricePerDay: 35,
      description: 'Reliable city car',
      rating: 4.7,
      ratingCount: 3,
      renter: {
        _id: { toString: () => 'owner-1' },
        name: 'Stefan',
        rating: 4.9,
        images: [],
      },
      bookedPeriods: [],
    });

    const result = await getCarDetails('507f1f77bcf86cd799439011');

    expect(result).toEqual(
      expect.objectContaining({
        city: 'Novi Sad',
        carLocation: 'Center',
        rating: 4.7,
        ratingCount: 3,
      })
    );
  });

  it('does not query the database for an invalid car ID', async () => {
    mocks.isValidObjectId.mockReturnValue(false);

    const result = await getCarDetails('invalid-id');

    expect(result).toBeNull();
    expect(mocks.connectToDatabase).not.toHaveBeenCalled();
  });
});
