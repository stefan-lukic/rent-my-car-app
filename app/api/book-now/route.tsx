import { NextRequest, NextResponse } from 'next/server';
import Rental from '@/lib/model/Rental';
import Car from '@/lib/model/car/Car';
import User from '@/lib/model/User';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/db/mongoose';
import { authOptions } from '@/lib/authOptions';
import {
  sendBookingConfirmationToCustomer,
  sendBookingNotificationToOwner,
} from '@/lib/emailService/sendEmail';

const CAR_UNAVAILABLE = 'CAR_UNAVAILABLE';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();

  try {
    const bookingPayload = await req.json();
    const { carId, startDate, endDate } = bookingPayload;

    if (!carId || !startDate || !endDate) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return NextResponse.json({ message: 'Invalid car ID' }, { status: 400 });
    }

    const rentalStartDate = getUtcDate(startDate);
    const rentalEndDate = getUtcDate(endDate);

    if (!rentalStartDate || !rentalEndDate || rentalEndDate < rentalStartDate) {
      return NextResponse.json(
        { message: 'Invalid rental dates' },
        { status: 400 }
      );
    }

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

    if (car.renter.toString() === userId) {
      return NextResponse.json(
        { message: 'You cannot book your own car' },
        { status: 403 }
      );
    }

    const rentalId = new mongoose.Types.ObjectId();
    const dbSession = await mongoose.startSession();
    let rental: InstanceType<typeof Rental> | null = null;

    try {
      await dbSession.withTransaction(async () => {
        const reservedCar = await Car.findOneAndUpdate(
          {
            _id: car._id,
            bookedPeriods: {
              $not: {
                $elemMatch: {
                  startDate: { $lte: rentalEndDate },
                  endDate: { $gte: rentalStartDate },
                },
              },
            },
          },
          {
            $push: {
              bookedPeriods: {
                rental: rentalId,
                startDate: rentalStartDate,
                endDate: rentalEndDate,
              },
            },
          },
          { new: true, session: dbSession }
        );

        if (!reservedCar) {
          throw new Error(CAR_UNAVAILABLE);
        }

        const createdRentals = await Rental.create(
          [
            {
              _id: rentalId.toString(),
              car: carId,
              renter: car.renter,
              client: userId,
              carLocation: car.carLocation,
              rentalPeriod: {
                startDate: rentalStartDate,
                endDate: rentalEndDate,
              },
              totalCost: calculateTotalCost(
                car.pricePerDay,
                rentalStartDate,
                rentalEndDate
              ),
            },
          ],
          { session: dbSession }
        );

        rental = createdRentals[0];
      });
    } catch (error) {
      if (error instanceof Error && error.message === CAR_UNAVAILABLE) {
        return NextResponse.json(
          { message: 'Car is not available for the selected dates' },
          { status: 409 }
        );
      }
      throw error;
    } finally {
      await dbSession.endSession();
    }

    const owner = await User.findById(car.renter)
      .select('name email')
      .lean()
      .exec();

    const emailTasks: { label: string; promise: Promise<void> }[] = [];

    if (session.user.email) {
      emailTasks.push({
        label: 'customer confirmation',
        promise: sendBookingConfirmationToCustomer({
          customerEmail: session.user.email,
          customerName: session.user.name || 'Customer',
          carName: `${car.make} ${car.carModel}`,
          startDate: rentalStartDate,
          endDate: rentalEndDate,
          pickupLocation: car.carLocation,
        }),
      });
    } else {
      console.error(
        'Customer email missing from session, skipping confirmation email'
      );
    }

    if (owner && owner.email) {
      emailTasks.push({
        label: 'owner notification',
        promise: sendBookingNotificationToOwner({
          email: owner.email,
          ownerName: owner.name || 'Owner',
          carName: `${car.make} ${car.carModel}`,
          customerName: session.user.name || 'Customer',
          customerEmail: session.user.email || 'N/A',
          startDate: rentalStartDate,
          endDate: rentalEndDate,
        }),
      });
    } else {
      console.error('Owner email missing, skipping notification email');
    }

    if (emailTasks.length > 0) {
      const emailResults = await Promise.allSettled(
        emailTasks.map((task) => task.promise)
      );
      emailResults.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(
            `Failed to send ${emailTasks[index].label}:`,
            result.reason
          );
        }
      });
    }

    return NextResponse.json(
      { message: 'Booking successful', rental },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { message: 'Error creating booking' },
      { status: 500 }
    );
  }
}

function getUtcDate(value: unknown): Date | null {
  if (typeof value !== 'string') return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
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
