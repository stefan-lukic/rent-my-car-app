import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  CarFront,
  Fuel,
  Gauge,
  MapPin,
  Route,
  ShieldCheck,
  Star,
  Users,
  type LucideIcon,
} from 'lucide-react';
import OwnerProfileHeader from '@/components/OwnerProfileHeader';
import CarDetailsGallery from '@/components/CarDetailsGallery';
import CarBookingPanel from '@/components/CarBookingPanel';
import { getCarDetails } from '@/lib/data/carDetails';
import l from '@/helper/en';

interface CarDetailsPageProps {
  params: { id: string };
  searchParams?: { start?: string; end?: string };
}

interface VehicleSpec {
  icon: LucideIcon;
  label: string;
  value: string;
}

export async function generateMetadata({
  params,
}: CarDetailsPageProps): Promise<Metadata> {
  const car = await getCarDetails(params.id);
  if (!car) return { title: l.carDetailsPage.metadataNotFound };

  const carName = `${car.make} ${car.carModel}`;
  return {
    title: l.carDetailsPage.metadataTitle(carName, car.city),
    description: l.carDetailsPage.metadataDescription(
      carName,
      car.city,
      car.pricePerDay
    ),
  };
}

export default async function CarDetailsPage({
  params,
  searchParams,
}: CarDetailsPageProps) {
  const car = await getCarDetails(params.id);
  if (!car) notFound();

  const carName = `${car.make} ${car.carModel}`;
  const location = [car.city, car.carLocation].filter(Boolean).join(', ');
  const registrationYear = car.firstRegistration
    ? new Date(car.firstRegistration).getFullYear()
    : null;
  const memberSince = car.owner?.createdAt
    ? new Intl.DateTimeFormat('en', {
        month: 'short',
        year: 'numeric',
      }).format(new Date(car.owner.createdAt))
    : null;
  const specs: VehicleSpec[] = [
    {
      icon: CarFront,
      label: l.carDetailsPage.vehicleType,
      value: car.carType,
    },
    { icon: Fuel, label: l.carSpecs.engine, value: car.engine },
    { icon: Gauge, label: l.carSpecs.power, value: `${car.power} HP` },
    ...(car.seats
      ? [{ icon: Users, label: l.carSpecs.seats, value: String(car.seats) }]
      : []),
    { icon: Route, label: l.carSpecs.mileage, value: `${car.milage} km` },
    {
      icon: Gauge,
      label: l.carSpecs.consumption,
      value: `${car.averageConsumption} l/100km`,
    },
    ...(registrationYear
      ? [
          {
            icon: CalendarDays,
            label: l.carDetailsPage.firstRegistration,
            value: String(registrationYear),
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-slate-950 md:pb-0">
      <OwnerProfileHeader />

      <main>
        <section className="relative overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.3),_transparent_45%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <Link
              href="/#car-search"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <ArrowLeft className="h-4 w-4" />
              {l.carDetailsPage.backToCatalog}
            </Link>

            <div className="mt-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-400/10 px-3 py-1.5 text-xs font-bold text-blue-200">
                  <ShieldCheck className="h-4 w-4" />
                  {l.carDetailsPage.localCarListing}
                </div>
                <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {carName}
                </h1>
                <p className="mt-3 flex items-center gap-2 text-sm text-slate-300 sm:text-base">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  {location}
                </p>
              </div>

              <div className="w-fit rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-sm">
                <p className="text-3xl font-black text-white">
                  €{car.pricePerDay}
                </p>
                <p className="text-xs font-semibold text-slate-300">
                  {l.carDetailsPage.perDay}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-12">
          <div className="min-w-0 space-y-8">
            <CarDetailsGallery images={car.images} carName={carName} />

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                {l.carDetailsPage.vehicleOverview}
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">
                {l.carDetailsPage.everythingForTrip}
              </h2>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      {label}
                    </p>
                    <p className="mt-1 break-words text-sm font-bold text-slate-800">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                {l.carDetailsPage.aboutThisCar}
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">
                {l.carDetailsPage.description}
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                {car.description || l.carDetailsPage.missingDescription}
              </p>
            </section>

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-slate-950 p-5 text-white sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                  {l.carDetailsPage.yourHost}
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  {l.carDetailsPage.meetOwner}
                </h2>
              </div>

              {car.owner ? (
                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src={car.owner.images[0] || '/placeholder-user.svg'}
                      alt={car.owner.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-black text-slate-950">
                      {car.owner.name || l.profile.rentMyCarOwner}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {car.owner.rating > 0
                          ? l.carDetailsPage.rating(car.owner.rating.toFixed(1))
                          : l.carDetailsPage.noRatings}
                      </span>
                      {memberSince ? (
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-4 w-4 text-blue-600" />
                          {l.carDetailsPage.memberSince(memberSince)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <Link
                    href={`/profile/${car.owner._id}`}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {l.carDetailsPage.viewOwnerProfile}
                  </Link>
                </div>
              ) : (
                <p className="p-7 text-sm text-slate-500">
                  {l.carDetailsPage.ownerUnavailable}
                </p>
              )}
            </section>
          </div>

          <CarBookingPanel
            carId={car._id}
            carName={carName}
            pricePerDay={car.pricePerDay}
            bookedPeriods={car.bookedPeriods}
            today={new Date().toISOString()}
            initialStartDate={searchParams?.start}
            initialEndDate={searchParams?.end}
          />
        </div>
      </main>
    </div>
  );
}
