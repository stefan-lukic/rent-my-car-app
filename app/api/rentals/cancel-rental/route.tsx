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
    if (rental.client.toString() !== userId) {
      return NextResponse.json(
        { message: 'Not authorized to cancel this reservation' },
        { status: 403 }
      );
    }

    const updatedRental = await Rental.findByIdAndUpdate(
      rental._id,
      {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledBy: new mongoose.Types.ObjectId(userId),
      },
      { new: true }
    );

    const pullResult = await Car.updateOne(
      { _id: rental.car },
      { $pull: { bookedPeriods: { rental: rental._id } } }
    );

    if (pullResult.modifiedCount === 0) {
      await Rental.findByIdAndUpdate(rental._id, {
        $set: { status: 'active' },
        $unset: { cancelledAt: '', cancelledBy: '' },
      });
      return NextResponse.json(
        { message: 'Failed to update car availability' },
        { status: 500 }
      );
    }

    const [client, owner] = await Promise.all([
      User.findById(rental.client).select('name email').lean().exec(),
      User.findById(rental.renter).select('name email').lean().exec(),
    ]);

    const car = await Car.findById(rental.car).lean().exec();

    const cancelledByName =
      (client?._id?.toString() === userId ? client?.name : owner?.name) ||
      'Someone';

    const emailTasks: { label: string; promise: Promise<void> }[] = [];

    if (client?.email) {
      emailTasks.push({
        label: 'customer cancellation',
        promise: sendCancellationNotificationToCustomer({
          customerEmail: client.email,
          customerName: client.name || 'Customer',
          carName: car ? `${car.make} ${car.carModel}` : 'your booking',
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
          carName: car ? `${car.make} ${car.carModel}` : 'your car',
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

    return NextResponse.json(
      { message: 'Rental cancelled successfully', rental: updatedRental },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error cancelling rental:', error);
    return NextResponse.json(
      { message: 'Error cancelling rental' },
      { status: 500 }
    );
  }
}
