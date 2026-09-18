import { cache } from 'react';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db/mongoose';
import Car from '@/lib/model/car/Car';
import type { CarDetailsData } from '@/types/CarDetails';

// Keep the public details query allowlisted so private car fields cannot leak by default.
const PUBLIC_CAR_DETAILS_FIELDS =
  '_id make carModel engine power seats carType city firstRegistration milage averageConsumption images pricePerDay description rating ratingCount renter +bookedPeriods';

export const getCarDetails = cache(
  async (carId: string): Promise<CarDetailsData | null> => {
    if (!mongoose.Types.ObjectId.isValid(carId)) return null;

    await connectToDatabase();

    const car = await Car.findById(carId)
      .select(PUBLIC_CAR_DETAILS_FIELDS)
      .populate('renter', '_id name rating images createdAt')
      .lean()
      .exec();

    if (!car) return null;

    const populatedOwner = car.renter as unknown as {
      _id: mongoose.Types.ObjectId;
      name?: string;
      rating?: number;
      images?: string[];
      createdAt?: Date;
    };
    const ownerId = populatedOwner?._id?.toString();

    return {
      _id: car._id.toString(),
      make: car.make,
      carModel: car.carModel,
      engine: car.engine,
      power: car.power,
      seats: car.seats,
      carType: car.carType,
      city: car.city,
      firstRegistration: car.firstRegistration?.toISOString(),
      milage: car.milage,
      averageConsumption: car.averageConsumption,
      images: car.images ?? [],
      pricePerDay: car.pricePerDay,
      description: car.description,
      rating: car.rating,
      ratingCount: car.ratingCount,
      renter: ownerId ?? String(car.renter),
      owner: ownerId
        ? {
            _id: ownerId,
            name: populatedOwner.name || '',
            rating: Number(populatedOwner.rating) || 0,
            images: populatedOwner.images ?? [],
            createdAt: populatedOwner.createdAt?.toISOString(),
          }
        : null,
      bookedPeriods: (car.bookedPeriods ?? []).map((period) => ({
        startDate: period.startDate.toISOString(),
        endDate: period.endDate.toISOString(),
      })),
    };
  }
);
