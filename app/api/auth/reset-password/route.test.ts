import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  connectToDatabase: vi.fn(),
  hash: vi.fn(),
  hashToken: vi.fn(),
  findOneAndUpdate: vi.fn(),
}));

vi.mock('@/lib/db/mongoose', () => ({
  default: mocks.connectToDatabase,
}));

vi.mock('bcryptjs', () => ({
  default: { hash: mocks.hash },
}));

vi.mock('@/lib/emailVerification', () => ({
  hashToken: mocks.hashToken,
}));

vi.mock('@/lib/model/User', () => ({
  default: { findOneAndUpdate: mocks.findOneAndUpdate },
}));

import { POST } from './route';

const createRequest = (body: unknown) =>
  new NextRequest('http://localhost/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

describe('POST /api/auth/reset-password', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.hash.mockResolvedValue('hashed-password');
    mocks.hashToken.mockReturnValue('hashed-reset-token');
    mocks.findOneAndUpdate.mockResolvedValue({ _id: 'user-1' });
  });

  it('changes the password, consumes the token and revokes old sessions atomically', async () => {
    const response = await POST(
      createRequest({ token: 'a'.repeat(64), password: 'new-password' })
    );

    expect(response.status).toBe(200);
    expect(mocks.findOneAndUpdate).toHaveBeenCalledWith(
      {
        passwordResetToken: 'hashed-reset-token',
        passwordResetExpires: { $gt: expect.any(Date) },
      },
      {
        $set: { password: 'hashed-password' },
        $unset: { passwordResetToken: 1, passwordResetExpires: 1 },
        $inc: { sessionVersion: 1 },
      },
      { new: true }
    );
  });

  it('rejects an invalid or expired reset token', async () => {
    mocks.findOneAndUpdate.mockResolvedValue(null);

    const response = await POST(
      createRequest({ token: 'a'.repeat(64), password: 'new-password' })
    );

    expect(response.status).toBe(400);
  });

  it('rejects malformed input before accessing the database', async () => {
    const response = await POST(
      createRequest({ token: 'invalid', password: 'short' })
    );

    expect(response.status).toBe(400);
    expect(mocks.connectToDatabase).not.toHaveBeenCalled();
    expect(mocks.findOneAndUpdate).not.toHaveBeenCalled();
  });
});
