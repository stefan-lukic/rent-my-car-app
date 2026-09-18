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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-48 w-full shrink-0 bg-surface-muted">
        <Image
          src={car.images?.[0] || '/placeholder-car.svg'}
          alt={carName}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate font-heading text-lg font-semibold text-ink">
              {carName}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-body-subtle">
              <MapPin className="h-4 w-4 shrink-0 text-brand" />
              {car.city}
            </p>
          </div>

          <p className="shrink-0 text-right font-heading text-lg font-bold text-brand">
            €{car.pricePerDay}
            <span className="block text-[11px] font-semibold text-body-faint">
              {l.common.perDay}
            </span>
          </p>
        </div>

        {car.ratingCount ? (
          <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-body-muted">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {car.rating?.toFixed(1)} ({car.ratingCount})
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {specifications.map((specification) => (
            <span
              key={specification}
              className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-body"
            >
              {specification}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <Link
            href={`/cars/${car._id.toString()}`}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            {l.common.details}
          </Link>
        </div>
      </div>
    </article>
  );
}
