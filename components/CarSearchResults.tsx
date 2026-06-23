'use client';

import React, { useState } from 'react';
import { ICar } from '@/lib/model/car/Car';
import Image from 'next/image';

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

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
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

      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900 uppercase">
                {car.make}{' '}
                <span className="text-gray-600 lowercase">{car.carModel}</span>
              </h3>

              <div className="flex items-center text-sm text-gray-500 mt-1">
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
                <span className="truncate">
                  {car.city}, {car.carLocation}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">
                €{car.pricePerDay}
              </span>
              <span className="block text-xs text-gray-500 font-medium">
                / day
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 mb-6">
            <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-100">
              {formatText(car.carType)}
            </span>
            <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-100">
              {formatText(car.engine)}
            </span>
            <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-100">
              {car.averageConsumption} l/100km
            </span>
          </div>
        </div>

        <div className="flex gap-3 mt-auto border-t border-gray-100 pt-4">
          <button
            className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
            onClick={onViewDetails}
          >
            Details
          </button>
          <button
            className="flex-1 bg-emerald-500 text-white font-semibold py-2.5 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm text-sm"
            onClick={onBookNow}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarSearchResults;
