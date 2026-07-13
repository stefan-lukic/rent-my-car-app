import mongoose from 'mongoose';
import Rental from '@/lib/model/Rental';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const rentals = await Rental.find({
      client: new mongoose.Types.ObjectId(userId),
    }).populate('car');
    return NextResponse.json(rentals);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
