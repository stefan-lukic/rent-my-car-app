import { NextRequest, NextResponse } from 'next/server';
import Rental from '@/lib/model/Rental';
import Car from '@/lib/model/car/Car';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/db/mongoose';
import { authOptions } from '@/lib/authOptions';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();

  const body = await req.json();
  const { carId, carLocation, startDate, endDate } = body;

  if (!carId || !startDate || !endDate || !carLocation) {
    return NextResponse.json(
      { message: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const car = await Car.findById(carId);
    if (!car) {
      return NextResponse.json({ message: 'Car not found' }, { status: 404 });
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID not found in session' },
        { status: 400 }
      );
    }

    const rental = new Rental({
      car: carId,
      client: userId,
      carLocation: carLocation,
      rentalPeriod: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
      totalCost: calculateTotalCost(
        car.pricePerDay,
        new Date(startDate),
        new Date(endDate)
      ),
    });

    await rental.save();

    // TODO implement sendrig or some other mailing service in sendEmail.tsx
    // await sendBookingEmail(
    //   session.user.email || '',
    //   car,
    //   new Date(startDate),
    //   new Date(endDate)
    // );

    return NextResponse.json(
      { message: 'Booking successful', rental },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating booking', error: (error as Error).message },
      { status: 500 }
    );
  }
}

function calculateTotalCost(
  pricePerDay: number,
  startDate: Date,
  endDate: Date
): number {
  const utcStartDate = new Date(
    Date.UTC(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth(),
      startDate.getUTCDate()
    )
  );
  const utcEndDate = new Date(
    Date.UTC(
      endDate.getUTCFullYear(),
      endDate.getUTCMonth(),
      endDate.getUTCDate()
    )
  );

  const days =
    Math.ceil(
      (utcEndDate.getTime() - utcStartDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
  return pricePerDay * days;
}
