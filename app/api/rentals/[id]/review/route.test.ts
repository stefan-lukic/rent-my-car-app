import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  connectToDatabase: vi.fn(),
  isValidObjectId: vi.fn(),
  startSession: vi.fn(),
  findById: vi.fn(),
  select: vi.fn(),
  leanRental: vi.fn(),
  findOneAndUpdate: vi.fn(),
  leanUpdated: vi.fn(),
  aggregate: vi.fn(),
  aggregateSession: vi.fn(),
  updateUser: vi.fn(),
  updateCar: vi.fn(),
  withTransaction: vi.fn(),
  endSession: vi.fn(),
}));

vi.mock('next-auth/next', () => ({
  getServerSession: mocks.getServerSession,
}));

vi.mock('@/lib/db/mongoose', () => ({
  default: mocks.connectToDatabase,
}));

vi.mock('mongoose', () => ({
  default: {
    isValidObjectId: mocks.isValidObjectId,
    startSession: mocks.startSession,
  },
}));

vi.mock('@/lib/model/Rental', () => ({
  default: {
    findById: mocks.findById,
    findOneAndUpdate: mocks.findOneAndUpdate,
    aggregate: mocks.aggregate,
  },
}));

vi.mock('@/lib/model/User', () => ({
  default: { findByIdAndUpdate: mocks.updateUser },
}));

vi.mock('@/lib/model/car/Car', () => ({
  default: { findByIdAndUpdate: mocks.updateCar },
}));

import { POST } from './route';

const rentalId = '507f1f77bcf86cd799439011';
const ids = {
  rental: rentalId,
  car: { toString: () => 'car-1' },
  owner: { toString: () => 'owner-1' },
  client: { toString: () => 'client-1' },
};

const createRequest = (body: object) =>
  ({ json: vi.fn().mockResolvedValue(body) }) as never;

const completedRental = (overrides: Record<string, unknown> = {}) => ({
  _id: ids.rental,
  car: ids.car,
  renter: ids.owner,
  client: ids.client,
  status: 'active',
  rentalPeriod: { endDate: new Date(Date.now() - 86_400_000) },
  ...overrides,
});

