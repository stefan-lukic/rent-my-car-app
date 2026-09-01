import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  connectToDatabase: vi.fn(),
  findById: vi.fn(),
  findOneAndDelete: vi.fn(),
  rentalExists: vi.fn(),
  updateRentals: vi.fn(),
  updateUser: vi.fn(),
}));

vi.mock('next-auth/next', () => ({
  getServerSession: mocks.getServerSession,
}));

vi.mock('@/lib/authOptions', () => ({ authOptions: {} }));

vi.mock('@/lib/db/mongoose', () => ({
  default: mocks.connectToDatabase,
}));

vi.mock('@/lib/model/car/Car', () => ({
  default: {
    findById: mocks.findById,
    findOneAndDelete: mocks.findOneAndDelete,
  },
}));

vi.mock('@/lib/model/Rental', () => ({
  default: {
    exists: mocks.rentalExists,
    updateMany: mocks.updateRentals,
  },
}));

vi.mock('@/lib/model/User', () => ({
  default: { findByIdAndUpdate: mocks.updateUser },
}));

import { DELETE } from './route';

const userId = '507f1f77bcf86cd799439011';
const carId = '507f191e810c19729de860ea';
const car = {
  _id: carId,
  renter: { toString: () => userId },
  make: 'BMW',
  carModel: 'X5',
  images: ['car.jpg'],
  city: 'Belgrade',
  carLocation: 'New Belgrade',
  pricePerDay: 90,
};

const createRequest = () =>
  new NextRequest('http://localhost/api/cars/delete-car', {
    method: 'DELETE',
    body: JSON.stringify({ _id: carId }),
  });

describe('DELETE /api/cars/delete-car', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getServerSession.mockResolvedValue({ user: { id: userId } });
    mocks.connectToDatabase.mockResolvedValue(undefined);
    mocks.findById.mockResolvedValue(car);
    mocks.rentalExists.mockResolvedValue(null);
    mocks.updateRentals.mockResolvedValue({ acknowledged: true });
    mocks.findOneAndDelete.mockResolvedValue(car);
    mocks.updateUser.mockResolvedValue({ acknowledged: true });
  });

  it('snapshots rental car details before deleting the listing', async () => {
    const response = await DELETE(createRequest());

    expect(response.status).toBe(200);
    expect(mocks.updateRentals).toHaveBeenCalledWith(
      expect.objectContaining({ car: carId }),
      {
        $set: {
          carSnapshot: {
            carId,
            make: 'BMW',
            carModel: 'X5',
            images: ['car.jpg'],
            city: 'Belgrade',
            carLocation: 'New Belgrade',
            pricePerDay: 90,
          },
        },
      }
    );
    expect(mocks.updateRentals.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.findOneAndDelete.mock.invocationCallOrder[0]
    );
  });

  it('does not delete the car when rental history cannot be preserved', async () => {
    mocks.updateRentals.mockRejectedValue(new Error('Snapshot failed'));

    const response = await DELETE(createRequest());

    expect(response.status).toBe(500);
    expect(mocks.findOneAndDelete).not.toHaveBeenCalled();
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });
});
