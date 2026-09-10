import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import connectToDatabase from '@/lib/db/mongoose';
import Rental from '@/lib/model/Rental';
import { protectOwnerBookingContact } from '@/lib/ownerBookingPrivacy';
import type { OwnerBooking } from '@/types/OwnerBooking';

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
      .populate<{
        client: OwnerBooking['client'];
      }>('client', 'name email contactInfo images rating ratingCount')
      .lean();

    const currentDate = new Date();
    const protectedBookings = bookings.map((booking) =>
      protectOwnerBookingContact(booking, currentDate)
    );

    return NextResponse.json(protectedBookings);
  } catch (error) {
    console.error('Failed to fetch owner bookings:', error);
    return NextResponse.json(
      { message: 'Unable to load incoming bookings' },
      { status: 500 }
    );
  }
}
