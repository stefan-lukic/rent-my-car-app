import { NextRequest, NextResponse } from 'next/server';
import Car from '@/lib/model/car/Car';
import Rental from '@/lib/model/Rental';
import connectToDatabase from '@/lib/db/mongoose';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!city || !start || !end) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  await connectToDatabase();

  try {
    const cars = await Car.find({ city: city });

    // Find rentals that overlap with the specified date range
    const overlappingRentals = await Rental.find({
      car: { $in: cars.map((car) => car._id) },
      $or: [
        {
          'rentalPeriod.startDate': {
            $lte: new Date(end),
            $gte: new Date(start),
          },
        },
        {
          'rentalPeriod.endDate': {
            $lte: new Date(end),
            $gte: new Date(start),
          },
        },
        {
          $and: [
            { 'rentalPeriod.startDate': { $lte: new Date(start) } },
            { 'rentalPeriod.endDate': { $gte: new Date(end) } },
          ],
        },
      ],
    });

    // Filter out cars that have overlapping rentals
    const availableCars = cars.filter(
      (car) =>
        !overlappingRentals.some(
          (rental) => rental.car.toString() === car._id.toString()
        )
    );

    const totalCars = availableCars.length;
    const totalPages = Math.ceil(totalCars / limit);
    const paginatedCars = availableCars.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      cars: paginatedCars,
      currentPage: page,
      totalPages: totalPages,
      totalCars: totalCars,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'An error occurred while searching for cars' },
      { status: 500 }
    );
  }
}
