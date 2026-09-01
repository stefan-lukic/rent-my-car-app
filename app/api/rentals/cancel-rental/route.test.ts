import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  connectToDatabase: vi.fn(),
  isValidObjectId: vi.fn(),
  startSession: vi.fn(),
  withTransaction: vi.fn(),
  endSession: vi.fn(),
  findById: vi.fn(),
  findOneAndUpdate: vi.fn(),
  updateOne: vi.fn(),
  findCarById: vi.fn(),
  findUserById: vi.fn(),
}));

vi.mock('next-auth/next', () => ({
  getServerSession: mocks.getServerSession,
}));

vi.mock('@/lib/db/mongoose', () => ({
  default: mocks.connectToDatabase,
}));

vi.mock('mongoose', () => {
  class ObjectId {
    static isValid = mocks.isValidObjectId;

    constructor(private readonly value: string) {}

    toString() {
      return this.value;
    }
  }

  return {
    default: {
      Types: { ObjectId },
      startSession: mocks.startSession,
    },
  };
});

vi.mock('@/lib/model/Rental', () => ({
  default: {
    findById: mocks.findById,
    findOneAndUpdate: mocks.findOneAndUpdate,
  },
}));

vi.mock('@/lib/model/car/Car', () => ({
  default: {
    updateOne: mocks.updateOne,
    findById: mocks.findCarById,
  },
}));

vi.mock('@/lib/model/User', () => ({
  default: { findById: mocks.findUserById },
}));

vi.mock('@/lib/emailService/sendEmail', () => ({
  sendCancellationNotificationToCustomer: vi.fn(),
  sendCancellationNotificationToOwner: vi.fn(),
}));

import { DELETE } from './route';

const rentalId = '507f1f77bcf86cd799439011';
const clientId = '507f1f77bcf86cd799439012';
const carId = '507f1f77bcf86cd799439013';
const ownerId = '507f1f77bcf86cd799439014';

const createRequest = () =>
  ({ json: vi.fn().mockResolvedValue({ rentalId }) }) as never;

const createUpcomingRental = (overrides: Record<string, unknown> = {}) => ({
  _id: rentalId,
  car: carId,
  renter: ownerId,
  client: { toString: () => clientId },
  status: 'active',
  rentalPeriod: {
    startDate: new Date(Date.now() + 86_400_000),
    endDate: new Date(Date.now() + 172_800_000),
  },
  ...overrides,
});

describe('DELETE /api/rentals/cancel-rental', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getServerSession.mockResolvedValue({ user: { id: clientId } });
    mocks.isValidObjectId.mockReturnValue(true);
    mocks.findById.mockResolvedValue(createUpcomingRental());
    mocks.findOneAndUpdate.mockResolvedValue(
      createUpcomingRental({ status: 'cancelled' })
    );
    mocks.updateOne.mockResolvedValue({ modifiedCount: 1 });
    mocks.withTransaction.mockImplementation(async (callback) => callback());
    mocks.startSession.mockImplementation(async () => ({
      withTransaction: mocks.withTransaction,
      endSession: mocks.endSession,
    }));
    mocks.endSession.mockResolvedValue(undefined);
    mocks.findUserById.mockImplementation(() => ({
      select: () => ({ lean: () => ({ exec: async () => null }) }),
    }));
    mocks.findCarById.mockImplementation(() => ({
      lean: () => ({ exec: async () => null }),
    }));
  });

  it('rejects cancellation after the reservation has started', async () => {
    mocks.findById.mockResolvedValue(
      createUpcomingRental({
        rentalPeriod: {
          startDate: new Date(Date.now() - 60_000),
          endDate: new Date(Date.now() + 60_000),
        },
      })
    );

    const response = await DELETE(createRequest());

    expect(response.status).toBe(409);
    expect(mocks.startSession).not.toHaveBeenCalled();
    expect(mocks.findOneAndUpdate).not.toHaveBeenCalled();
    expect(mocks.updateOne).not.toHaveBeenCalled();
  });

  it('cancels the rental and releases its booked period in one transaction', async () => {
    const response = await DELETE(createRequest());

    expect(response.status).toBe(200);
    expect(mocks.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: rentalId, status: 'active' },
      expect.objectContaining({
        $set: expect.objectContaining({ status: 'cancelled' }),
      }),
      expect.objectContaining({ new: true, session: expect.anything() })
    );
    expect(mocks.updateOne).toHaveBeenCalledWith(
      { _id: carId, 'bookedPeriods.rental': rentalId },
      { $pull: { bookedPeriods: { rental: rentalId } } },
      { session: expect.anything() }
    );
    expect(mocks.withTransaction).toHaveBeenCalledOnce();
    expect(mocks.endSession).toHaveBeenCalledOnce();
  });

  it('allows only one of two parallel cancellation requests to mutate the car', async () => {
    mocks.findOneAndUpdate
      .mockResolvedValueOnce(createUpcomingRental({ status: 'cancelled' }))
      .mockResolvedValueOnce(null);

    const [firstResponse, secondResponse] = await Promise.all([
      DELETE(createRequest()),
      DELETE(createRequest()),
    ]);

    expect([firstResponse.status, secondResponse.status].sort()).toEqual([
      200, 409,
    ]);
    expect(mocks.findOneAndUpdate).toHaveBeenCalledTimes(2);
    expect(mocks.updateOne).toHaveBeenCalledOnce();
    expect(mocks.endSession).toHaveBeenCalledTimes(2);
  });

  it('aborts without a manual rental rollback when car availability cannot be updated', async () => {
    mocks.updateOne.mockResolvedValue({ modifiedCount: 0 });

    const response = await DELETE(createRequest());

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      message: 'Failed to update car availability',
    });
    expect(mocks.findOneAndUpdate).toHaveBeenCalledOnce();
    expect(mocks.endSession).toHaveBeenCalledOnce();
  });

  it('returns conflict without starting a transaction when already cancelled', async () => {
    mocks.findById.mockResolvedValue(
      createUpcomingRental({ status: 'cancelled' })
    );

    const response = await DELETE(createRequest());

    expect(response.status).toBe(409);
    expect(mocks.startSession).not.toHaveBeenCalled();
    expect(mocks.findOneAndUpdate).not.toHaveBeenCalled();
    expect(mocks.updateOne).not.toHaveBeenCalled();
  });
});
