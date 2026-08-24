'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  CalendarDays,
  CarFront,
  ChevronLeft,
  ChevronRight,
  Fuel,
  Gauge,
  MapPin,
  Route,
  X,
  type LucideIcon,
} from 'lucide-react';
import { IRenter } from '@/lib/model/User';
import { ICar } from '@/lib/model/car/Car';
import HowItWorksModal from './HowItWorksModal';
import RenterCard from './RenterCard';
import l from '@/helper/en';

export interface CarDetailsDrawerProps {
  car: ICar | null;
  renter: IRenter | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: () => void;
}

interface CarSpec {
  icon: LucideIcon;
  label: string;
  value: string;
}

const CarDetailsDrawer: React.FC<CarDetailsDrawerProps> = ({
  car,
  renter,
  isOpen,
  onClose,
  onBookNow,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [car?._id]);

  if (!car || !isOpen) return null;

  const images = car.images ?? [];
  const totalImages = images.length;
  const location = [car.city, car.carLocation].filter(Boolean).join(', ');
  const specs: CarSpec[] = [
    { icon: Fuel, label: l.carSpecs.engine, value: car.engine },
    { icon: Gauge, label: l.carSpecs.power, value: `${car.power} HP` },
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
            value: new Date(car.firstRegistration).toLocaleDateString(),
          },
        ]
      : []),
  ];

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-[2px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="car-details-title"
        className="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-2xl sm:w-[500px] lg:w-[540px]"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
              {l.drawer.carDetails}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Review the vehicle before booking
            </p>
          </div>
          <button
            type="button"
            aria-label="Close car details"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <section className="relative aspect-[16/10] overflow-hidden bg-slate-100">
            <Image
              src={images[currentImageIndex] || '/placeholder-car.svg'}
              alt={`${car.make} ${car.carModel}`}
              fill
              sizes="(max-width: 640px) 100vw, 540px"
              className="object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/65 to-transparent" />

            {totalImages > 0 && (
              <span className="absolute bottom-4 right-4 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {currentImageIndex + 1} / {totalImages}
              </span>
            )}

            {totalImages > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous car image"
                  onClick={() =>
                    setCurrentImageIndex((index) => Math.max(index - 1, 0))
                  }
                  disabled={currentImageIndex === 0}
                  className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next car image"
                  onClick={() =>
                    setCurrentImageIndex((index) =>
                      Math.min(index + 1, totalImages - 1)
                    )
                  }
                  disabled={currentImageIndex === totalImages - 1}
                  className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {images.map((image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      aria-label={`Show image ${index + 1}`}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentImageIndex
                          ? 'w-6 bg-white'
                          : 'w-1.5 bg-white/60 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </section>

          <div className="space-y-6 px-5 py-6 sm:px-6">
            <section className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                  Available for rent
                </p>
                <h2
                  id="car-details-title"
                  className="text-2xl font-bold tracking-tight text-slate-950"
                >
                  {car.make} {car.carModel}
                </h2>
                <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-500">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
                  <span>{location}</span>
                </p>
              </div>

              <div className="flex-shrink-0 rounded-2xl bg-blue-50 px-4 py-3 text-right">
                <p className="text-xl font-bold text-blue-600">
                  €{car.pricePerDay}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  {l.common.perDay}
                </p>
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Vehicle overview
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5"
                  >
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {label}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {car.description && (
              <section className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  {l.common.description}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {car.description}
                </p>
              </section>
            )}

            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Listed by
              </h3>
              {renter ? (
                <RenterCard renter={renter} />
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                  {l.drawer.noRenterInfo}
                </p>
              )}
            </section>
          </div>
        </div>

        <footer className="grid grid-cols-2 gap-3 border-t border-slate-200 bg-white px-5 py-4 shadow-[0_-12px_30px_rgba(15,23,42,0.06)] sm:px-6">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {l.common.howItWorks}
          </button>
          <button
            type="button"
            onClick={onBookNow}
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            {l.common.bookNow}
          </button>
        </footer>
      </aside>

      <HowItWorksModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CarDetailsDrawer;
