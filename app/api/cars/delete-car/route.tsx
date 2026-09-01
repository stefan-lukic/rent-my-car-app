import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import Car from '@/lib/model/car/Car';
import Rental from '@/lib/model/Rental';
import User from '@/lib/model/User';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/db/mongoose';
import { authOptions } from '@/lib/authOptions';

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

    // Preserve immutable vehicle details before the listing is physically removed.
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
      }
    );

    const deletedCar = await Car.findOneAndDelete({
      _id: car._id,
      bookedPeriods: {
        $not: { $elemMatch: { endDate: { $gte: startOfTodayUtc } } },
      },
    });

    if (!deletedCar) {
      return NextResponse.json(
        {
          message:
            'Cars with active or upcoming reservations cannot be deleted.',
        },
        { status: 409 }
      );
    }

    await User.findByIdAndUpdate(car.renter, {
      $pull: { cars: _id },
    });

    return NextResponse.json(
      { message: 'Car deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting car', error: (error as Error).message },
      { status: 500 }
    );
  }
}
