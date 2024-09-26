import { NextRequest, NextResponse } from 'next/server';
import Car from '@/lib/model/car/Car';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/db/mongoose';
import { authOptions } from '@/lib/authOptions';

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();

  const body = await req.json();
  const { _id, ...updateData } = body;

  if (!_id) {
    return NextResponse.json({ message: 'Missing car ID' }, { status: 400 });
  }

  try {
    const updatedCar = await Car.findByIdAndUpdate(_id, updateData, {
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
