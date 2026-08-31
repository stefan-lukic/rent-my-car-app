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
  default: { findById: vi.fn() },
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

const startDate = new Date(Date.now() + 86_400_000);
const endDate = new Date(Date.now() + 172_800_000);

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
