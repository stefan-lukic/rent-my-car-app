import { NextRequest, NextResponse } from 'next/server';
import Rental from '@/lib/model/Rental';
import Car from '@/lib/model/car/Car';
import User from '@/lib/model/User';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/db/mongoose';
import { authOptions } from '@/lib/authOptions';
import {
  sendCancellationNotificationToCustomer,
  sendCancellationNotificationToOwner,
} from '@/lib/emailService/sendEmail';
import { canCancelRental } from '@/lib/rentalLifecycle';

const RENTAL_CANCELLATION_CONFLICT = 'RENTAL_CANCELLATION_CONFLICT';
const CAR_AVAILABILITY_UPDATE_FAILED = 'CAR_AVAILABILITY_UPDATE_FAILED';

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();

  try {
    const body = await req.json();
    const { rentalId } = body;

    if (!rentalId || !mongoose.Types.ObjectId.isValid(rentalId)) {
      return NextResponse.json(
        { message: 'Invalid rental ID' },
        { status: 400 }
      );
    }

    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return NextResponse.json(
        { message: 'Rental not found' },
        { status: 404 }
      );
    }

    if (rental.status === 'cancelled') {
      return NextResponse.json(
        { message: 'Rental is already cancelled' },
        { status: 409 }
      );
    }

    const userId = session.user.id;
    // Apply the client notice period without blocking owners before pickup.
    const isClient = rental.client.toString() === userId;
    const isOwner = rental.renter?.toString() === userId;
    if (!isClient && !isOwner) {
      return NextResponse.json(
        { message: 'Not authorized to cancel this reservation' },
        { status: 403 }
      );
    }

    if (!canCancelRental(rental, new Date(), isOwner ? 'owner' : 'client')) {
      return NextResponse.json(
        {
          message: isOwner
            ? 'Reservations cannot be cancelled after the rental starts'
            : 'Reservations can only be cancelled at least 24 hours before the start time',
        },
        { status: 409 }
      );
    }

    const dbSession = await mongoose.startSession();
    let updatedRental = rental;

    try {
      await dbSession.withTransaction(async () => {
        const cancelledRental = await Rental.findOneAndUpdate(
          { _id: rental._id, status: 'active' },
          {
            $set: {
              status: 'cancelled',
              cancelledAt: new Date(),
              cancelledBy: new mongoose.Types.ObjectId(userId),
            },
          },
          { new: true, session: dbSession }
        );

        if (!cancelledRental) {
          throw new Error(RENTAL_CANCELLATION_CONFLICT);
        }

        const pullResult = await Car.updateOne(
          {
            _id: rental.car,
            'bookedPeriods.rental': rental._id,
          },
          { $pull: { bookedPeriods: { rental: rental._id } } },
          { session: dbSession }
        );

        if (pullResult.modifiedCount === 0) {
          throw new Error(CAR_AVAILABILITY_UPDATE_FAILED);
        }

        updatedRental = cancelledRental;
      });
    } finally {
      await dbSession.endSession();
    }

    const [client, owner] = await Promise.all([
      User.findById(rental.client).select('name email').lean().exec(),
      User.findById(rental.renter).select('name email').lean().exec(),
    ]);

    const car = await Car.findById(rental.car).lean().exec();

    const cancelledByName = isOwner
      ? owner?.name
        ? `the car owner (${owner.name})`
        : 'the car owner'
      : client?.name || 'the client';
    const carName = car
      ? `${car.make} ${car.carModel}`
      : rental.carSnapshot
        ? `${rental.carSnapshot.make} ${rental.carSnapshot.carModel}`
        : 'your booking';

    const emailTasks: { label: string; promise: Promise<void> }[] = [];

    if (client?.email) {
      emailTasks.push({
        label: 'customer cancellation',
        promise: sendCancellationNotificationToCustomer({
          customerEmail: client.email,
          customerName: client.name || 'Customer',
          carName,
          startDate: rental.rentalPeriod.startDate,
          endDate: rental.rentalPeriod.endDate,
          cancelledByName,
        }),
      });
    }

    if (owner?.email) {
      emailTasks.push({
        label: 'owner cancellation',
        promise: sendCancellationNotificationToOwner({
          email: owner.email,
          ownerName: owner.name || 'Owner',
          carName,
          customerName: client?.name || 'Customer',
          startDate: rental.rentalPeriod.startDate,
          endDate: rental.rentalPeriod.endDate,
          cancelledByName,
        }),
      });
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

    // Keep the mutation response consistent with the populated rentals list.
    const responseRental = { ...updatedRental.toObject(), car };

    return NextResponse.json(
      { message: 'Rental cancelled successfully', rental: responseRental },
      { status: 200 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === RENTAL_CANCELLATION_CONFLICT
    ) {
      return NextResponse.json(
        { message: 'Rental is already cancelled' },
        { status: 409 }
      );
    }

    if (
      error instanceof Error &&
      error.message === CAR_AVAILABILITY_UPDATE_FAILED
    ) {
      return NextResponse.json(
        { message: 'Failed to update car availability' },
        { status: 500 }
      );
    }

    console.error('Error cancelling rental:', error);
    return NextResponse.json(
      { message: 'Error cancelling rental' },
      { status: 500 }
    );
  }
}
