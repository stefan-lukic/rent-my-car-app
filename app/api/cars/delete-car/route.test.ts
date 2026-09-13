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
  isValidObjectId: vi.fn(),
  startSession: vi.fn(),
  withTransaction: vi.fn(),
  endSession: vi.fn(),
}));

vi.mock('next-auth/next', () => ({
  getServerSession: mocks.getServerSession,
}));

vi.mock('@/lib/authOptions', () => ({ authOptions: {} }));

vi.mock('@/lib/db/mongoose', () => ({
  default: mocks.connectToDatabase,
}));

vi.mock('mongoose', () => ({
  default: {
    Types: { ObjectId: { isValid: mocks.isValidObjectId } },
    startSession: mocks.startSession,
  },
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

const dbSession = {
  withTransaction: mocks.withTransaction,
  endSession: mocks.endSession,
};

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
    mocks.isValidObjectId.mockReturnValue(true);
    mocks.connectToDatabase.mockResolvedValue(undefined);
    mocks.findById.mockResolvedValue(car);
    mocks.rentalExists.mockResolvedValue(null);
    mocks.updateRentals.mockResolvedValue({ acknowledged: true });
    mocks.findOneAndDelete.mockResolvedValue(car);
    mocks.updateUser.mockResolvedValue({ acknowledged: true });
    mocks.withTransaction.mockImplementation(async (callback) => callback());
    mocks.startSession.mockResolvedValue(dbSession);
    mocks.endSession.mockResolvedValue(undefined);
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
      },
      { session: dbSession }
    );
    expect(mocks.findOneAndDelete).toHaveBeenCalledWith(
      expect.objectContaining({ _id: carId }),
      { session: dbSession }
    );
    expect(mocks.updateUser).toHaveBeenCalledWith(
      car.renter,
      { $pull: { cars: carId } },
      { session: dbSession }
    );
    expect(mocks.updateRentals.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.findOneAndDelete.mock.invocationCallOrder[0]
    );
    expect(mocks.withTransaction).toHaveBeenCalledOnce();
    expect(mocks.endSession).toHaveBeenCalledOnce();
  });

  it('does not delete the car when rental history cannot be preserved', async () => {
    const internalError = new Error('Snapshot failed with database details');
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    mocks.updateRentals.mockRejectedValue(internalError);

    const response = await DELETE(createRequest());
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      message: 'Error deleting car',
      errorId: expect.any(String),
    });
    expect(JSON.stringify(body)).not.toContain(internalError.message);
    expect(consoleError).toHaveBeenCalledWith(
      `[${body.errorId}] Error deleting car:`,
      internalError
    );
    expect(mocks.findOneAndDelete).not.toHaveBeenCalled();
    expect(mocks.updateUser).not.toHaveBeenCalled();
    expect(mocks.endSession).toHaveBeenCalledOnce();

    consoleError.mockRestore();
  });

  it('rolls back the snapshot when a protected booking wins the delete race', async () => {
    mocks.findOneAndDelete.mockResolvedValue(null);

    const response = await DELETE(createRequest());

    expect(response.status).toBe(409);
    expect(mocks.updateRentals).toHaveBeenCalledOnce();
    expect(mocks.updateUser).not.toHaveBeenCalled();
    expect(mocks.withTransaction).toHaveBeenCalledOnce();
    expect(mocks.endSession).toHaveBeenCalledOnce();
  });
});
