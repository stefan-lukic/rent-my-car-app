import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  connectToDatabase: vi.fn(),
  find: vi.fn(),
  sort: vi.fn(),
  populateCar: vi.fn(),
  populateClient: vi.fn(),
  lean: vi.fn(),
}));

vi.mock('next-auth/next', () => ({
  getServerSession: mocks.getServerSession,
}));

vi.mock('@/lib/db/mongoose', () => ({
  default: mocks.connectToDatabase,
}));

vi.mock('@/lib/model/Rental', () => ({
  default: { find: mocks.find },
}));

import { GET } from './route';

describe('GET /api/owner-bookings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.find.mockReturnValue({ sort: mocks.sort });
    mocks.sort.mockReturnValue({ populate: mocks.populateCar });
    mocks.populateCar.mockReturnValue({ populate: mocks.populateClient });
    mocks.populateClient.mockReturnValue({ lean: mocks.lean });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('rejects unauthenticated requests before querying the database', async () => {
    mocks.getServerSession.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
    expect(mocks.connectToDatabase).not.toHaveBeenCalled();
    expect(mocks.find).not.toHaveBeenCalled();
  });

  it('returns only bookings owned by the signed-in user', async () => {
    const bookings = [{ _id: 'booking-1' }];
    mocks.getServerSession.mockResolvedValue({ user: { id: 'owner-1' } });
    mocks.lean.mockResolvedValue(bookings);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mocks.find).toHaveBeenCalledWith({ renter: 'owner-1' });
    expect(mocks.populateCar).toHaveBeenCalledWith(
      'car',
      'make carModel images city carLocation'
    );
    expect(mocks.populateClient).toHaveBeenCalledWith(
      'client',
      'name email contactInfo images rating ratingCount'
    );
    expect(body).toEqual(bookings);
  });

  it('returns contact details only for active current or future bookings', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-25T12:00:00.000Z'));
    mocks.getServerSession.mockResolvedValue({ user: { id: 'owner-1' } });
    mocks.lean.mockResolvedValue([
      {
        _id: 'active-booking',
        status: 'active',
        rentalPeriod: { endDate: new Date('2026-08-25T00:00:00.000Z') },
        client: {
          name: 'Active client',
          email: 'active@example.com',
          contactInfo: '+381601111111',
        },
      },
      {
        _id: 'cancelled-booking',
        status: 'cancelled',
        rentalPeriod: { endDate: new Date('2026-09-01T00:00:00.000Z') },
        client: {
          name: 'Cancelled client',
          email: 'cancelled@example.com',
          contactInfo: '+381602222222',
        },
      },
      {
        _id: 'completed-booking',
        status: 'active',
        rentalPeriod: { endDate: new Date('2026-08-24T00:00:00.000Z') },
        client: {
          name: 'Completed client',
          email: 'completed@example.com',
          contactInfo: '+381603333333',
        },
      },
    ]);

    const response = await GET();
    const body = await response.json();

    expect(body[0].client).toEqual({
      name: 'Active client',
      email: 'active@example.com',
      contactInfo: '+381601111111',
    });
    expect(body[1].client).toEqual({ name: 'Cancelled client' });
    expect(body[2].client).toEqual({ name: 'Completed client' });
  });

  it('returns a safe error when the query fails', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    mocks.getServerSession.mockResolvedValue({ user: { id: 'owner-1' } });
    mocks.lean.mockRejectedValue(new Error('Database unavailable'));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ message: 'Unable to load incoming bookings' });
    expect(consoleError).toHaveBeenCalledWith(
      'Failed to fetch owner bookings:',
      expect.any(Error)
    );
  });
});
