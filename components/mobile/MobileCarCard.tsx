'use client';

import Image from 'next/image';
import { ICar } from '@/lib/model/car/Car';
import { useState } from 'react';

interface MobileCarCardProps {
  car: ICar;
  onUpdate: (car: ICar) => void;
  onDeleteClick: (car: ICar) => void;
}

const MobileCarCard: React.FC<MobileCarCardProps> = ({
  car,
  onUpdate,
  onDeleteClick,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div className="relative h-48 w-full">
        <Image
          src={car.images?.[currentImageIndex] || '/placeholder-car.svg'}
          alt={`${car.make} ${car.carModel}`}
          fill
          className="object-cover"
        />
        {car.images && car.images.length > 1 && (
          <div className="absolute inset-0 flex justify-between items-center px-2">
            <button
              onClick={() => setCurrentImageIndex((i) => Math.max(0, i - 1))}
              disabled={currentImageIndex === 0}
              className="w-7 h-7 bg-black/40 text-white rounded-full flex items-center justify-center disabled:opacity-30"
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
              className="w-7 h-7 bg-black/40 text-white rounded-full flex items-center justify-center disabled:opacity-30"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base">
          {car.make} {car.carModel}
        </h3>
        <p className="text-green-500 font-bold text-sm mt-0.5">
          €{car.pricePerDay} / day
        </p>
        <div className="flex items-center gap-1 mt-1 mb-3">
          <span className="text-gray-400 text-xs">📍</span>
          <span className="text-gray-500 text-xs">{car.city}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onUpdate(car)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ✎ Edit
          </button>
          <button
            onClick={() => onDeleteClick(car)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm border border-red-200 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileCarCard;
