import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

import Car from '@/lib/model/car/Car';
import Rental from '@/lib/model/Rental';
import User from '@/lib/model/User';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/db/mongoose';
import { authOptions } from '@/lib/authOptions';

const CAR_DELETE_CONFLICT = 'CAR_DELETE_CONFLICT';

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  let body: { _id?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  const { _id } = body;
  if (typeof _id !== 'string' || !mongoose.Types.ObjectId.isValid(_id)) {
    return NextResponse.json({ message: 'Invalid car ID' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const car = await Car.findById(_id);
    if (!car) {
      return NextResponse.json({ message: 'Car not found' }, { status: 404 });
    }
    if (car.renter.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const startOfTodayUtc = new Date();
    startOfTodayUtc.setUTCHours(0, 0, 0, 0);

    const hasProtectedRental = await Rental.exists({
      car: car._id,
      status: 'active',
      'rentalPeriod.endDate': { $gte: startOfTodayUtc },
    });

    if (hasProtectedRental) {
      return NextResponse.json(
        {
          message:
            'Cars with active or upcoming reservations cannot be deleted.',
        },
        { status: 409 }
      );
    }

    const dbSession = await mongoose.startSession();

    try {
      await dbSession.withTransaction(async () => {
        // Preserve history, delete the car, and remove its owner reference atomically.
        await Rental.updateMany(
          {
            car: car._id,
            $or: [{ carSnapshot: { $exists: false } }, { carSnapshot: null }],
          },
          {
            $set: {
              carSnapshot: {
                carId: car._id,
                make: car.make,
                carModel: car.carModel,
                images: car.images ?? [],
                city: car.city,
                carLocation: car.carLocation,
                pricePerDay: car.pricePerDay,
              },
            },
          },
          { session: dbSession }
        );

        const deletedCar = await Car.findOneAndDelete(
          {
            _id: car._id,
            bookedPeriods: {
              $not: { $elemMatch: { endDate: { $gte: startOfTodayUtc } } },
            },
          },
          { session: dbSession }
        );

        if (!deletedCar) {
          throw new Error(CAR_DELETE_CONFLICT);
        }

        const updatedUser = await User.findByIdAndUpdate(
          car.renter,
          { $pull: { cars: _id } },
          { session: dbSession }
        );

        if (!updatedUser) {
          throw new Error('CAR_OWNER_UPDATE_FAILED');
        }
      });
    } finally {
      await dbSession.endSession();
    }

    return NextResponse.json(
      { message: 'Car deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === CAR_DELETE_CONFLICT) {
      return NextResponse.json(
        {
          message:
            'Cars with active or upcoming reservations cannot be deleted.',
        },
        { status: 409 }
      );
    }

    const errorId = randomUUID();
    // Keep internal failure details in server logs under a safe reference ID.
    console.error(`[${errorId}] Error deleting car:`, error);

    return NextResponse.json(
      { message: 'Error deleting car', errorId },
      { status: 500 }
    );
  }
}