describe('POST /api/rentals/[id]/review', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isValidObjectId.mockReturnValue(true);
    mocks.findById.mockReturnValue({ select: mocks.select });
    mocks.select.mockReturnValue({ lean: mocks.leanRental });
    mocks.findOneAndUpdate.mockReturnValue({ lean: mocks.leanUpdated });
    mocks.aggregate.mockReturnValue({ session: mocks.aggregateSession });
    mocks.aggregateSession.mockResolvedValue([
      { total: 9, average: 4.5, count: 2 },
    ]);
    mocks.withTransaction.mockImplementation(async (callback) => callback());
    mocks.startSession.mockResolvedValue({
      withTransaction: mocks.withTransaction,
      endSession: mocks.endSession,
    });
    mocks.endSession.mockResolvedValue(undefined);
    mocks.updateUser.mockResolvedValue(undefined);
    mocks.updateCar.mockResolvedValue(undefined);
  });

  it('rejects unauthenticated users', async () => {
    mocks.getServerSession.mockResolvedValue(null);

    const response = await POST(createRequest({}), {
      params: { id: rentalId },
    });

    expect(response.status).toBe(401);
    expect(mocks.connectToDatabase).not.toHaveBeenCalled();
  });

  it('rejects an invalid rental ID before querying the database', async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: 'client-1' } });
    mocks.isValidObjectId.mockReturnValue(false);

    const response = await POST(createRequest({}), {
      params: { id: 'invalid-id' },
    });

    expect(response.status).toBe(400);
    expect(mocks.connectToDatabase).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON before querying the database', async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: 'client-1' } });
    const request = {
      json: vi.fn().mockRejectedValue(new SyntaxError('Invalid JSON')),
    } as never;

    const response = await POST(request, { params: { id: rentalId } });

    expect(response.status).toBe(400);
    expect(mocks.connectToDatabase).not.toHaveBeenCalled();
  });

  it('rejects users who are not part of the rental', async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: 'stranger-1' } });
    mocks.leanRental.mockResolvedValue({
      _id: ids.rental,
      car: ids.car,
      renter: ids.owner,
      client: ids.client,
      status: 'active',
      rentalPeriod: { endDate: new Date(Date.now() - 86_400_000) },
    });

    const response = await POST(createRequest({ clientRating: 5 }), {
      params: { id: rentalId },
    });

    expect(response.status).toBe(403);
    expect(mocks.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('rejects reviews before the rental has ended', async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: 'client-1' } });
    mocks.leanRental.mockResolvedValue({
      _id: ids.rental,
      car: ids.car,
      renter: ids.owner,
      client: ids.client,
      status: 'active',
      rentalPeriod: { endDate: new Date(Date.now() + 86_400_000) },
    });

    const response = await POST(
      createRequest({ carRating: 5, ownerRating: 5 }),
      { params: { id: rentalId } }
    );

    expect(response.status).toBe(409);
    expect(mocks.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('rejects reviews for cancelled rentals', async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: 'client-1' } });
    mocks.leanRental.mockResolvedValue(
      completedRental({ status: 'cancelled' })
    );

    const response = await POST(
      createRequest({ carRating: 5, ownerRating: 5 }),
      { params: { id: rentalId } }
    );

    expect(response.status).toBe(409);
    expect(mocks.startSession).not.toHaveBeenCalled();
  });

  it('rejects ratings outside the whole-number 1 to 5 range', async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: 'client-1' } });
    mocks.leanRental.mockResolvedValue(completedRental());

    const response = await POST(
      createRequest({ carRating: 4.5, ownerRating: 6 }),
      { params: { id: rentalId } }
    );

    expect(response.status).toBe(400);
    expect(mocks.startSession).not.toHaveBeenCalled();
  });

  it('saves both car and owner ratings from the client', async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: 'client-1' } });
    mocks.leanRental.mockResolvedValue({
      _id: ids.rental,
      car: ids.car,
      renter: ids.owner,
      client: ids.client,
      status: 'active',
      rentalPeriod: { endDate: new Date(Date.now() - 86_400_000) },
    });
    mocks.leanUpdated.mockResolvedValue({
      clientReview: { carRating: 5, ownerRating: 4, submittedAt: new Date() },
    });
    mocks.aggregateSession
      .mockResolvedValueOnce([{ total: 10, count: 2 }])
      .mockResolvedValueOnce([{ total: 4, count: 1 }])
      .mockResolvedValueOnce([{ average: 4.7, count: 3 }]);

    const response = await POST(
      createRequest({ carRating: 5, ownerRating: 4 }),
      { params: { id: rentalId } }
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.message).toBe('Rating submitted');
    expect(mocks.findOneAndUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        client: 'client-1',
        'clientReview.submittedAt': { $exists: false },
      }),
      expect.objectContaining({
        $set: expect.objectContaining({
          clientReview: expect.objectContaining({
            carRating: 5,
            ownerRating: 4,
          }),
        }),
      }),
      expect.objectContaining({ new: true })
    );
    expect(mocks.updateUser).toHaveBeenCalledWith(
      ids.owner,
      { rating: 4.7, ratingCount: 3 },
      expect.objectContaining({ session: expect.anything() })
    );
    expect(mocks.updateCar).toHaveBeenCalledWith(
      ids.car,
      { rating: 4.7, ratingCount: 3 },
      expect.objectContaining({ session: expect.anything() })
    );
    expect(mocks.endSession).toHaveBeenCalled();
  });

  it('prevents the same side from reviewing twice', async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: 'owner-1' } });
    mocks.leanRental.mockResolvedValue({
      _id: ids.rental,
      car: ids.car,
      renter: ids.owner,
      client: ids.client,
      status: 'active',
      rentalPeriod: { endDate: new Date(Date.now() - 86_400_000) },
    });
    mocks.leanUpdated.mockResolvedValue(null);

    const response = await POST(createRequest({ clientRating: 5 }), {
      params: { id: rentalId },
    });

    expect(response.status).toBe(409);
    expect(mocks.updateUser).not.toHaveBeenCalled();
    expect(mocks.endSession).toHaveBeenCalled();
  });

  it('lets the owner rate the client after a completed rental', async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: 'owner-1' } });
    mocks.leanRental.mockResolvedValue({
      _id: ids.rental,
      car: ids.car,
      renter: ids.owner,
      client: ids.client,
      status: 'active',
      rentalPeriod: { endDate: new Date(Date.now() - 86_400_000) },
    });
    mocks.leanUpdated.mockResolvedValue({
      ownerReview: { clientRating: 4, submittedAt: new Date() },
    });

    const response = await POST(createRequest({ clientRating: 4 }), {
      params: { id: rentalId },
    });

    expect(response.status).toBe(201);
    expect(mocks.findOneAndUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        renter: 'owner-1',
        'ownerReview.submittedAt': { $exists: false },
      }),
      expect.objectContaining({
        $set: expect.objectContaining({
          ownerReview: expect.objectContaining({ clientRating: 4 }),
        }),
      }),
      expect.objectContaining({ new: true })
    );
    expect(mocks.updateUser).toHaveBeenCalled();
    expect(mocks.updateCar).not.toHaveBeenCalled();
  });

  it('ends the database session when the transaction fails', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    mocks.getServerSession.mockResolvedValue({ user: { id: 'owner-1' } });
    mocks.leanRental.mockResolvedValue(completedRental());
    mocks.withTransaction.mockRejectedValue(new Error('Database failure'));

    const response = await POST(createRequest({ clientRating: 5 }), {
      params: { id: rentalId },
    });

    expect(response.status).toBe(500);
    expect(mocks.endSession).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
