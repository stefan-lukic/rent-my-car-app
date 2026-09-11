import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  connectToDatabase: vi.fn(),
  validateImageUploads: vi.fn(),
}));

vi.mock('next-auth/next', () => ({
  getServerSession: mocks.getServerSession,
}));

vi.mock('@/lib/authOptions', () => ({ authOptions: {} }));

vi.mock('@/lib/db/mongoose', () => ({
  default: mocks.connectToDatabase,
}));

vi.mock('@/lib/imageUploadValidation', () => ({
  validateImageUploads: mocks.validateImageUploads,
}));

import { POST } from './route';

describe('POST /api/cars/add-car image validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getServerSession.mockResolvedValue({ user: { id: 'owner-1' } });
    mocks.connectToDatabase.mockResolvedValue(undefined);
    mocks.validateImageUploads.mockReturnValue({
      files: [],
      error: 'Only JPEG, PNG, and WebP images are allowed',
    });
  });

  it('rejects unsupported images before reading or processing them', async () => {
    const formData = new FormData();
    const request = new NextRequest('http://localhost:3000/api/cars/add-car', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: 'Only JPEG, PNG, and WebP images are allowed',
    });
  });
});
