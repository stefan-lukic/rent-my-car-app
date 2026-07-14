import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Car from '@/lib/model/car/Car';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import connectToDatabase from '@/lib/db/mongoose';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const cars = await Car.find({
      renter: new mongoose.Types.ObjectId(session.user.id),
    });

    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}