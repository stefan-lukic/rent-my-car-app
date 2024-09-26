import { NextRequest, NextResponse } from 'next/server';
import Car from '@/lib/model/car/Car';
import Rental from '@/lib/model/Rental';
import connectToDatabase from '@/lib/db/mongoose';

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
  const city = searchParams.get('city');

  if (!start || !end) {
    return NextResponse.json(
      { error: 'Missing required parameters (start and end dates)' },
      { status: 400 }
    );
  }

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
    if (city && city !== '') filter.city = city;

    const cars = await Car.find(filter);

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
      appliedFilters: filter,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while searching for cars' },
      { status: 500 }
    );
  }
}
