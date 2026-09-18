'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CalendarDays,
  CarFront,
  ChevronLeft,
  ChevronRight,
  Fuel,
  Gauge,
  MapPin,
  Star,
  Users,
  Route,
  X,
  type LucideIcon,
} from 'lucide-react';
import { IRenter } from '@/lib/model/User';
import { ICar } from '@/lib/model/car/Car';
import HowItWorksModal from './HowItWorksModal';
import RenterCard from './RenterCard';
import l from '@/helper/en';
import { formatCalendarDate } from '@/lib/utils/calendarDate';
import { Dialog } from '@/components/UI/Dialog';

export interface CarDetailsDrawerProps {
  car: ICar | null;
  renter: IRenter | null;
  renterLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: () => void;
  startDate?: Date | null;
  endDate?: Date | null;
  searchQuery?: string;
}

interface CarSpec {
  icon: LucideIcon;
  label: string;
  value: string;
}

// Keep registration dates stable across browsers and aligned with Serbia's day-first format.
const registrationDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Europe/Belgrade',
});

const CarDetailsDrawer: React.FC<CarDetailsDrawerProps> = ({
  car,
  renter,
  renterLoading,
  isOpen,
  onClose,
  onBookNow,
  startDate,
  endDate,
  searchQuery,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [car?._id]);

  if (!car || !isOpen) return null;

  const images = car.images ?? [];
  const totalImages = images.length;
  // Search previews expose the city, never the owner's precise pickup address.
  const location = car.city;
  const detailsQuery = new URLSearchParams(searchQuery);
  if (startDate) detailsQuery.set('start', formatCalendarDate(startDate));
  if (endDate) detailsQuery.set('end', formatCalendarDate(endDate));
  const detailsHref = `/cars/${car._id}${
    detailsQuery.size > 0 ? `?${detailsQuery.toString()}` : ''
  }`;
  const specs: CarSpec[] = [
    { icon: Fuel, label: l.carSpecs.engine, value: car.engine },
    { icon: Gauge, label: l.carSpecs.power, value: `${car.power} HP` },
    ...(car.seats
      ? [{ icon: Users, label: l.carSpecs.seats, value: String(car.seats) }]
      : []),
    { icon: CarFront, label: l.carSpecs.type, value: car.carType },
    {
      icon: Route,
      label: l.carSpecs.mileage,
      value: `${car.milage} km`,
    },
    ...(car.averageConsumption
      ? [
          {
            icon: Gauge,
            label: l.carSpecs.consumption,
            value: car.averageConsumption,
          },
        ]
      : []),
    ...(car.firstRegistration
      ? [
          {
            icon: CalendarDays,
            label: l.carSpecs.registration,
            value: registrationDateFormatter.format(
              new Date(car.firstRegistration)
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <Dialog
        onClose={onClose}
        ariaLabelledBy="car-details-title"
        closeOnBackdrop
        overlayClassName="z-[60] items-stretch justify-end bg-ink/60 backdrop-blur-[2px]"
        panelClassName="flex h-full w-full flex-col bg-white shadow-xl sm:w-[500px] lg:w-[540px]"
      >
        {/* Give the drawer the same focus boundary and restoration as modal dialogs. */}
        <header className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              {l.drawer.carDetails}
            </p>
            <p className="mt-0.5 text-xs text-body-subtle">
              {l.carDetailsPage.reviewBeforeBooking}
            </p>
          </div>
          <button
            type="button"
            aria-label={l.carDetailsPage.closeDetails}
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-body transition hover:border-brand-light hover:bg-brand-tint hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <section className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
            <Image
              src={images[currentImageIndex] || '/placeholder-car.svg'}
              alt={`${car.make} ${car.carModel}`}
              fill
              sizes="(max-width: 640px) 100vw, 540px"
              className="object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/65 to-transparent" />

            {totalImages > 0 && (
              <span className="absolute bottom-4 right-4 rounded-full bg-ink/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {currentImageIndex + 1} / {totalImages}
              </span>
            )}

            {totalImages > 1 && (
              <>
                <button
                  type="button"
                  aria-label={l.carDetailsPage.previousImage}
                  onClick={() =>
                    setCurrentImageIndex((index) => Math.max(index - 1, 0))
                  }
                  disabled={currentImageIndex === 0}
                  className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-secondary shadow-lg transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label={l.carDetailsPage.nextImage}
                  onClick={() =>
                    setCurrentImageIndex((index) =>
                      Math.min(index + 1, totalImages - 1)
                    )
                  }
                  disabled={currentImageIndex === totalImages - 1}
                  className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-secondary shadow-lg transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {images.map((image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      aria-label={l.carDetailsPage.showImage(index + 1)}
                      onClick={() => setCurrentImageIndex(index)}
                      className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <span
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'w-6 bg-white'
                            : 'w-1.5 bg-white/60'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </section>

          <div className="space-y-6 px-5 py-6 sm:px-6">
            <section className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-brand">
                  {l.carDetailsPage.availableForRent}
                </p>
                <h2
                  id="car-details-title"
                  className="font-heading text-2xl font-bold tracking-tight text-ink"
                >
                  {car.make} {car.carModel}
                </h2>
                <p className="mt-2 flex items-start gap-1.5 text-sm text-body-subtle">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                  <span>{location}</span>
                </p>
                {car.ratingCount ? (
                  <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-body">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {car.rating?.toFixed(1)} ({car.ratingCount})
                  </p>
                ) : null}
              </div>

              <div className="flex-shrink-0 rounded-xl bg-brand-tint px-4 py-3 text-right">
                <p className="font-heading text-xl font-bold text-brand">
                  €{car.pricePerDay}
                </p>
                <p className="text-xs font-medium text-body-subtle">
                  {l.common.perDay}
                </p>
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-body-subtle">
                {l.carDetailsPage.vehicleOverview}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-border bg-surface p-3.5"
                  >
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-brand-tint text-brand">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-body-faint">
                      {label}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-ink-secondary">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {car.description && (
              <section className="rounded-2xl border border-border bg-white p-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-body-subtle">
                  {l.common.description}
                </h3>
                <p className="mt-2 text-sm leading-6 text-body-muted">
                  {car.description}
                </p>
              </section>
            )}

            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-body-subtle">
                {l.carDetailsPage.listedBy}
              </h3>
              {renterLoading ? (
                <p className="rounded-2xl border border-border bg-surface p-4 text-sm text-body-subtle">
                  {l.drawer.loadingOwner}
                </p>
              ) : renter ? (
                <RenterCard renter={renter} />
              ) : (
                <p className="rounded-2xl border border-dashed border-border-strong bg-surface p-4 text-sm text-body-subtle">
                  {l.drawer.noRenterInfo}
                </p>
              )}
            </section>
          </div>
        </div>

        <footer className="grid grid-cols-2 gap-3 border-t border-border bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-12px_30px_rgba(15,23,42,0.06)] sm:px-6 sm:pb-4">
          <Link
            href={detailsHref}
            className="col-span-2 flex items-center justify-center rounded-xl border border-brand/20 bg-brand-tint px-4 py-3 text-sm font-semibold text-brand transition-colors hover:border-brand/40 hover:bg-brand-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {l.carDetailsPage.viewFullDetails}
          </Link>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl border border-border-strong px-4 py-3 text-sm font-semibold text-body transition-colors hover:border-brand/40 hover:bg-brand-tint hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {l.common.howItWorks}
          </button>
          <button
            type="button"
            onClick={onBookNow}
            className="rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            {l.common.bookNow}
          </button>
        </footer>
      </Dialog>

      <HowItWorksModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CarDetailsDrawer;
