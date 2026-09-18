import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  CarFront,
  ExternalLink,
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

interface CarDetailsSearchParams {
  start?: string;
  end?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  make?: string;
  carType?: string;
  engine?: string;
  minSeats?: string;
}

interface CarDetailsPageProps {
  params: { id: string };
  searchParams?: CarDetailsSearchParams;
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
  const catalogQuery = new URLSearchParams();
  const activeSearchValues: Array<[string, string | undefined]> = [
    ['start', searchParams?.start],
    ['end', searchParams?.end],
    ['city', searchParams?.city],
    ['minPrice', searchParams?.minPrice],
    ['maxPrice', searchParams?.maxPrice],
    ['make', searchParams?.make],
    ['carType', searchParams?.carType],
    ['engine', searchParams?.engine],
    ['minSeats', searchParams?.minSeats],
  ];
  activeSearchValues.forEach(([key, value]) => {
    if (value) catalogQuery.set(key, value);
  });
  const catalogHref = `/${
    catalogQuery.size > 0 ? `?${catalogQuery.toString()}` : ''
  }#car-search`;
  const location = [car.city, car.carLocation].filter(Boolean).join(', ');
  const mapQuery = [car.carLocation, car.city, 'Serbia']
    .filter(Boolean)
    .join(', ');
  const encodedMapQuery = encodeURIComponent(mapQuery);
  const googleMapsApiKey = process.env.NEXT_GOOGLE_MAPS_EMBED_API_KEY?.trim();
  const googleMapsEmbedUrl = googleMapsApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(googleMapsApiKey)}&q=${encodedMapQuery}&zoom=15&language=en&region=RS`
    : null;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedMapQuery}`;
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
    <div className="min-h-screen bg-surface pb-20 text-ink md:pb-0">
      <OwnerProfileHeader />

      <main>
        <section className="bg-ink">
          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <Link
              href={catalogHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-border-strong transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70"
            >
              <ArrowLeft className="h-4 w-4" />
              {l.carDetailsPage.backToCatalog}
            </Link>

            <div className="mt-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand/20">
                  <ShieldCheck className="h-4 w-4" />
                  {l.carDetailsPage.localCarListing}
                </div>
                <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {carName}
                </h1>
                <p className="mt-3 flex items-center gap-2 text-sm text-border-strong sm:text-base">
                  <MapPin className="h-4 w-4 text-brand/70" />
                  {location}
                </p>
              </div>

              <div className="w-fit min-w-44 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-sm">
                <p className="font-heading text-3xl font-bold text-white">
                  €{car.pricePerDay}
                </p>
                <p className="text-xs font-semibold text-border-strong">
                  {l.carDetailsPage.perDay}
                </p>
                <div
                  aria-label={l.carDetailsPage.carRating}
                  className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3 text-sm"
                >
                  <Star
                    className={`h-4 w-4 text-amber-400 ${
                      car.ratingCount ? 'fill-amber-400' : ''
                    }`}
                  />
                  {car.ratingCount ? (
                    <>
                      <span className="font-bold text-white">
                        {(car.rating ?? 0).toFixed(1)}
                      </span>
                      <span className="text-border-strong">
                        {l.carDetailsPage.ratingCount(car.ratingCount)}
                      </span>
                    </>
                  ) : (
                    <span className="font-medium text-border-strong">
                      {l.carDetailsPage.noRatings}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-12">
          <div className="min-w-0 space-y-8">
            <CarDetailsGallery images={car.images} carName={carName} />

            <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                {l.carDetailsPage.vehicleOverview}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">
                {l.carDetailsPage.everythingForTrip}
              </h2>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-border bg-surface p-4"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-tint text-brand">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-body-faint">
                      {label}
                    </p>
                    <p className="mt-1 break-words text-sm font-semibold text-ink-secondary">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                {l.carDetailsPage.aboutThisCar}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">
                {l.carDetailsPage.description}
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-body-muted sm:text-base">
                {car.description || l.carDetailsPage.missingDescription}
              </p>
            </section>

            <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                    {l.carDetailsPage.pickupLocation}
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">
                    {l.carDetailsPage.findTheCar}
                  </h2>
                  <p className="mt-2 flex items-start gap-2 text-sm text-body-muted">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                    <span>{location}</span>
                  </p>
                </div>

                <Link
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-body transition-colors hover:border-brand/20 hover:bg-brand-tint hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {l.carDetailsPage.openInGoogleMaps}
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>

              {googleMapsEmbedUrl ? (
                <iframe
                  title={l.carDetailsPage.mapTitle(carName)}
                  src={googleMapsEmbedUrl}
                  className="h-72 w-full border-0 sm:h-80"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <div className="flex min-h-64 items-center justify-center border-t border-border bg-ink px-6 py-10 text-center text-white">
                  <div className="max-w-md">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15 text-brand/40">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <p className="mt-4 font-bold">
                      {l.carDetailsPage.mapUnavailable}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-border-strong">
                      {l.carDetailsPage.mapUnavailableDescription}
                    </p>
                  </div>
                </div>
              )}

              <p className="border-t border-border bg-surface px-5 py-3 text-xs leading-5 text-body-subtle sm:px-7">
                {l.carDetailsPage.handoverLocationNote}
              </p>
            </section>

            <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <div className="bg-ink-secondary p-5 text-white sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand/40">
                  {l.carDetailsPage.yourHost}
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">
                  {l.carDetailsPage.meetOwner}
                </h2>
              </div>

              {car.owner ? (
                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-surface-muted">
                    <Image
                      src={car.owner.images[0] || '/placeholder-user.svg'}
                      alt={car.owner.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-xl font-bold text-ink">
                      {car.owner.name || l.profile.rentMyCarOwner}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-body-subtle">
                      <span className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {car.owner.rating > 0
                          ? l.carDetailsPage.rating(car.owner.rating.toFixed(1))
                          : l.carDetailsPage.noRatings}
                      </span>
                      {memberSince ? (
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-4 w-4 text-brand" />
                          {l.carDetailsPage.memberSince(memberSince)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <Link
                    href={`/profile/${car.owner._id}`}
                    className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-body transition-colors hover:border-brand/20 hover:bg-brand-tint hover:text-brand"
                  >
                    {l.carDetailsPage.viewOwnerProfile}
                  </Link>
                </div>
              ) : (
                <p className="p-7 text-sm text-body-subtle">
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
