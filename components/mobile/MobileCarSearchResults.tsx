'use client';

import React, { useState } from 'react';
import { ICar } from '@/lib/model/car/Car';
import Image from 'next/image';
import { MapPin, Eye, Star, Zap } from 'lucide-react';
import l from '@/helper/en';

interface CarSearchResultsProps {
  car: ICar;
  onBookNow: () => void;
  onViewDetails: () => void;
}

const MobileCarSearchResults: React.FC<CarSearchResultsProps> = ({
  car,
  onBookNow,
  onViewDetails,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    if (car.images && currentImageIndex < car.images.length - 1)
      setCurrentImageIndex(currentImageIndex + 1);
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) setCurrentImageIndex(currentImageIndex - 1);
  };

  const formatText = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  const year = car.firstRegistration
    ? new Date(car.firstRegistration).getFullYear()
    : null;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="relative h-52 w-full overflow-hidden bg-surface-muted">
        <Image
          src={car.images?.[currentImageIndex] || '/placeholder-car.svg'}
          alt={`${car.make} ${car.carModel}`}
          width={500}
          height={300}
          className="object-cover w-full h-full"
        />

        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
          <MapPin className="w-3 h-3 text-brand" />
          <span className="text-xs font-semibold text-body">{car.city}</span>
        </div>

        {car.images && car.images.length > 1 && (
          <>
            <div className="absolute inset-0 flex justify-between items-center px-3 opacity-0 hover:opacity-100 transition-opacity">
              <button
                type="button"
                aria-label={l.carDetailsPage.previousImage}
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white ${currentImageIndex === 0 ? 'hidden' : ''}`}
                onClick={handlePrevImage}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label={l.carDetailsPage.nextImage}
                className={`ml-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white ${currentImageIndex === car.images.length - 1 ? 'hidden' : ''}`}
                onClick={handleNextImage}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {car.images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand">
              {car.make}
            </p>
            <h3 className="font-heading text-base font-semibold leading-tight text-ink">
              {car.carModel}{' '}
              {year && (
                <span className="text-body-faint font-normal text-sm">
                  ({year})
                </span>
              )}
            </h3>
            {car.ratingCount ? (
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-body-muted">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {car.rating?.toFixed(1)} ({car.ratingCount})
              </p>
            ) : null}
          </div>
          <div className="text-right">
            <p className="font-heading text-xl font-bold text-ink">
              €{car.pricePerDay}
            </p>
            <p className="text-[10px] text-body-faint font-medium">/ DAY</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-body-subtle bg-surface border border-surface-muted px-2.5 py-1 rounded-lg font-medium">
            {formatText(car.carType)}
          </span>
          <span className="text-xs text-body-subtle bg-surface border border-surface-muted px-2.5 py-1 rounded-lg font-medium">
            {formatText(car.engine)}
          </span>
          <span className="text-xs text-body-subtle bg-surface border border-surface-muted px-2.5 py-1 rounded-lg font-medium">
            {car.averageConsumption} l/100km
          </span>
          {car.seats ? (
            <span className="text-xs text-body-subtle bg-surface border border-surface-muted px-2.5 py-1 rounded-lg font-medium">
              {car.seats} {l.carSpecs.seats.toLowerCase()}
            </span>
          ) : null}
        </div>

        <div className="flex gap-2 pt-1 border-t border-surface-muted">
          <button
            onClick={onViewDetails}
            className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-white py-2.5 text-sm font-semibold text-body transition-colors hover:bg-surface"
          >
            <Eye className="w-3.5 h-3.5" />
            {l.common.specs}
          </button>
          <button
            onClick={onBookNow}
            className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand/90"
          >
            <Zap className="w-3.5 h-3.5" />
            {l.common.bookNow}
          </button>
        </div>
      </div>
    </article>
  );
};

export default MobileCarSearchResults;
