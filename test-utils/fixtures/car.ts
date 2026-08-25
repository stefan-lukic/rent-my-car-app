import mongoose from 'mongoose';
import { ICar } from '@/lib/model/car/Car';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { CarType } from '@/lib/model/car/CarType';
import { CarCity } from '@/lib/model/car/CarCity';

export interface MockCarOverrides extends Partial<ICar> {
  _id?: string;
}

export const createMockCar = (overrides?: MockCarOverrides): ICar =>
  ({
    _id: '1',
    make: CarMake.MERCEDES,
    carModel: 'C-Class',
    pricePerDay: 50,
    carType: CarType.SEDAN,
    city: CarCity.BELGRADE,
    carLocation: 'Center',
    images: ['/car1.jpg', '/car2.jpg'],
    engine: CarEngineType.PETROL,
    power: '150',
    averageConsumption: '6.5',
    milage: 50000,
    firstRegistration: new Date('2020-01-01'),
    description: 'Nice car',
    renter: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
    status: 'available',
    bookedPeriods: [],
    ...overrides,
  }) satisfies ICar;
