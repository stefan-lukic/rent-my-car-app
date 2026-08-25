import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import connectToDatabase from '@/lib/db/mongoose';
import Rental from '@/lib/model/Rental';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const bookings = await Rental.find({ renter: session.user.id })
      .sort({ 'rentalPeriod.startDate': 1 })
      .populate('car', 'make carModel images city carLocation')
      .populate('client', 'name email contactInfo images')
      .lean();

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Failed to fetch owner bookings:', error);
    return NextResponse.json(
      { message: 'Unable to load incoming bookings' },
      { status: 500 }
    );
  }
}
