import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

const mocks = vi.hoisted(() => ({
  connectToDatabase: vi.fn(),
  findOne: vi.fn(),
  save: vi.fn(),
  deleteOne: vi.fn(),
  hash: vi.fn(),
  sendEmailVerification: vi.fn(),
  captureUserData: vi.fn(),
  validateImageUploads: vi.fn(),
}));

vi.mock('@/lib/db/mongoose', () => ({
  default: mocks.connectToDatabase,
}));

vi.mock('@/lib/model/User', () => {
  function MockUser(data: Record<string, unknown>) {
    mocks.captureUserData(data);
    return {
      ...data,
      _id: 'user-1',
      save: mocks.save,
    };
  }

  Object.assign(MockUser, {
    findOne: mocks.findOne,
    deleteOne: mocks.deleteOne,
  });

  return { default: MockUser };
});

vi.mock('bcryptjs', () => ({
  default: { hash: mocks.hash },
}));

vi.mock('@/lib/emailVerification', () => ({
  generateVerificationToken: () => ({
    rawToken: 'raw-token',
    hash: 'hashed-token',
    expires: new Date('2026-08-25T16:00:00.000Z'),
  }),
}));

vi.mock('@/lib/emailService/sendEmail', () => ({
  sendEmailVerification: mocks.sendEmailVerification,
}));

vi.mock('@/lib/imageUploadValidation', () => ({
  validateImageUploads: mocks.validateImageUploads,
}));

const createRequest = (phoneNumber?: string) => {
  const formData = new FormData();
  formData.set('name', 'Marko Markovic');
  formData.set('email', 'marko@example.com');
  formData.set('password', 'sigurna-lozinka');

  if (phoneNumber !== undefined) {
    formData.set('phoneNumber', phoneNumber);
  }

  return new NextRequest('http://localhost:3000/api/auth/signup', {
    method: 'POST',
    body: formData,
  });
};

describe('POST /api/auth/signup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('APP_URL', 'http://localhost:3000');
    mocks.findOne.mockResolvedValue(null);
    mocks.hash.mockResolvedValue('hashed-password');
    mocks.save.mockResolvedValue(undefined);
    mocks.sendEmailVerification.mockResolvedValue(undefined);
    mocks.validateImageUploads.mockReturnValue({ files: [], error: null });
  });

  it('rejects signup without a valid phone number before accessing the database', async () => {
    const response = await POST(createRequest());

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: 'A valid phone number is required',
    });
    expect(mocks.connectToDatabase).not.toHaveBeenCalled();
  });

  it('normalizes and saves a valid phone number as contactInfo', async () => {
    const response = await POST(createRequest('+381 (60) 123-4567'));

    expect(response.status).toBe(201);
    expect(mocks.captureUserData).toHaveBeenCalledWith(
      expect.objectContaining({ contactInfo: '+381601234567' })
    );
    expect(mocks.save).toHaveBeenCalledOnce();
    expect(mocks.sendEmailVerification).toHaveBeenCalledWith({
      email: 'marko@example.com',
      token: 'raw-token',
      appUrl: 'http://localhost:3000',
    });
  });

  it('rejects unsupported images before accessing the database', async () => {
    mocks.validateImageUploads.mockReturnValue({
      files: [],
      error: 'Only JPEG, PNG, and WebP images are allowed',
    });

    const response = await POST(createRequest('+381601234567'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: 'Only JPEG, PNG, and WebP images are allowed',
    });
    expect(mocks.connectToDatabase).not.toHaveBeenCalled();
  });
});
