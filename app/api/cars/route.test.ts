import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  connectToDatabase: vi.fn(),
  findCars: vi.fn(),
  selectCars: vi.fn(),
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
    mocks.selectCars.mockResolvedValue([]);
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
});
