import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  connectToDatabase: vi.fn(),
  findById: vi.fn(),
  findByIdAndUpdate: vi.fn(),
}));

vi.mock('next-auth/next', () => ({
  getServerSession: mocks.getServerSession,
}));

vi.mock('@/lib/db/mongoose', () => ({
  default: mocks.connectToDatabase,
}));

vi.mock('@/lib/model/car/Car', () => ({
  default: {
    findById: mocks.findById,
    findByIdAndUpdate: mocks.findByIdAndUpdate,
  },
}));

import { PUT } from './route';

const carId = '507f1f77bcf86cd799439011';
const validUpdate = {
  _id: carId,
  make: 'MERCEDES',
  carModel: 'E-Class',
  engine: 'PETROL',
  power: '190',
  seats: 5,
  carType: 'SALOON',
  city: 'Belgrade',
  averageConsumption: '7.2',
  milage: 50000,
  carLocation: 'City center',
  pricePerDay: 65,
  description: 'Comfortable and well maintained.',
};

const createRequest = (body: unknown) =>
  ({ json: vi.fn().mockResolvedValue(body) }) as never;

describe('PUT /api/cars/update-car', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects unauthenticated requests before touching the database', async () => {
    mocks.getServerSession.mockResolvedValue(null);

    const response = await PUT(createRequest({ _id: carId }));

    expect(response.status).toBe(401);
    expect(mocks.connectToDatabase).not.toHaveBeenCalled();
    expect(mocks.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('does not let another user update the car', async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: 'user-b' } });
    mocks.findById.mockResolvedValue({
      _id: carId,
      renter: { toString: () => 'user-a' },
    });

    const response = await PUT(createRequest(validUpdate));

    expect(response.status).toBe(403);
    expect(mocks.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('updates an owned car with Mongoose validation enabled', async () => {
    const updatedCar = { _id: carId, carModel: 'E-Class' };
    mocks.getServerSession.mockResolvedValue({ user: { id: 'user-a' } });
    mocks.findById.mockResolvedValue({
      _id: carId,
      renter: { toString: () => 'user-a' },
    });
    mocks.findByIdAndUpdate.mockResolvedValue(updatedCar);

    const response = await PUT(createRequest(validUpdate));

    expect(response.status).toBe(200);
    expect(mocks.findByIdAndUpdate).toHaveBeenCalledWith(
      carId,
      {
        make: 'MERCEDES',
        carModel: 'E-Class',
        engine: 'PETROL',
        power: '190',
        seats: 5,
        carType: 'SALOON',
        city: 'Belgrade',
        averageConsumption: '7.2',
        milage: 50000,
        carLocation: 'City center',
        pricePerDay: 65,
        description: 'Comfortable and well maintained.',
      },
      { new: true, runValidators: true }
    );
  });

  it('rejects a seat count outside the supported range', async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: 'user-a' } });

    const response = await PUT(createRequest({ ...validUpdate, seats: 10 }));

    expect(response.status).toBe(400);
    expect(mocks.connectToDatabase).not.toHaveBeenCalled();
    expect(mocks.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it.each([
    ['horsepower containing letters', { power: 'fast' }],
    ['decimal horsepower', { power: '150.5' }],
    ['invalid average consumption', { averageConsumption: 'low' }],
    ['average consumption above the limit', { averageConsumption: '101' }],
    ['negative mileage', { milage: -1 }],
    ['invalid model characters', { carModel: '!!!' }],
    ['negative price', { pricePerDay: -1 }],
  ])('rejects %s', async (_caseName, invalidFields) => {
    mocks.getServerSession.mockResolvedValue({ user: { id: 'user-a' } });

    const response = await PUT(
      createRequest({ ...validUpdate, ...invalidFields })
    );

    expect(response.status).toBe(400);
    expect(mocks.connectToDatabase).not.toHaveBeenCalled();
    expect(mocks.findByIdAndUpdate).not.toHaveBeenCalled();
  });
});
