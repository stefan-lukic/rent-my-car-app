'use client';

import React, { useState } from 'react';
import { ICar } from '@/lib/model/car/Car';
import Image from 'next/image';
import l from '@/helper/en';
import { Star } from 'lucide-react';

interface SearchResultsProps {
  car: ICar;
  onBookNow: () => void;
  onViewDetails: () => void;
}

const CarSearchResults: React.FC<SearchResultsProps> = ({
  car,
  onBookNow,
  onViewDetails,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    if (car.images && currentImageIndex < car.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const formatText = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  // Public search shows the city without exposing the precise pickup address.
  const publicLocation = car.city;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <Image
          src={car.images?.[currentImageIndex] || '/placeholder-car.svg'}
          alt={`${car.make} ${car.carModel}`}
          width={500}
          height={300}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />

        {car.images && car.images.length > 1 && (
          <div className="absolute inset-0 flex justify-between items-center px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              className={`flex items-center justify-center w-8 h-8 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-all ${currentImageIndex === 0 ? 'hidden' : ''}`}
              onClick={handlePrevImage}
              disabled={currentImageIndex === 0}
            >
              <svg
                className="w-5 h-5"
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
              className={`flex items-center justify-center w-8 h-8 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-all ml-auto ${currentImageIndex === car.images.length - 1 ? 'hidden' : ''}`}
              onClick={handleNextImage}
              disabled={currentImageIndex === car.images.length - 1}
            >
              <svg
                className="w-5 h-5"
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
        )}

        {car.images && car.images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {car.images.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${index === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-grow flex-col justify-between p-5">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-heading text-lg font-semibold text-ink">
                {car.make}{' '}
                <span className="text-slate-600">{car.carModel}</span>
              </h3>

              {car.ratingCount ? (
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-600">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {car.rating?.toFixed(1)} ({car.ratingCount})
                </p>
              ) : null}

              <div className="mt-1 flex items-center text-sm text-slate-500">
                <svg
                  className="w-4 h-4 text-emerald-500 mr-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

                <span className="truncate">{publicLocation}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-heading text-lg font-bold text-ink">
                €{car.pricePerDay}
              </span>
              <span className="block text-xs font-medium text-slate-500">
                {l.common.perDay}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 mb-6">
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
              {formatText(car.carType)}
            </span>
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
              {formatText(car.engine)}
            </span>
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
              {car.averageConsumption} l/100km
            </span>
            {car.seats ? (
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                {car.seats} {l.carSpecs.seats.toLowerCase()}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-auto flex gap-3 border-t border-slate-100 pt-4">
          <button
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-ink"
            onClick={onViewDetails}
          >
            {l.common.details}
          </button>
          <button
            className="flex-1 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand/90"
            onClick={onBookNow}
          >
            {l.common.bookNow}
          </button>
        </div>
      </div>
    </article>
  );
};

export default CarSearchResults;
