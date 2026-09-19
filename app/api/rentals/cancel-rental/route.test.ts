import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  connectToDatabase: vi.fn(),
  isValidObjectId: vi.fn(),
  startSession: vi.fn(),
  withTransaction: vi.fn(),
  endSession: vi.fn(),
  findById: vi.fn(),
  findOneAndUpdate: vi.fn(),
  serializeRental: vi.fn(),
  updateOne: vi.fn(),
  findCarById: vi.fn(),
  findUserById: vi.fn(),
  sendCustomerEmail: vi.fn(),
  sendOwnerEmail: vi.fn(),
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
  sendCancellationNotificationToCustomer: mocks.sendCustomerEmail,
  sendCancellationNotificationToOwner: mocks.sendOwnerEmail,
}));

import { DELETE } from './route';

const rentalId = '507f1f77bcf86cd799439011';
const clientId = '507f1f77bcf86cd799439012';
const carId = '507f1f77bcf86cd799439013';
const ownerId = '507f1f77bcf86cd799439014';
const currentTime = new Date('2026-09-01T12:00:00.000Z');
const populatedCar = {
  _id: carId,
  make: 'Audi',
  carModel: 'A4',
  city: 'Novi Sad',
  pricePerDay: 60,
};

const createRequest = () =>
  ({ json: vi.fn().mockResolvedValue({ rentalId }) }) as never;

const createUpcomingRental = (overrides: Record<string, unknown> = {}) => ({
  _id: rentalId,
  car: carId,
  renter: ownerId,
  client: { toString: () => clientId },
  status: 'active',
  toObject: mocks.serializeRental,
  rentalPeriod: {
    startDate: new Date(Date.now() + 2 * 86_400_000),
    endDate: new Date(Date.now() + 3 * 86_400_000),
  },
  ...overrides,
});

const mockNotificationRecipients = () => {
  const users = new Map([
    [clientId, { _id: clientId, name: 'Ana', email: 'ana@example.com' }],
    [ownerId, { _id: ownerId, name: 'Milan', email: 'milan@example.com' }],
  ]);
  mocks.findUserById.mockImplementation((id: { toString(): string }) => ({
    select: () => ({
      lean: () => ({ exec: async () => users.get(id.toString()) ?? null }),
    }),
  }));
};

