import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  connectToDatabase: vi.fn(),
  findById: vi.fn(),
  findByIdAndUpdate: vi.fn(),
}));

vi.mock('next-auth/next', () => ({
  getServerSession: mocks.getServerSession,
}));

vi.mock('@/lib/db/mongoose', () => ({
  default: mocks.connectToDatabase,
}));

vi.mock('@/lib/model/car/Car', () => ({
  default: {
    findById: mocks.findById,
    findByIdAndUpdate: mocks.findByIdAndUpdate,
  },
}));

import { PUT } from './route';

const createRequest = (body: unknown) =>
  ({ json: vi.fn().mockResolvedValue(body) }) as never;

describe('PUT /api/cars/update-car', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects unauthenticated requests before touching the database', async () => {
    mocks.getServerSession.mockResolvedValue(null);

    const response = await PUT(createRequest({ _id: 'car-1' }));

    expect(response.status).toBe(401);
    expect(mocks.connectToDatabase).not.toHaveBeenCalled();
    expect(mocks.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('does not let another user update the car', async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: 'user-b' } });
    mocks.findById.mockResolvedValue({
      _id: 'car-1',
      renter: { toString: () => 'user-a' },
    });

    const response = await PUT(
      createRequest({ _id: 'car-1', carModel: 'Changed' })
    );

    expect(response.status).toBe(403);
    expect(mocks.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('updates an owned car with Mongoose validation enabled', async () => {
    const updatedCar = { _id: 'car-1', carModel: 'E-Class' };
    mocks.getServerSession.mockResolvedValue({ user: { id: 'user-a' } });
    mocks.findById.mockResolvedValue({
      _id: 'car-1',
      renter: { toString: () => 'user-a' },
    });
    mocks.findByIdAndUpdate.mockResolvedValue(updatedCar);

    const response = await PUT(
      createRequest({ _id: 'car-1', carModel: 'E-Class' })
    );

    expect(response.status).toBe(200);
    expect(mocks.findByIdAndUpdate).toHaveBeenCalledWith(
      'car-1',
      { carModel: 'E-Class' },
      { new: true, runValidators: true }
    );
  });
});
