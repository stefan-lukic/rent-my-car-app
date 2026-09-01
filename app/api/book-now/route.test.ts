import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  connectToDatabase: vi.fn(),
  isValidObjectId: vi.fn(),
  startSession: vi.fn(),
  withTransaction: vi.fn(),
  endSession: vi.fn(),
  findById: vi.fn(),
  findOneAndUpdate: vi.fn(),
  userUpdateOne: vi.fn(),
  rentalExists: vi.fn(),
  rentalExistsSession: vi.fn(),
  create: vi.fn(),
  sendBookingConfirmationToCustomer: vi.fn(),
  sendBookingNotificationToOwner: vi.fn(),
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
    exists: mocks.rentalExists,
    create: mocks.create,
  },
}));

vi.mock('@/lib/model/car/Car', () => ({
  default: {
    findById: vi.fn(),
    findOneAndUpdate: mocks.findOneAndUpdate,
  },
}));

vi.mock('@/lib/model/User', () => ({
  default: {
    findById: vi.fn(),
    updateOne: mocks.userUpdateOne,
  },
}));

vi.mock('@/lib/emailService/sendEmail', () => ({
  sendBookingConfirmationToCustomer: mocks.sendBookingConfirmationToCustomer,
  sendBookingNotificationToOwner: mocks.sendBookingNotificationToOwner,
}));

import { POST } from './route';
import Car from '@/lib/model/car/Car';
import User from '@/lib/model/User';

const carId = '507f1f77bcf86cd799439013';
const ownerId = '507f1f77bcf86cd799439014';
const clientId = '507f1f77bcf86cd799439015';
const rentalId = '507f1f77bcf86cd799439016';

const startDate = new Date('2026-02-12T00:00:00.000Z');
const endDate = new Date('2026-02-14T00:00:00.000Z');

const createRequest = (payload: object) =>
  ({
    json: vi.fn().mockResolvedValue(payload),
  }) as unknown as NextRequest;

const createCar = (overrides: Record<string, unknown> = {}) => ({
  _id: carId,
  make: 'Toyota',
  carModel: 'Camry',
  pricePerDay: 50,
  carLocation: 'Downtown',
  renter: ownerId,
  bookedPeriods: [],
  ...overrides,
});

const createRental = (overrides: Record<string, unknown> = {}) => ({
  _id: rentalId,
  car: carId,
  renter: ownerId,
  client: clientId,
  carLocation: 'Downtown',
  rentalPeriod: { startDate, endDate },
  totalCost: 150,
  status: 'active',
  ...overrides,
});

