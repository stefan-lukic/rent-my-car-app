import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  connectToDatabase: vi.fn(),
  findById: vi.fn(),
}));

vi.mock('@/lib/db/mongoose', () => ({
  default: mocks.connectToDatabase,
}));

vi.mock('@/lib/model/User', () => ({
  default: {
    findOne: vi.fn(),
    findById: mocks.findById,
  },
}));

vi.mock('bcryptjs', () => ({
  default: { compare: vi.fn() },
}));

import { authOptions } from './authOptions';

const runJwt = async (token: Record<string, unknown>, user?: object) => {
  const callback = authOptions.callbacks?.jwt;
  if (!callback) throw new Error('JWT callback is not configured');

  return callback({ token, user } as never);
};

const runSession = async (
  session: { user: { id?: string }; expires: string },
  token: Record<string, unknown>
) => {
  const callback = authOptions.callbacks?.session;
  if (!callback) throw new Error('Session callback is not configured');

  return callback({ session, token } as never);
};

const mockCurrentUser = (sessionVersion: number | undefined) => {
  const lean = vi
    .fn()
    .mockResolvedValue(
      sessionVersion === undefined ? null : { sessionVersion }
    );
  const select = vi.fn().mockReturnValue({ lean });
  mocks.findById.mockReturnValue({ select });
};

describe('auth session version callbacks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('stores the current session version when a user signs in', async () => {
    const token = await runJwt({}, { id: 'user-1', sessionVersion: 3 });

    expect(token).toMatchObject({
      id: 'user-1',
      sessionVersion: 3,
      revoked: false,
    });
    expect(mocks.findById).not.toHaveBeenCalled();
  });

  it('keeps a token whose version matches the database', async () => {
    mockCurrentUser(2);

    const token = await runJwt({
      id: 'user-1',
      sessionVersion: 2,
    });

    expect(token).toMatchObject({
      id: 'user-1',
      sessionVersion: 2,
    });
    expect(token.revoked).not.toBe(true);
  });

  it('revokes a token after the database version changes', async () => {
    mockCurrentUser(4);

    const token = await runJwt({
      id: 'user-1',
      sessionVersion: 3,
    });

    expect(token.revoked).toBe(true);
    expect(token.id).toBeUndefined();
  });

  it('revokes a token when its user no longer exists', async () => {
    mockCurrentUser(undefined);

    const token = await runJwt({
      id: 'missing-user',
      sessionVersion: 0,
    });

    expect(token.revoked).toBe(true);
    expect(token.id).toBeUndefined();
  });

  it('returns no authenticated session for a revoked token', async () => {
    const session = await runSession(
      { user: {}, expires: new Date().toISOString() },
      { revoked: true }
    );

    expect(session).toBeNull();
  });

  it('adds the user id to a valid session', async () => {
    const session = await runSession(
      { user: {}, expires: new Date().toISOString() },
      { id: 'user-1', sessionVersion: 1 }
    );

    expect(session).toMatchObject({ user: { id: 'user-1' } });
  });
});
