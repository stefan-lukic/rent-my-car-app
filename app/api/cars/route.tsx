import { NextRequest, NextResponse } from 'next/server';
import Car from '@/lib/model/car/Car';
import Rental from '@/lib/model/Rental';
import connectToDatabase from '@/lib/db/mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const make = searchParams.get('make');
  const carType = searchParams.get('carType');
  const engine = searchParams.get('engine');
  const minSeats = searchParams.get('minSeats');
  const city = searchParams.get('city');

  if (!start || !end) {
    return NextResponse.json(
      { error: 'Missing required parameters (start and end dates)' },
      { status: 400 }
    );
  }

  const startUtc = getUtcDate(start);
  const endUtc = getUtcDate(end);
  if (!startUtc || !endUtc || endUtc < startUtc) {
    return NextResponse.json({ error: 'Invalid dates' }, { status: 400 });
  }

  const parsedMinSeats = minSeats ? Number(minSeats) : null;
  if (
    parsedMinSeats !== null &&
    (!Number.isInteger(parsedMinSeats) ||
      parsedMinSeats < 1 ||
      parsedMinSeats > 9)
  ) {
    return NextResponse.json(
      { error: 'Minimum seats must be a whole number between 1 and 9' },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);
  await connectToDatabase();

  try {
    const filter: any = {};
    if (minPrice && !isNaN(parseInt(minPrice)))
      filter.pricePerDay = { $gte: parseInt(minPrice) };
    if (maxPrice && !isNaN(parseInt(maxPrice))) {
      filter.pricePerDay = { ...filter.pricePerDay, $lte: parseInt(maxPrice) };
    }
    if (make && make !== '') filter.make = make;
    if (carType && carType !== '') filter.carType = carType;
    if (engine && engine !== '') filter.engine = engine;
    if (parsedMinSeats !== null) {
      filter.seats = { $gte: parsedMinSeats };
    }
    if (city && city !== '') filter.city = city;
    if (session?.user?.id) {
      filter.renter = { $ne: session.user.id };
    }

    const cars = await Car.find(filter).select('+bookedPeriods');

    const overlappingRentals = await Rental.find({
      car: { $in: cars.map((car) => car._id) },
      status: { $ne: 'cancelled' },
      $or: [
        {
          'rentalPeriod.startDate': {
            $lte: endUtc,
            $gte: startUtc,
          },
        },
        {
          'rentalPeriod.endDate': {
            $lte: endUtc,
            $gte: startUtc,
          },
        },
        {
          $and: [
            { 'rentalPeriod.startDate': { $lte: startUtc } },
            { 'rentalPeriod.endDate': { $gte: endUtc } },
          ],
        },
      ],
    });

    const unavailableCarIds = new Set(
      overlappingRentals.map((rental) => rental.car.toString())
    );

    const availableCars = cars.filter((car) => {
      if (unavailableCarIds.has(car._id.toString())) return false;

      const periods = car.bookedPeriods || [];
      return !periods.some(
        (period) => period.startDate <= endUtc && period.endDate >= startUtc
      );
    });

    const totalCars = availableCars.length;
    const totalPages = Math.ceil(totalCars / limit);
    const paginatedCars = availableCars
      .slice((page - 1) * limit, page * limit)
      .map((car) => {
        const carData = car.toObject() as any;
        delete carData.bookedPeriods;

        return carData;
      });

    return NextResponse.json({
      cars: paginatedCars,
      currentPage: page,
      totalPages: totalPages,
      totalCars: totalCars,
      appliedFilters: filter,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while searching for cars' },
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
