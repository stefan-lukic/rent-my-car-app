import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Car from '@/lib/model/car/Car';
import { CarType } from '@/lib/model/car/CarType';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { CarCity } from '@/lib/model/car/CarCity';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import User from '@/lib/model/User';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const formData = await request.formData();
    const images: File[] = Array.from(formData.getAll('images')) as File[];

    const imageBase64Array: string[] = [];
    for (const image of images) {
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Import sharp dynamically only on the server
        const sharp = (await import('sharp')).default;

        // Resize and compress the image more aggressively
        const resizedBuffer = await sharp(buffer)
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
        console.error('Error processing image:', imageError);
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
      !carData.carType ||
      !carData.city ||
      !carData.owner ||
      !carData.carLocation ||
      !carData.pricePerDay ||
      !carData.milage ||
      !carData.averageConsumption ||
      !carData.description
    ) {
      return NextResponse.json(
        {
          message:
            'Make, model, engine, power, car type, city, owner, car location, price per day, milage, average consumption, and description are required',
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

    const newCar = new Car({
      ...carData,
      images: imageBase64Array,
      owner: carData.owner,
    });

    await newCar.save();

    await User.findByIdAndUpdate(session.user.id, {
      $push: { cars: newCar._id },
    });

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