describe('DELETE /api/rentals/cancel-rental', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(currentTime);
    vi.clearAllMocks();
    mocks.sendCustomerEmail.mockReset().mockResolvedValue(undefined);
    mocks.sendOwnerEmail.mockReset().mockResolvedValue(undefined);
    mocks.getServerSession.mockResolvedValue({ user: { id: clientId } });
    mocks.isValidObjectId.mockReturnValue(true);
    mocks.findById.mockResolvedValue(createUpcomingRental());
    mocks.findOneAndUpdate.mockResolvedValue(
      createUpcomingRental({ status: 'cancelled' })
    );
    mocks.serializeRental.mockReturnValue({
      _id: rentalId,
      car: carId,
      status: 'cancelled',
    });
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
      lean: () => ({ exec: async () => populatedCar }),
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it('rejects cancellation when less than 24 hours remain', async () => {
    mocks.findById.mockResolvedValue(
      createUpcomingRental({
        rentalPeriod: {
          startDate: new Date(Date.now() + 23 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 2 * 86_400_000),
        },
      })
    );

    const response = await DELETE(createRequest());

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      message:
        'Reservations can only be cancelled at least 24 hours before the start time',
    });
    expect(mocks.startSession).not.toHaveBeenCalled();
  });

  it('allows cancellation exactly 24 hours before the start time', async () => {
    mocks.findById.mockResolvedValue(
      createUpcomingRental({
        rentalPeriod: {
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 2 * 86_400_000),
        },
      })
    );

    const response = await DELETE(createRequest());

    expect(response.status).toBe(200);
    expect(mocks.startSession).toHaveBeenCalledOnce();
  });

  it('allows the car owner to cancel an upcoming reservation', async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: ownerId } });

    const response = await DELETE(createRequest());

    expect(response.status).toBe(200);
    expect(mocks.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: rentalId, status: 'active' },
      expect.objectContaining({
        $set: expect.objectContaining({
          status: 'cancelled',
          cancelledBy: expect.anything(),
        }),
      }),
      expect.objectContaining({ new: true, session: expect.anything() })
    );
    expect(
      mocks.findOneAndUpdate.mock.calls[0][1].$set.cancelledBy.toString()
    ).toBe(ownerId);
    expect(mocks.updateOne).toHaveBeenCalledOnce();
  });

  it('lets the owner cancel inside the client 24-hour cutoff', async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: ownerId } });
    mocks.findById.mockResolvedValue(
      createUpcomingRental({
        rentalPeriod: {
          startDate: new Date(Date.now() + 23 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 2 * 86_400_000),
        },
      })
    );

    const response = await DELETE(createRequest());

    expect(response.status).toBe(200);
    expect(mocks.updateOne).toHaveBeenCalledOnce();
  });

  it('blocks the owner once the rental starts', async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: ownerId } });
    mocks.findById.mockResolvedValue(
      createUpcomingRental({
        rentalPeriod: {
          startDate: new Date(Date.now()),
          endDate: new Date(Date.now() + 2 * 86_400_000),
        },
      })
    );

    const response = await DELETE(createRequest());

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      message: 'Reservations cannot be cancelled after the rental starts',
    });
    expect(mocks.startSession).not.toHaveBeenCalled();
  });

  it('emails both parties only after the owner cancellation commits', async () => {
    const rental = createUpcomingRental();
    let committed = false;
    mocks.getServerSession.mockResolvedValue({ user: { id: ownerId } });
    mocks.findById.mockResolvedValue(rental);
    mockNotificationRecipients();
    mocks.withTransaction.mockImplementation(async (callback) => {
      await callback();
      committed = true;
    });
    mocks.sendCustomerEmail.mockImplementation(async () => {
      expect(committed).toBe(true);
    });
    mocks.sendOwnerEmail.mockImplementation(async () => {
      expect(committed).toBe(true);
    });

    const response = await DELETE(createRequest());

    expect(response.status).toBe(200);
    expect(mocks.sendCustomerEmail).toHaveBeenCalledWith({
      customerEmail: 'ana@example.com',
      customerName: 'Ana',
      carName: 'Audi A4',
      startDate: rental.rentalPeriod.startDate,
      endDate: rental.rentalPeriod.endDate,
      cancelledByName: 'the car owner (Milan)',
    });
    expect(mocks.sendOwnerEmail).toHaveBeenCalledOnce();
  });

  it('keeps a committed owner cancellation successful if email fails', async () => {
    const emailError = new Error('SMTP unavailable');
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    mocks.getServerSession.mockResolvedValue({ user: { id: ownerId } });
    mockNotificationRecipients();
    mocks.sendCustomerEmail.mockRejectedValue(emailError);

    const response = await DELETE(createRequest());

    expect(response.status).toBe(200);
    expect(mocks.updateOne).toHaveBeenCalledOnce();
    expect(mocks.sendOwnerEmail).toHaveBeenCalledOnce();
    expect(consoleError).toHaveBeenCalledWith(
      'Failed to send customer cancellation:',
      emailError
    );
    consoleError.mockRestore();
  });

  it('does not break client cancellation when a historical rental lacks an owner', async () => {
    mocks.findById.mockResolvedValue(createUpcomingRental({ renter: null }));

    const response = await DELETE(createRequest());

    expect(response.status).toBe(200);
    expect(mocks.updateOne).toHaveBeenCalledOnce();
  });

  it('rejects cancellation by a user outside the reservation', async () => {
    mocks.getServerSession.mockResolvedValue({
      user: { id: '507f1f77bcf86cd799439099' },
    });

    const response = await DELETE(createRequest());

    expect(response.status).toBe(403);
    expect(mocks.startSession).not.toHaveBeenCalled();
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

  it('returns the cancelled rental with complete car data', async () => {
    const response = await DELETE(createRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mocks.serializeRental).toHaveBeenCalledOnce();
    expect(body.rental.car).toEqual(populatedCar);
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
    expect(mocks.sendCustomerEmail).not.toHaveBeenCalled();
    expect(mocks.sendOwnerEmail).not.toHaveBeenCalled();
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