describe('POST /api/book-now', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getServerSession.mockResolvedValue({
      user: { id: clientId, email: 'client@test.com', name: 'Client' },
    });
    mocks.isValidObjectId.mockReturnValue(true);
    mocks.connectToDatabase.mockResolvedValue(undefined);
    mocks.withTransaction.mockImplementation(async (callback) => callback());
    mocks.startSession.mockResolvedValue({
      withTransaction: mocks.withTransaction,
      endSession: mocks.endSession,
    });
    mocks.endSession.mockResolvedValue(undefined);
    mocks.sendBookingConfirmationToCustomer.mockResolvedValue(undefined);
    mocks.sendBookingNotificationToOwner.mockResolvedValue(undefined);
    mocks.userUpdateOne.mockResolvedValue({
      matchedCount: 1,
      modifiedCount: 1,
    });
    mocks.rentalExistsSession.mockResolvedValue(null);
    mocks.rentalExists.mockReturnValue({
      session: mocks.rentalExistsSession,
    });

    const carFindById = vi.fn().mockResolvedValue(createCar());
    vi.mocked(Car).findById = carFindById;

    const userFindById = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue({
            _id: ownerId,
            name: 'Owner',
            email: 'owner@test.com',
          }),
        }),
      }),
    }));
    vi.mocked(User).findById = userFindById;

    mocks.create.mockResolvedValue([createRental()]);
    mocks.findOneAndUpdate.mockResolvedValue(createCar());
  });

  it('books a car in a transaction', async () => {
    const response = await POST(
      createRequest({
        carId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
    );

    expect(response.status).toBe(201);
    expect(mocks.withTransaction).toHaveBeenCalledOnce();
    expect(mocks.endSession).toHaveBeenCalledOnce();
    expect(mocks.userUpdateOne).toHaveBeenCalledWith(
      { _id: clientId },
      { $inc: { bookingVersion: 1 } },
      { session: expect.anything() }
    );
    expect(mocks.rentalExists).toHaveBeenCalledWith({
      client: clientId,
      status: 'active',
      'rentalPeriod.startDate': { $lt: endDate },
      'rentalPeriod.endDate': { $gt: startDate },
    });
    expect(mocks.findOneAndUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: carId,
        bookedPeriods: expect.objectContaining({
          $not: expect.anything(),
        }),
      }),
      expect.objectContaining({
        $push: expect.objectContaining({
          bookedPeriods: expect.any(Object),
        }),
      }),
      expect.objectContaining({ new: true, session: expect.anything() })
    );
    expect(mocks.create).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          car: carId,
          client: clientId,
          renter: ownerId,
        }),
      ]),
      expect.objectContaining({ session: expect.anything() })
    );
  });

  it('returns 409 when the client already has an overlapping active rental', async () => {
    mocks.rentalExistsSession.mockResolvedValueOnce({ _id: rentalId });

    const response = await POST(
      createRequest({
        carId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      message: 'You already have an active reservation for the selected dates',
    });
    expect(mocks.findOneAndUpdate).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.endSession).toHaveBeenCalledOnce();
  });

  it('checks only active rentals with an available end-date boundary', async () => {
    const response = await POST(
      createRequest({
        carId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
    );

    expect(response.status).toBe(201);
    expect(mocks.rentalExists).toHaveBeenCalledWith({
      client: clientId,
      status: 'active',
      'rentalPeriod.startDate': { $lt: endDate },
      'rentalPeriod.endDate': { $gt: startDate },
    });
  });

  it('locks the client before checking for an overlapping rental', async () => {
    await POST(
      createRequest({
        carId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
    );

    expect(mocks.userUpdateOne.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.rentalExists.mock.invocationCallOrder[0]
    );
  });

  it('returns 409 when the atomic reservation update loses a concurrency race', async () => {
    mocks.findOneAndUpdate
      .mockResolvedValueOnce(createCar())
      .mockResolvedValueOnce(null);

    const [firstResponse, secondResponse] = await Promise.all([
      POST(
        createRequest({
          carId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        })
      ),
      POST(
        createRequest({
          carId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        })
      ),
    ]);

    expect([firstResponse.status, secondResponse.status].sort()).toEqual([
      201, 409,
    ]);
    expect(mocks.findOneAndUpdate).toHaveBeenCalledTimes(2);
    expect(mocks.create).toHaveBeenCalledOnce();
    expect(mocks.endSession).toHaveBeenCalledTimes(2);
  });

  it('stops the booking flow when rental creation fails in the transaction', async () => {
    mocks.create.mockRejectedValueOnce(new Error('Rental creation failed'));

    const response = await POST(
      createRequest({
        carId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
    );

    expect(response.status).toBe(500);
    expect(mocks.withTransaction).toHaveBeenCalledOnce();
    expect(mocks.findOneAndUpdate).toHaveBeenCalledOnce();
    expect(mocks.endSession).toHaveBeenCalledOnce();
    expect(mocks.sendBookingConfirmationToCustomer).not.toHaveBeenCalled();
    expect(mocks.sendBookingNotificationToOwner).not.toHaveBeenCalled();
  });

  it('rejects when car is not found', async () => {
    vi.mocked(Car).findById = vi.fn().mockResolvedValue(null);

    const response = await POST(
      createRequest({
        carId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
    );

    expect(response.status).toBe(404);
    expect(mocks.startSession).not.toHaveBeenCalled();
  });

  it('rejects when trying to book own car', async () => {
    vi.mocked(Car).findById = vi
      .fn()
      .mockResolvedValue(createCar({ renter: clientId }));

    const response = await POST(
      createRequest({
        carId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
    );

    expect(response.status).toBe(403);
    expect(mocks.startSession).not.toHaveBeenCalled();
  });

  it('rejects unauthenticated requests', async () => {
    mocks.getServerSession.mockResolvedValue(null);

    const response = await POST(
      createRequest({
        carId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
    );

    expect(response.status).toBe(401);
    expect(mocks.connectToDatabase).not.toHaveBeenCalled();
  });

  it('sends booking confirmation and notification emails', async () => {
    await POST(
      createRequest({
        carId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
    );

    expect(mocks.sendBookingConfirmationToCustomer).toHaveBeenCalledWith(
      expect.objectContaining({
        customerEmail: 'client@test.com',
        customerName: 'Client',
      })
    );
    expect(mocks.sendBookingNotificationToOwner).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'owner@test.com',
        ownerName: 'Owner',
      })
    );
  });
});
