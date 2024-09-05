import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Car from '@/lib/model/Car';
import { CarType } from '@/lib/model/CarType';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const carData = await request.json();

    // Validate required fields
    if (
      !carData.make ||
      !carData.carModel ||
      !carData.engine ||
      !carData.power ||
      !carData.carType ||
      !carData.city
    ) {
      return NextResponse.json(
        {
          message:
            'Make, model, engine, power, car type, and city are required',
        },
        { status: 400 }
      );
    }

    // Validate car type
    if (!Object.values(CarType).includes(carData.carType)) {
      return NextResponse.json(
        { message: 'Invalid car type' },
        { status: 400 }
      );
    }

    // Create a new car instance
    const newCar = new Car(carData);

    // Save the car to the database
    await newCar.save();

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
