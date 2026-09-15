'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
} from 'lucide-react';
import { RentalWithCar } from '@/types/RentalWithCar';
import {
  canCancelRental,
  getRentalLifecycleStatus,
  RentalLifecycleStatus,
} from '@/lib/rentalLifecycle';
import l from '@/helper/en';
import RatingModal from './RatingModal';

interface RentalCardProps {
  rental: RentalWithCar;
  showStatus?: boolean;
  onCancel?: (rentalId: string) => void;
  currentDate: string;
  onReviewed?: (
    rentalId: string,
    review: NonNullable<RentalWithCar['clientReview']>
  ) => void;
}

const statusStyles: Record<string, string> = {
  upcoming: 'bg-brand-tint text-brand-dark',
  ongoing: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-slate-100 text-slate-600',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabel: Record<string, string> = {
  upcoming: l.status.upcoming,
  ongoing: l.status.ongoing,
  completed: l.status.completed,
  cancelled: l.status.cancelled,
};

const RentalCard: React.FC<RentalCardProps> = ({
  rental,
  showStatus = true,
  onCancel,
  currentDate,
  onReviewed,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  if (!rental.car) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-body">
        {l.common.unavailable}
      </div>
    );
  }

  const { car, rentalPeriod, totalCost } = rental;
  const status = getRentalLifecycleStatus(rental, currentDate);
  const isCancelled = status === RentalLifecycleStatus.Cancelled;
  const cancellationAllowed = canCancelRental(rental, currentDate);
  const images = car.images ?? [];
  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <article
      className={`overflow-hidden rounded-2xl border shadow-sm ${
        isCancelled
          ? 'border-slate-300 bg-slate-100 opacity-70 grayscale'
          : 'border-border bg-white transition hover:-translate-y-0.5 hover:shadow-md'
      }`}
    >
      <div className="relative h-48 w-full bg-slate-100">
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
              statusStyles[status]
            }`}
          >
            {statusLabel[status]}
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
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-md transition hover:bg-white disabled:opacity-40"
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
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-md transition hover:bg-white disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading text-base font-semibold text-ink">
              {car.make} {car.carModel}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-brand" />
              {car.city}
            </p>
            <p className="mt-2 text-xs font-semibold text-brand">
              €{car.pricePerDay} {l.common.perDay}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-brand">€{totalCost}</p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              {l.common.total}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-surface p-3">
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            <CalendarDays className="h-3.5 w-3.5 text-brand" />
            Rental period
          </p>
          <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-700">
            <span>{formatDate(rentalPeriod.startDate)}</span>
            <span className="text-slate-400">→</span>
            <span>{formatDate(rentalPeriod.endDate)}</span>
          </div>
        </div>

        {status === RentalLifecycleStatus.Upcoming &&
          onCancel &&
          (cancellationAllowed ? (
            <button
              type="button"
              onClick={() => onCancel(rental._id)}
              className="mt-3 min-h-11 w-full rounded-xl border border-red-200 py-2.5 text-xs font-semibold text-danger transition-colors hover:bg-danger-tint"
            >
              {l.booking.cancelReservation}
            </button>
          ) : (
            <p className="mt-3 rounded-xl bg-surface px-3 py-2.5 text-center text-xs font-semibold text-body">
              {l.booking.cancellationCutoffPassed}
            </p>
          ))}

        {status === RentalLifecycleStatus.Completed &&
          (rental.clientReview?.submittedAt ? (
            <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-success-tint py-2.5 text-xs font-bold text-success">
              <CheckCircle2 className="h-4 w-4" />
              {l.reviews.carAndOwnerRated}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsRatingOpen(true)}
              className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-xs font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              <Star className="h-4 w-4" />
              {l.reviews.rateTrip}
            </button>
          ))}
      </div>

      {isRatingOpen && (
        <RatingModal
          rentalId={rental._id}
          reviewerRole="client"
          targetName={l.profile.rentMyCarOwner}
          onClose={() => setIsRatingOpen(false)}
          onSubmitted={(review) => {
            onReviewed?.(rental._id, review);
            setIsRatingOpen(false);
          }}
        />
      )}
    </article>
  );
};

export default RentalCard;
