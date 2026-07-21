'use client';

import React from 'react';
import Image from 'next/image';
import { ICar } from '@/lib/model/car/Car';
import l from '@/helper/en';
import { RentalStatus } from '@/types/RentalWithCar';

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
  active: 'bg-yellow-100 text-yellow-700',
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
  const { car, rentalPeriod, totalCost } = rental;
  const status = rental.status ?? 'active';

  if (!car) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm h-full flex items-center justify-center">
        <span className="text-gray-400 text-sm">{l.common.unavailable}</span>
      </div>
    );
  }

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

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-40 w-full bg-gray-50">
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
            {statusLabel[status] || l.status.available}
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-base">
          {car.make} {car.carModel}
        </h3>

        <p className="text-gray-700 font-medium text-sm mt-0.5">
          €{car.pricePerDay}
          {l.common.perDay}
        </p>

        <div className="flex items-center gap-1 mt-1 mb-3">
          <span className="text-gray-400 text-xs">📍</span>
          <span className="text-gray-500 text-xs">{car.city}</span>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 bg-gray-50">
            <span>{formatDate(startDate)}</span>
            <span className="text-gray-300">→</span>
            <span>{formatDate(endDate)}</span>
          </div>
          <div className="flex-1 flex items-center justify-center px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-700 bg-gray-50 font-medium">
            €{totalCost}
          </div>
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

export default RentalCard;
