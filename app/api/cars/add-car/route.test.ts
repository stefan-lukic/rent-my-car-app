import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  connectToDatabase: vi.fn(),
  validateImageUploads: vi.fn(),
  carConstructor: vi.fn(),
  saveCar: vi.fn(),
  findUserByIdAndUpdate: vi.fn(),
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

vi.mock('@/lib/model/car/Car', () => ({
  default: class MockCar {
    _id = 'car-1';

    constructor(data: object) {
      mocks.carConstructor(data);
      Object.assign(this, data);
    }

    save() {
      return mocks.saveCar();
    }
  },
}));

vi.mock('@/lib/model/User', () => ({
  default: {
    findByIdAndUpdate: mocks.findUserByIdAndUpdate,
  },
}));

import { POST } from './route';

const validCarData = {
  make: 'MERCEDES',
  carModel: 'E-Class',
  engine: 'PETROL',
  power: '190',
  seats: '5',
  carType: 'SALOON',
  city: 'Belgrade',
  carLocation: ' City center ',
  firstRegistration: '2022-06-15T00:00:00.000Z',
  milage: '50000',
  averageConsumption: '7.2',
  pricePerDay: '65',
  description: ' Comfortable and well maintained. ',
};

const createRequest = (fields: Record<string, string>) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value));

  return new NextRequest('http://localhost:3000/api/cars/add-car', {
    method: 'POST',
    body: formData,
  });
};

describe('POST /api/cars/add-car', () => {
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
    const request = createRequest({});

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: 'Only JPEG, PNG, and WebP images are allowed',
    });
  });

  it('creates a car from allowed fields and ignores internal fields', async () => {
    mocks.validateImageUploads.mockReturnValue({ files: [] });
    mocks.saveCar.mockResolvedValue(undefined);
    mocks.findUserByIdAndUpdate.mockResolvedValue(undefined);

    const response = await POST(
      createRequest({
        ...validCarData,
        renter: 'another-user',
        rating: '5',
        ratingCount: '100',
        status: 'unavailable',
        bookedPeriods: '[{"startDate":"2026-10-12"}]',
        createdAt: '2000-01-01T00:00:00.000Z',
      })
    );

    expect(response.status).toBe(201);
    expect(mocks.carConstructor).toHaveBeenCalledWith({
      make: 'MERCEDES',
      carModel: 'E-Class',
      engine: 'PETROL',
      power: '190',
      seats: 5,
      carType: 'SALOON',
      city: 'Belgrade',
      carLocation: 'City center',
      firstRegistration: '2022-06-15T00:00:00.000Z',
      milage: 50000,
      averageConsumption: '7.2',
      images: [],
      pricePerDay: 65,
      description: 'Comfortable and well maintained.',
      renter: 'owner-1',
    });
    expect(mocks.saveCar).toHaveBeenCalledOnce();
    expect(mocks.findUserByIdAndUpdate).toHaveBeenCalledWith('owner-1', {
      $push: { cars: 'car-1' },
    });
  });
});
