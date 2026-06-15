'use client';

import React, { useState } from 'react';
import { ICar } from '@/lib/model/car/Car';
import Image from 'next/image';
import { MapPin, Eye, Zap } from 'lucide-react';

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
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <Image
          src={car.images?.[currentImageIndex] || '/placeholder-car.svg'}
          alt={`${car.make} ${car.carModel}`}
          width={500}
          height={300}
          className="object-cover w-full h-full"
        />

        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
          <svg
            className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-bold text-slate-800">4.80</span>
          <span className="text-[10px] text-slate-400">(12)</span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
          <MapPin className="w-3 h-3 text-blue-500" />
          <span className="text-xs font-semibold text-slate-700">
            {car.city}
          </span>
        </div>

        {car.images && car.images.length > 1 && (
          <>
            <div className="absolute inset-0 flex justify-between items-center px-3 opacity-0 hover:opacity-100 transition-opacity">
              <button
                className={`w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center ${currentImageIndex === 0 ? 'hidden' : ''}`}
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
                className={`w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center ml-auto ${currentImageIndex === car.images.length - 1 ? 'hidden' : ''}`}
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
            <p className="text-[10px] font-bold text-blue-600 tracking-widest uppercase">
              {car.make}
            </p>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              {car.carModel}{' '}
              {year && (
                <span className="text-slate-400 font-normal text-sm">
                  ({year})
                </span>
              )}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-slate-900">
              €{car.pricePerDay}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">/ DAY</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg font-medium">
            {formatText(car.carType)}
          </span>
          <span className="text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg font-medium">
            {formatText(car.engine)}
          </span>
          <span className="text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg font-medium">
            {car.averageConsumption} l/100km
          </span>
        </div>

        <div className="flex gap-2 pt-1 border-t border-slate-100">
          <button
            onClick={onViewDetails}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Specs
          </button>
          <button
            onClick={onBookNow}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
          >
            <Zap className="w-3.5 h-3.5" />
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileCarSearchResults;
