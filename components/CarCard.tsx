'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pencil,
  Trash2,
  Users,
  Star,
} from 'lucide-react';
import { ICar } from '@/lib/model/car/Car';
import l from '@/helper/en';

interface CarCardProps {
  car: ICar;
  onUpdate: (car: ICar) => void;
  onDeleteClick: (car: ICar) => void;
}

const statusStyles: Record<string, string> = {
  available: 'bg-emerald-100 text-emerald-700',
  rented: 'bg-amber-100 text-amber-700',
  inactive: 'bg-slate-100 text-slate-500',
};

const statusLabel: Record<string, string> = {
  available: l.status.available,
  rented: l.status.booked,
  inactive: l.status.inactive,
};

const CarCard: React.FC<CarCardProps> = ({ car, onUpdate, onDeleteClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = car.images ?? [];

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-surface-0 shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-48 w-full bg-slate-100">
        <Image
          src={images[currentImageIndex] || '/placeholder-car.svg'}
          alt={`${car.make} ${car.carModel}`}
          fill
          sizes="(max-width: 1024px) 50vw, 320px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />

        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm ${
            statusStyles[car.status ?? ''] || statusStyles.available
          }`}
        >
          {statusLabel[car.status ?? ''] || l.status.available}
        </span>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous car image"
              onClick={() =>
                setCurrentImageIndex((index) => Math.max(0, index - 1))
              }
              disabled={currentImageIndex === 0}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-md transition hover:bg-white disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next car image"
              onClick={() =>
                setCurrentImageIndex((index) =>
                  Math.min(images.length - 1, index + 1)
                )
              }
              disabled={currentImageIndex === images.length - 1}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-md transition hover:bg-white disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-heading text-base font-semibold text-ink">
          {car.make} {car.carModel}
        </h3>
        {car.ratingCount ? (
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-600">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {car.rating?.toFixed(1)} ({car.ratingCount})
          </p>
        ) : null}
        <p className="mt-1 text-sm font-semibold text-brand">
          €{car.pricePerDay}
          {l.common.perDay}
        </p>
        <div className="mb-4 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-brand" />
            {car.city}
          </span>
          {car.seats ? (
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-brand" />
              {car.seats} {l.carSpecs.seats.toLowerCase()}
            </span>
          ) : null}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onUpdate(car)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-brand/20 hover:bg-brand-tint hover:text-brand"
          >
            <Pencil className="h-3.5 w-3.5" />
            {l.common.edit}
          </button>
          <button
            type="button"
            onClick={() => onDeleteClick(car)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {l.common.delete}
          </button>
        </div>
      </div>
    </article>
  );
};

export default CarCard;
