import { NextRequest, NextResponse } from 'next/server';

import { Types } from 'mongoose';
import connectToDatabase from '@/lib/db/mongoose';
import Car from '@/lib/model/car/Car';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const carId = params?.id;

  if (!carId) {
    return NextResponse.json({ error: 'Car ID is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(carId)) {
      return NextResponse.json(
        { error: 'Invalid car ID format' },
        { status: 400 }
      );
    }

    const car = await Car.findById(new Types.ObjectId(carId));

    if (!car) {
      return NextResponse.json(
        { error: `Car with ID ${carId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(car);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
