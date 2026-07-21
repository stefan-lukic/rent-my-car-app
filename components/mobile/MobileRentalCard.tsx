'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ICar } from '@/lib/model/car/Car';
import l from '@/helper/en';

interface MobileRentalCardProps {
  rental: {
    _id: string;
    car: ICar | null;
    rentalPeriod: {
      startDate: Date;
      endDate: Date;
    };
    totalCost: number;
    status?: 'active' | 'cancelled';
    cancelledAt?: Date;
    cancelledBy?: string;
  };
  showStatus?: boolean;
  onCancel?: (rentalId: string) => void;
}

const statusStyles: Record<string, string> = {
  active: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabel: Record<string, string> = {
  active: l.status.booked,
  cancelled: l.status.cancelled,
};

const MobileRentalCard: React.FC<MobileRentalCardProps> = ({ rental, showStatus = true, onCancel }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!rental.car) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-center text-gray-400 text-sm">
        {l.cars.carUnavailable}
      </div>
    );
  }

  const { car, rentalPeriod, totalCost } = rental;
  const status = rental.status ?? 'active';
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

        {showStatus && (
          <span
            className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-md ${
              statusStyles[status] || statusStyles.available
            }`}
          >
            {            statusLabel[status] || l.status.available}
          </span>
        )}

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
              disabled={currentImageIndex >= car.images.length - 1}
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
                    currentImageIndex === i
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
          <span className="text-xs text-gray-400 font-medium">{l.common.total}</span>
          <span className="text-sm font-bold text-gray-900">€{totalCost}</span>
        </div>

        {status === 'active' && onCancel && (
          <button
            onClick={() => onCancel(rental._id)}
            className="mt-3 w-full py-2 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors"
          >
            {l.booking.cancelReservation}
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileRentalCard;
