import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  connectToDatabase: vi.fn(),
  findById: vi.fn(),
  select: vi.fn(),
  lean: vi.fn(),
}));

vi.mock('@/lib/db/mongoose', () => ({
  default: mocks.connectToDatabase,
}));

vi.mock('@/lib/model/User', () => ({
  default: { findById: mocks.findById },
}));

import { GET } from './route';

const userId = '507f1f77bcf86cd799439011';
const missingUserId = '507f1f77bcf86cd799439012';

describe('GET /api/users/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.findById.mockReturnValue({ select: mocks.select });
    mocks.select.mockReturnValue({ lean: mocks.lean });
  });

  it('returns only the public profile projection', async () => {
    mocks.lean.mockResolvedValue({
      _id: 'user-1',
      name: 'Marko Markovic',
      images: ['/avatar.jpg'],
      rating: 4.8,
    });

    const response = await GET({} as never, { params: { id: userId } });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mocks.select).toHaveBeenCalledWith('name images rating ratingCount');
    expect(body).not.toHaveProperty('email');
    expect(body).not.toHaveProperty('password');
    expect(body).not.toHaveProperty('passwordResetToken');
  });

  it('returns 404 when the profile does not exist', async () => {
    mocks.lean.mockResolvedValue(null);

    const response = await GET({} as never, { params: { id: missingUserId } });

    expect(response.status).toBe(404);
  });

  it('returns 400 for a malformed user id without querying the database', async () => {
    const response = await GET({} as never, {
      params: { id: 'not-a-valid-id' },
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ message: 'Invalid user ID' });
    expect(mocks.connectToDatabase).not.toHaveBeenCalled();
    expect(mocks.findById).not.toHaveBeenCalled();
  });
});
