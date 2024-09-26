import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Car from '@/lib/model/car/Car';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const cars = await Car.find({
      owner: new mongoose.Types.ObjectId(userId),
    });
    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
