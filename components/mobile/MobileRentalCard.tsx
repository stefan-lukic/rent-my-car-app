'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ICar } from '@/lib/model/car/Car';

interface MobileRentalCardProps {
  rental: {
    _id: string;
    car: ICar;
    rentalPeriod: {
      startDate: Date;
      endDate: Date;
    };
    totalCost: number;
  };
}

const statusStyles: Record<string, string> = {
  available: 'bg-green-100 text-green-700',
  rented: 'bg-yellow-100 text-yellow-700',
  inactive: 'bg-gray-100 text-gray-500',
};

const statusLabel: Record<string, string> = {
  available: 'Available',
  rented: 'Booked',
  inactive: 'Inactive',
};

const MobileRentalCard: React.FC<MobileRentalCardProps> = ({ rental }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!rental.car) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-center text-gray-400 text-sm">
        🚗 Car unavailable
      </div>
    );
  }

  const { car, rentalPeriod, totalCost } = rental;
  const startDate = new Date(rentalPeriod.startDate);
  const endDate = new Date(rentalPeriod.endDate);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const carImage =
    car.images && car.images.length > 0
      ? car.images[0]
      : '/placeholder-car.svg';

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

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-40 w-full bg-gray-100">
        <Image
          src={carImage}
          alt={`${car.make} ${car.carModel}`}
          fill
          className="object-cover"
        />

        <span
          className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-md ${
            statusStyles[car.status] || statusStyles.available
          }`}
        >
          {statusLabel[car.status] || 'Available'}
        </span>

        {car.images && car.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              disabled={currentImageIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center disabled:opacity-30 text-sm hover:bg-black/60 transition"
            >
              ‹
            </button>
            <button
              onClick={handleNextImage}
              disabled={currentImageIndex === car.images.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center disabled:opacity-30 text-sm hover:bg-black/60 transition"
            >
              ›
            </button>

            {/* Indikatori */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {car.images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentImageIndex
                      ? 'w-4 bg-white'
                      : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-base">
          {car.make} {car.carModel}
        </h3>

        <p className="text-gray-700 font-medium text-sm mt-0.5">
          €{car.pricePerDay} / day
        </p>

        <div className="flex items-center gap-1 mt-1">
          <span className="text-gray-400 text-xs">📍</span>
          <span className="text-gray-500 text-xs">{car.city}</span>
        </div>

        <div className="flex items-center gap-2 mt-2 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
          <span>{formatDate(startDate)}</span>
          <span className="text-gray-300">→</span>
          <span>{formatDate(endDate)}</span>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400 font-medium">Total</span>
          <span className="text-sm font-bold text-gray-900">€{totalCost}</span>
        </div>
      </div>
    </div>
  );
};

export default MobileRentalCard;
