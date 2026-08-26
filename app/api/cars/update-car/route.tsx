import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';

import Car from '@/lib/model/car/Car';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/db/mongoose';
import { authOptions } from '@/lib/authOptions';
import { CarCity } from '@/lib/model/car/CarCity';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarType } from '@/lib/model/car/CarType';
import {
  CAR_FIELD_LIMITS,
  CAR_MODEL_PATTERN,
  isNumberInRange,
} from '@/lib/model/car/carValidation';

const updateCarSchema = z
  .object({
    _id: z.string().refine(mongoose.Types.ObjectId.isValid, {
      message: 'Invalid car ID',
    }),
    make: z.nativeEnum(CarMake),
    carModel: z
      .string()
      .trim()
      .min(1)
      .max(CAR_FIELD_LIMITS.modelLength)
      .regex(CAR_MODEL_PATTERN),
    engine: z.nativeEnum(CarEngineType),
    power: z
      .string()
      .trim()
      .refine((value) =>
        isNumberInRange(
          value,
          CAR_FIELD_LIMITS.horsepower.min,
          CAR_FIELD_LIMITS.horsepower.max,
          true
        )
      ),
    seats: z.coerce
      .number()
      .int()
      .min(CAR_FIELD_LIMITS.seats.min)
      .max(CAR_FIELD_LIMITS.seats.max),
    carType: z.nativeEnum(CarType),
    city: z.nativeEnum(CarCity),
    averageConsumption: z
      .string()
      .trim()
      .refine((value) =>
        isNumberInRange(
          value,
          CAR_FIELD_LIMITS.averageConsumption.min,
          CAR_FIELD_LIMITS.averageConsumption.max
        )
      ),
    milage: z.coerce
      .number()
      .int()
      .min(CAR_FIELD_LIMITS.mileage.min)
      .max(CAR_FIELD_LIMITS.mileage.max),
    carLocation: z.string().trim().min(1).max(CAR_FIELD_LIMITS.locationLength),
    pricePerDay: z.coerce
      .number()
      .min(CAR_FIELD_LIMITS.pricePerDay.min)
      .max(CAR_FIELD_LIMITS.pricePerDay.max),
    description: z
      .string()
      .trim()
      .max(CAR_FIELD_LIMITS.descriptionLength)
      .optional(),
  })
  .strict();

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  const parsedBody = updateCarSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ message: 'Invalid car data' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const { _id, ...allowedUpdates } = parsedBody.data;
    const existingCar = await Car.findById(_id);
    if (!existingCar) {
      return NextResponse.json({ message: 'Car not found' }, { status: 404 });
    }
    if (existingCar.renter.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const updatedCar = await Car.findByIdAndUpdate(_id, allowedUpdates, {
      new: true,
      runValidators: true,
    });

    if (!updatedCar) {
      return NextResponse.json({ message: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Car updated successfully', car: updatedCar },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating car', error: (error as Error).message },
      { status: 500 }
    );
  }
}
