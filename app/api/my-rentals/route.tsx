import mongoose from 'mongoose';
import Rental from '@/lib/model/Rental';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const role = searchParams.get('role') || 'client';

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  if (role !== 'client' && role !== 'owner') {
    return NextResponse.json({ error: 'Invalid role param' }, { status: 400 });
  }

  try {
    const filter = { [role]: new mongoose.Types.ObjectId(userId) };
    const rentals = await Rental.find(filter).populate('car');
    return NextResponse.json(rentals);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
