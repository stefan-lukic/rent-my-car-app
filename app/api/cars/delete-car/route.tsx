import { NextRequest, NextResponse } from 'next/server';
import Car from '@/lib/model/car/Car';
import User from '@/lib/model/User';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/db/mongoose';
import { authOptions } from '@/lib/authOptions';

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();

  const { _id } = await req.json();

  if (!_id) {
    return NextResponse.json({ message: 'Missing car ID' }, { status: 400 });
  }

  const car = await Car.findById(_id);
  if (!car) {
    return NextResponse.json({ message: 'Car not found' }, { status: 404 });
  }
  if (car.renter.toString() !== session.user.id) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
  }

  try {
    await Car.findByIdAndDelete(_id);
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
