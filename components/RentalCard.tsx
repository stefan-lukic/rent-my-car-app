'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { ICar } from '@/lib/model/car/Car';
import { RentalStatus } from '@/types/RentalWithCar';
import l from '@/helper/en';

interface RentalCardProps {
  rental: {
    _id: string;
    car: ICar;
    rentalPeriod: {
      startDate: Date;
      endDate: Date;
    };
    totalCost: number;
    status?: RentalStatus;
    cancelledAt?: Date;
    cancelledBy?: string;
  };
  showStatus?: boolean;
  onCancel?: (rentalId: string) => void;
}

const statusStyles: Record<string, string> = {
  active: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabel: Record<string, string> = {
  active: l.status.booked,
  cancelled: l.status.cancelled,
};

const RentalCard: React.FC<RentalCardProps> = ({
  rental,
  showStatus = true,
  onCancel,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!rental.car) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        {l.common.unavailable}
      </div>
    );
  }

  const { car, rentalPeriod, totalCost } = rental;
  const status = rental.status ?? 'active';
  const images = car.images ?? [];
  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-44 w-full bg-slate-100">
        <Image
          src={images[currentImageIndex] || '/placeholder-car.svg'}
          alt={`${car.make} ${car.carModel}`}
          fill
          sizes="(max-width: 1024px) 50vw, 320px"
          className="object-cover"
        />
        {showStatus && (
          <span
            className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm ${
              statusStyles[status] || statusStyles.active
            }`}
          >
            {statusLabel[status] || l.status.booked}
          </span>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous rental car image"
              onClick={() =>
                setCurrentImageIndex((index) => Math.max(0, index - 1))
              }
              disabled={currentImageIndex === 0}
              className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next rental car image"
              onClick={() =>
                setCurrentImageIndex((index) =>
                  Math.min(images.length - 1, index + 1)
                )
              }
              disabled={currentImageIndex === images.length - 1}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-950">
              {car.make} {car.carModel}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-blue-500" />
              {car.city}
            </p>
            <p className="mt-2 text-xs font-bold text-blue-600">
              €{car.pricePerDay} {l.common.perDay}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-blue-600">€{totalCost}</p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              {l.common.total}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
            Rental period
          </p>
          <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-700">
            <span>{formatDate(rentalPeriod.startDate)}</span>
            <span className="text-slate-400">→</span>
            <span>{formatDate(rentalPeriod.endDate)}</span>
          </div>
        </div>

        {status === 'active' && onCancel && (
          <button
            type="button"
            onClick={() => onCancel(rental._id)}
            className="mt-3 w-full rounded-xl border border-red-200 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
          >
            {l.booking.cancelReservation}
          </button>
        )}
      </div>
    </article>
  );
};

export default RentalCard;
