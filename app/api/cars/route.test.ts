import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  connectToDatabase: vi.fn(),
  findCars: vi.fn(),
  selectCars: vi.fn(),
  sliceCarImages: vi.fn(),
  findRentals: vi.fn(),
}));

vi.mock('next-auth/next', () => ({
  getServerSession: mocks.getServerSession,
}));

vi.mock('@/lib/authOptions', () => ({ authOptions: {} }));

vi.mock('@/lib/db/mongoose', () => ({
  default: mocks.connectToDatabase,
}));

vi.mock('@/lib/model/car/Car', () => ({
  default: { find: mocks.findCars },
}));

vi.mock('@/lib/model/Rental', () => ({
  default: { find: mocks.findRentals },
}));

import { GET } from './route';

const createRequest = (pagination = '') =>
  new NextRequest(
    `http://localhost:3000/api/cars?start=2026-10-10&end=2026-10-12${pagination}`
  );

describe('GET /api/cars pagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getServerSession.mockResolvedValue(null);
    mocks.connectToDatabase.mockResolvedValue(undefined);
    mocks.findCars.mockReturnValue({ select: mocks.selectCars });
    mocks.selectCars.mockReturnValue({ slice: mocks.sliceCarImages });
    mocks.sliceCarImages.mockResolvedValue([]);
    mocks.findRentals.mockResolvedValue([]);
  });

  it.each(['0', '-1', '1.5', 'abc', '2abc'])(
    'rejects invalid page value %s before querying the database',
    async (page) => {
      const response = await GET(createRequest(`&page=${page}`));

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: 'Page must be a positive whole number',
      });
      expect(mocks.connectToDatabase).not.toHaveBeenCalled();
      expect(mocks.findCars).not.toHaveBeenCalled();
    }
  );

  it.each(['0', '-1', '1.5', 'abc', '51', '100000'])(
    'rejects invalid limit value %s before querying the database',
    async (limit) => {
      const response = await GET(createRequest(`&limit=${limit}`));

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: 'Limit must be a whole number between 1 and 50',
      });
      expect(mocks.connectToDatabase).not.toHaveBeenCalled();
      expect(mocks.findCars).not.toHaveBeenCalled();
    }
  );

  it('uses the existing defaults when pagination parameters are omitted', async () => {
    const response = await GET(createRequest());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(
      expect.objectContaining({
        cars: [],
        currentPage: 1,
        totalPages: 0,
        totalCars: 0,
      })
    );
    expect(mocks.connectToDatabase).toHaveBeenCalledOnce();
    expect(mocks.findCars).toHaveBeenCalledOnce();
  });

  it('accepts the maximum allowed limit', async () => {
    const response = await GET(createRequest('&page=1&limit=50'));

    expect(response.status).toBe(200);
    expect(mocks.connectToDatabase).toHaveBeenCalledOnce();
    expect(mocks.findCars).toHaveBeenCalledOnce();
  });

  it('returns only the public search DTO with one thumbnail', async () => {
    const car = {
      _id: { toString: () => 'car-1' },
      make: 'MERCEDES',
      carModel: 'C-Class',
      engine: 'PETROL',
      power: '150',
      seats: 5,
      carType: 'SALOON',
      city: 'Belgrade',
      carLocation: 'Exact private address',
      firstRegistration: new Date('2020-01-01T00:00:00.000Z'),
      milage: 50000,
      averageConsumption: '6.5',
      images: ['/car-1.jpg', '/car-2.jpg'],
      pricePerDay: 50,
      description: 'Comfortable car',
      renter: { toString: () => 'owner-1' },
      rating: 4.8,
      ratingCount: 12,
      status: 'available',
      bookedPeriods: [],
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      __v: 0,
    };
    mocks.sliceCarImages.mockResolvedValue([car]);

    const response = await GET(createRequest());

    expect(response.status).toBe(200);
    expect((await response.json()).cars).toEqual([
      {
        _id: 'car-1',
        make: 'MERCEDES',
        carModel: 'C-Class',
        engine: 'PETROL',
        power: '150',
        seats: 5,
        carType: 'SALOON',
        city: 'Belgrade',
        firstRegistration: '2020-01-01T00:00:00.000Z',
        milage: 50000,
        averageConsumption: '6.5',
        images: ['/car-1.jpg'],
        pricePerDay: 50,
        description: 'Comfortable car',
        renter: 'owner-1',
        rating: 4.8,
        ratingCount: 12,
      },
    ]);
    expect(mocks.selectCars).toHaveBeenCalledWith(
      expect.not.stringContaining('carLocation')
    );
    expect(mocks.sliceCarImages).toHaveBeenCalledWith('images', 1);
  });
});
