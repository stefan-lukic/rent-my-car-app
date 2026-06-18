import { NextRequest, NextResponse } from 'next/server';
import Car from '@/lib/model/car/Car';
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

  try {
    const deletedCar = await Car.findByIdAndDelete(_id);

    if (!deletedCar) {
      return NextResponse.json({ message: 'Car not found' }, { status: 404 });
    }

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
