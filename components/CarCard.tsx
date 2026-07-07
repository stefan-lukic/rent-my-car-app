'use client';

import Image from 'next/image';
import { ICar } from '@/lib/model/car/Car';
import { useState } from 'react';

interface CarCardProps {
  car: ICar;
  onUpdate: (car: ICar) => void;
  onDeleteClick: (car: ICar) => void;
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

const CarCard: React.FC<CarCardProps> = ({ car, onUpdate, onDeleteClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-40 w-full bg-gray-50">
        <Image
          src={car.images?.[currentImageIndex] || '/placeholder-car.svg'}
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
              onClick={() => setCurrentImageIndex((i) => Math.max(0, i - 1))}
              disabled={currentImageIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/40 text-white rounded-full flex items-center justify-center disabled:opacity-30 text-sm"
            >
              ‹
            </button>
            <button
              onClick={() =>
                setCurrentImageIndex((i) =>
                  Math.min(car.images!.length - 1, i + 1)
                )
              }
              disabled={currentImageIndex === car.images.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/40 text-white rounded-full flex items-center justify-center disabled:opacity-30 text-sm"
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-base">
          {car.make} {car.carModel}
        </h3>

        <p className="text-gray-700 font-medium text-sm mt-0.5">
          ${car.pricePerDay} / day
        </p>

        <div className="flex items-center gap-1 mt-1 mb-3">
          <span className="text-gray-400 text-xs">📍</span>
          <span className="text-gray-500 text-xs">{car.city}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onUpdate(car)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ✎ Edit
          </button>
          <button
            onClick={() => onDeleteClick(car)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
