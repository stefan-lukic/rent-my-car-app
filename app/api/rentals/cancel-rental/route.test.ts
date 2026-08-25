import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  connectToDatabase: vi.fn(),
  findById: vi.fn(),
  findByIdAndUpdate: vi.fn(),
  updateOne: vi.fn(),
}));

vi.mock('next-auth/next', () => ({
  getServerSession: mocks.getServerSession,
}));

vi.mock('@/lib/db/mongoose', () => ({
  default: mocks.connectToDatabase,
}));

vi.mock('@/lib/model/Rental', () => ({
  default: {
    findById: mocks.findById,
    findByIdAndUpdate: mocks.findByIdAndUpdate,
  },
}));

vi.mock('@/lib/model/car/Car', () => ({
  default: {
    updateOne: mocks.updateOne,
    findById: vi.fn(),
  },
}));

vi.mock('@/lib/model/User', () => ({
  default: { findById: vi.fn() },
}));

vi.mock('@/lib/emailService/sendEmail', () => ({
  sendCancellationNotificationToCustomer: vi.fn(),
  sendCancellationNotificationToOwner: vi.fn(),
}));

import { DELETE } from './route';

const rentalId = '507f1f77bcf86cd799439011';
const createRequest = () =>
  ({ json: vi.fn().mockResolvedValue({ rentalId }) }) as never;

describe('DELETE /api/rentals/cancel-rental', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getServerSession.mockResolvedValue({ user: { id: 'client-1' } });
  });

  it('rejects cancellation after the reservation has started', async () => {
    mocks.findById.mockResolvedValue({
      _id: rentalId,
      client: { toString: () => 'client-1' },
      status: 'active',
      rentalPeriod: {
        startDate: new Date(Date.now() - 60_000),
        endDate: new Date(Date.now() + 60_000),
      },
    });

    const response = await DELETE(createRequest());

    expect(response.status).toBe(409);
    expect(mocks.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(mocks.updateOne).not.toHaveBeenCalled();
  });
});
