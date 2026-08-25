import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { PUT } from './route';

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  connectToDatabase: vi.fn(),
  findByIdAndUpdate: vi.fn(),
}));

vi.mock('next-auth/next', () => ({
  getServerSession: mocks.getServerSession,
}));

vi.mock('@/lib/authOptions', () => ({ authOptions: {} }));

vi.mock('@/lib/db/mongoose', () => ({
  default: mocks.connectToDatabase,
}));

vi.mock('@/lib/model/User', () => ({
  default: { findByIdAndUpdate: mocks.findByIdAndUpdate },
}));

const createRequest = (contactInfo: string) => {
  const formData = new FormData();
  formData.set('name', 'Marko Markovic');
  formData.set('contactInfo', contactInfo);

  return new NextRequest('http://localhost:3000/api/users/me', {
    method: 'PUT',
    body: formData,
  });
};

describe('PUT /api/users/me', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getServerSession.mockResolvedValue({ user: { id: 'user-1' } });
    mocks.findByIdAndUpdate.mockResolvedValue({
      toObject: () => ({
        _id: 'user-1',
        name: 'Marko Markovic',
        contactInfo: '+381601234567',
        password: 'hashed-password',
      }),
    });
  });

  it('rejects invalid contact information before accessing the database', async () => {
    const response = await PUT(createRequest('0#dfj,#&!$%213'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: 'A valid phone number is required',
    });
    expect(mocks.connectToDatabase).not.toHaveBeenCalled();
    expect(mocks.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('normalizes a valid phone number before updating the current user', async () => {
    const response = await PUT(createRequest('+381 (60) 123-4567'));

    expect(response.status).toBe(200);
    expect(mocks.findByIdAndUpdate).toHaveBeenCalledWith(
      'user-1',
      {
        name: 'Marko Markovic',
        contactInfo: '+381601234567',
      },
      { new: true, runValidators: true }
    );
    expect(await response.json()).not.toHaveProperty('user.password');
  });
});
