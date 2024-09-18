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
    const image = formData.get('image') as File | null;

    let imageBase64 = '';
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Import sharp dynamically only on the server
      const sharp = (await import('sharp')).default;

      // Resize and compress the image
      const resizedBuffer = await sharp(buffer)
        .resize({ width: 800, height: 600, fit: 'inside' })
        .jpeg({ quality: 80 })
        .toBuffer();

      imageBase64 = `data:image/jpeg;base64,${resizedBuffer.toString('base64')}`;
    }

    const carData = Object.fromEntries(formData);

    if (
      !carData.make ||
      !carData.carModel ||
      !carData.engine ||
      !carData.power ||
      !carData.carType ||
      !carData.city ||
      !carData.owner
    ) {
      return NextResponse.json(
        {
          message:
            'Make, model, engine, power, car type, city, and owner are required',
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
      image: imageBase64,
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
    console.error('Error adding new car:', error);
    return NextResponse.json(
      { message: 'Error adding new car' },
      { status: 500 }
    );
  }
}
