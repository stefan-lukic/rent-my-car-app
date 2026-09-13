import { NextRequest, NextResponse } from 'next/server';
import Car, { type ICar } from '@/lib/model/car/Car';
import Rental from '@/lib/model/Rental';
import connectToDatabase from '@/lib/db/mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import type { FilterQuery } from 'mongoose';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const CAR_SEARCH_FIELDS =
  '_id make carModel engine power seats carType city firstRegistration milage averageConsumption images pricePerDay description renter rating ratingCount';

type CarSearchResult = {
  _id: string;
  make: ICar['make'];
  carModel: string;
  engine: ICar['engine'];
  power: string;
  seats?: number;
  carType: ICar['carType'];
  city: ICar['city'];
  firstRegistration?: string;
  milage: number;
  averageConsumption: string;
  images: string[];
  pricePerDay: number;
  description?: string;
  renter: string;
  rating: number;
  ratingCount: number;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const page = Number(searchParams.get('page') ?? DEFAULT_PAGE);
  const limit = Number(searchParams.get('limit') ?? DEFAULT_LIMIT);

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

  // Reject malformed pagination before database work or array slicing.
  if (!Number.isSafeInteger(page) || page < 1) {
    return NextResponse.json(
      { error: 'Page must be a positive whole number' },
      { status: 400 }
    );
  }

  if (!Number.isSafeInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    return NextResponse.json(
      { error: `Limit must be a whole number between 1 and ${MAX_LIMIT}` },
      { status: 400 }
    );
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
    const filter: FilterQuery<ICar> = {};
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

    const cars = await Car.find(filter)
      .select(`${CAR_SEARCH_FIELDS} +bookedPeriods`)
      .slice('images', 1);

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
      .map<CarSearchResult>((car) => ({
        // Expose only fields used by the public search experience.
        _id: car._id.toString(),
        make: car.make,
        carModel: car.carModel,
        engine: car.engine,
        power: car.power,
        seats: car.seats,
        carType: car.carType,
        city: car.city,
        firstRegistration: car.firstRegistration?.toISOString(),
        milage: car.milage,
        averageConsumption: car.averageConsumption,
        images: car.images?.slice(0, 1) ?? [],
        pricePerDay: car.pricePerDay,
        description: car.description,
        renter: car.renter.toString(),
        rating: car.rating ?? 0,
        ratingCount: car.ratingCount ?? 0,
      }));

    return NextResponse.json({
      cars: paginatedCars,
      currentPage: page,
      totalPages: totalPages,
      totalCars: totalCars,
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
