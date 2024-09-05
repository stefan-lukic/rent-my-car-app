import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Car from '@/lib/model/Car';

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get('city');
  const start = request.nextUrl.searchParams.get('start');
  const end = request.nextUrl.searchParams.get('end');

  try {
    await connectToDatabase();

    let query: any = {};

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (start && end) {
      query.availableDates = {
        $elemMatch: {
          $gte: new Date(start),
          $lte: new Date(end),
        },
      };
    }

    const cars = await Car.find(query);

    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error searching for cars:', error);
    return NextResponse.json(
      { message: 'Error searching for cars' },
      { status: 500 }
    );
  }
}
