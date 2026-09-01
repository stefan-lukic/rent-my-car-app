import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';
import l from '@/helper/en';
import type { ICar } from '@/lib/model/car/Car';

export type PublicOwnerCar = Pick<
  ICar,
  | '_id'
  | 'make'
  | 'carModel'
  | 'city'
  | 'engine'
  | 'power'
  | 'seats'
  | 'carType'
  | 'firstRegistration'
  | 'milage'
  | 'averageConsumption'
  | 'images'
  | 'pricePerDay'
  | 'rating'
  | 'ratingCount'
>;

export default function PublicOwnerCarCard({ car }: { car: PublicOwnerCar }) {
  const carName = `${car.make} ${car.carModel}`;
  const formatSpecValue = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  const registrationYear = car.firstRegistration
    ? new Date(car.firstRegistration).getUTCFullYear()
    : null;
  const specifications = [
    formatSpecValue(car.carType),
    formatSpecValue(car.engine),
    `${car.power} HP`,
    `${car.averageConsumption} l/100km`,
    ...(car.seats ? [`${car.seats} ${l.carSpecs.seats.toLowerCase()}`] : []),
    ...(registrationYear ? [String(registrationYear)] : []),
    `${new Intl.NumberFormat('en-US').format(car.milage)} km`,
  ];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-48 w-full shrink-0 bg-slate-100">
        <Image
          src={car.images?.[0] || '/placeholder-car.svg'}
          alt={carName}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-black text-slate-950">
              {carName}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4 shrink-0 text-blue-500" />
              {car.city}
            </p>
          </div>

          <p className="shrink-0 text-right text-lg font-black text-blue-600">
            €{car.pricePerDay}
            <span className="block text-[11px] font-semibold text-slate-400">
              {l.common.perDay}
            </span>
          </p>
        </div>

        {car.ratingCount ? (
          <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-slate-600">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {car.rating?.toFixed(1)} ({car.ratingCount})
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {specifications.map((specification) => (
            <span
              key={specification}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {specification}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <Link
            href={`/cars/${car._id.toString()}`}
            className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            {l.common.details}
          </Link>
        </div>
      </div>
    </article>
  );
}
