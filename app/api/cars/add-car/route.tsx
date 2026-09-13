import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db/mongoose';
import Car from '@/lib/model/car/Car';
import { CarType } from '@/lib/model/car/CarType';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { CarCity } from '@/lib/model/car/CarCity';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import User from '@/lib/model/User';
import {
  CAR_FIELD_LIMITS,
  CAR_MODEL_PATTERN,
  isNumberInRange,
} from '@/lib/model/car/carValidation';
import {
  MAX_IMAGE_PIXELS,
  validateImageUploads,
} from '@/lib/imageUploadValidation';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const formData = await request.formData();
    const imageValidation = validateImageUploads(formData.getAll('images'));

    if (imageValidation.error) {
      return NextResponse.json(
        { message: imageValidation.error },
        { status: 400 }
      );
    }

    const images = imageValidation.files;

    const imageBase64Array: string[] = [];
    for (const image of images) {
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Import sharp dynamically only on the server
        const sharp = (await import('sharp')).default;

        // Resize and compress the image more aggressively
        const resizedBuffer = await sharp(buffer, {
          limitInputPixels: MAX_IMAGE_PIXELS,
        })
          .resize({ width: 800, height: 600, fit: 'inside' })
          .jpeg({ quality: 60 }) // Reduced quality for smaller file size
          .toBuffer();

        // Check if the base64 string would be too large (roughly 6MB)
        if (resizedBuffer.length > 6 * 1024 * 1024) {
          return NextResponse.json(
            { message: 'Image too large after compression' },
            { status: 400 }
          );
        }

        imageBase64Array.push(
          `data:image/jpeg;base64,${resizedBuffer.toString('base64')}`
        );
      } catch (imageError) {
        return NextResponse.json(
          { message: 'Error processing image' },
          { status: 400 }
        );
      }
    }

    const carData = Object.fromEntries(formData);

    if (
      !carData.make ||
      !carData.carModel ||
      !carData.engine ||
      !carData.power ||
      !carData.seats ||
      !carData.carType ||
      !carData.city ||
      !carData.carLocation ||
      !carData.pricePerDay ||
      !carData.milage ||
      !carData.averageConsumption ||
      !carData.description
    ) {
      return NextResponse.json(
        {
          message:
            'Make, model, engine, power, seats, car type, city, car location, price per day, milage, average consumption, and description are required',
        },
        { status: 400 }
      );
    }

    if (!Object.values(CarType).includes(carData.carType as CarType)) {
      return NextResponse.json(
        { message: 'Invalid car type' },
        { status: 400 }
      );
    }

    if (!Object.values(CarMake).includes(carData.make as CarMake)) {
      return NextResponse.json(
        { message: 'Invalid car make' },
        { status: 400 }
      );
    }

    if (
      !Object.values(CarEngineType).includes(carData.engine as CarEngineType)
    ) {
      return NextResponse.json(
        { message: 'Invalid engine type' },
        { status: 400 }
      );
    }

    if (!Object.values(CarCity).includes(carData.city as CarCity)) {
      return NextResponse.json({ message: 'Invalid city' }, { status: 400 });
    }

    const carModel = String(carData.carModel).trim();
    if (
      carModel.length > CAR_FIELD_LIMITS.modelLength ||
      !CAR_MODEL_PATTERN.test(carModel)
    ) {
      return NextResponse.json(
        { message: 'Invalid car model' },
        { status: 400 }
      );
    }

    if (
      !isNumberInRange(
        String(carData.power),
        CAR_FIELD_LIMITS.horsepower.min,
        CAR_FIELD_LIMITS.horsepower.max,
        true
      )
    ) {
      return NextResponse.json(
        { message: 'Horsepower must be a whole number between 1 and 2000' },
        { status: 400 }
      );
    }

    const seats = Number(carData.seats);
    if (
      !isNumberInRange(
        String(carData.seats),
        CAR_FIELD_LIMITS.seats.min,
        CAR_FIELD_LIMITS.seats.max,
        true
      )
    ) {
      return NextResponse.json(
        { message: 'Seats must be a whole number between 1 and 9' },
        { status: 400 }
      );
    }

    if (
      !isNumberInRange(
        String(carData.averageConsumption),
        CAR_FIELD_LIMITS.averageConsumption.min,
        CAR_FIELD_LIMITS.averageConsumption.max
      )
    ) {
      return NextResponse.json(
        { message: 'Average consumption must be between 0.1 and 100' },
        { status: 400 }
      );
    }

    if (
      !isNumberInRange(
        String(carData.pricePerDay),
        CAR_FIELD_LIMITS.pricePerDay.min,
        CAR_FIELD_LIMITS.pricePerDay.max
      )
    ) {
      return NextResponse.json(
        { message: 'Price per day must be between 1 and 100000' },
        { status: 400 }
      );
    }

    if (
      !isNumberInRange(
        String(carData.milage),
        CAR_FIELD_LIMITS.mileage.min,
        CAR_FIELD_LIMITS.mileage.max,
        true
      )
    ) {
      return NextResponse.json(
        { message: 'Mileage must be a valid whole number' },
        { status: 400 }
      );
    }

    if (
      String(carData.carLocation).trim().length >
        CAR_FIELD_LIMITS.locationLength ||
      String(carData.description).trim().length >
        CAR_FIELD_LIMITS.descriptionLength
    ) {
      return NextResponse.json(
        { message: 'Car location or description is too long' },
        { status: 400 }
      );
    }

    // Build the document from allowed fields so request data cannot set internal state.
    const newCarData = {
      make: carData.make,
      carModel,
      engine: carData.engine,
      power: String(carData.power).trim(),
      seats,
      carType: carData.carType,
      city: carData.city,
      carLocation: String(carData.carLocation).trim(),
      firstRegistration: carData.firstRegistration,
      milage: Number(carData.milage),
      averageConsumption: String(carData.averageConsumption).trim(),
      images: imageBase64Array,
      pricePerDay: Number(carData.pricePerDay),
      description: String(carData.description).trim(),
      renter: session.user.id,
    };

    const dbSession = await mongoose.startSession();
    let newCar: InstanceType<typeof Car> | null = null;

    try {
      await dbSession.withTransaction(async () => {
        // Save the car and its owner reference as one atomic operation.
        const createdCars = await Car.create([newCarData], {
          session: dbSession,
        });
        newCar = createdCars[0];

        const updatedUser = await User.findByIdAndUpdate(
          session.user.id,
          { $push: { cars: newCar._id } },
          { session: dbSession }
        );

        if (!updatedUser) {
          throw new Error('CAR_OWNER_UPDATE_FAILED');
        }
      });
    } finally {
      await dbSession.endSession();
    }

    if (!newCar) {
      throw new Error('CAR_CREATION_FAILED');
    }

    return NextResponse.json(
      { message: 'Car added successfully', car: newCar },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json(
      { message: 'Error adding new car' },
      { status: 500 }
    );
  }
}
