import type { ICar } from '@/lib/model/car/Car';
import type { RentalWithCar } from '@/types/RentalWithCar';
import { createMockCar } from './car';

export interface MockRental extends RentalWithCar {}

export interface MockRentalOverrides extends Partial<RentalWithCar> {
  car?: ICar;
}

export const createMockRental = (
  overrides?: MockRentalOverrides
): RentalWithCar =>
  ({
    _id: 'rental-1',
    car: createMockCar(),
    rentalPeriod: {
      startDate: new Date('2024-08-01T00:00:00.000Z'),
      endDate: new Date('2024-08-05T00:00:00.000Z'),
    },
    totalCost: 200,
    ...overrides,
  }) satisfies RentalWithCar;
