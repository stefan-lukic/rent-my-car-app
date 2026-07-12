'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { ICar } from '@/lib/model/car/Car';
import RenterCard from '../RenterCard';
import HowItWorksModal from '../HowItWorksModal';
import { IRenter } from '@/lib/model/User';

interface CarDetailsDrawerProps {
  car: ICar | null;
  renter: IRenter | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: () => void;
}

const MobileCarDetailsDrawer: React.FC<CarDetailsDrawerProps> = ({
  car,
  renter,
  isOpen,
  onClose,
  onBookNow,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!car || !isOpen) return null;

  const images = car.images ?? [];
  const total = images.length;

  const specs = [
    { label: 'Engine', value: car.engine, icon: '⚡' },
    { label: 'Power', value: `${car.power} HP`, icon: '🏎️' },
    {
      label: 'Type',
      value: car.carType.charAt(0) + car.carType.slice(1).toLowerCase(),
      icon: '🚗',
    },
    { label: 'City', value: car.city, icon: '📍' },
    car.milage && { label: 'Mileage', value: `${car.milage} km`, icon: '🛣️' },
    car.averageConsumption && {
      label: 'Consumption',
      value: car.averageConsumption,
      icon: '⛽',
    },
    car.firstRegistration && {
      label: 'Registration',
      value: new Date(car.firstRegistration).toLocaleDateString(),
      icon: '📅',
    },
  ].filter(Boolean) as { label: string; value: string; icon: string }[];

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white flex flex-col shadow-2xl">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">
            Car Details
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="relative aspect-[16/9] bg-gray-100">
            <Image
              src={images[currentImageIndex] || '/placeholder-car.svg'}
              alt={`${car.make} ${car.carModel}`}
              fill
              className="object-cover"
            />
            {total > 1 && (
              <>
                <div className="absolute bottom-3 w-full flex justify-center gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentImageIndex((i) => Math.max(i - 1, 0))
                  }
                  disabled={currentImageIndex === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center disabled:opacity-30 text-lg"
                ></button>
                <button
                  onClick={() =>
                    setCurrentImageIndex((i) => Math.min(i + 1, total - 1))
                  }
                  disabled={currentImageIndex === total - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center disabled:opacity-30 text-lg"
                ></button>
              </>
            )}
          </div>

          <div className="p-5 space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {car.make}{' '}
                  <span className="text-gray-400 font-medium">
                    {car.carModel}
                  </span>
                </h2>
                <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
                  <span>📍</span>
                  <span>
                    {car.city}
                    {car.carLocation && `, ${car.carLocation}`}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  €{car.pricePerDay}
                </div>
                <div className="text-xs text-gray-400">/ day</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {specs.map(({ icon, label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <div className="text-xs text-gray-400 mb-0.5">
                    {icon} {label}
                  </div>
                  <div className="text-sm font-semibold text-gray-800">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {car.description && (
              <div className="border-t pt-4">
                <p className="text-xs text-gray-400 uppercase mb-1">
                  Description
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {car.description}
                </p>
              </div>
            )}

            <div className="border-t pt-4">
              <p className="text-xs text-gray-400 uppercase mb-2">Renter</p>
              {renter ? (
                <RenterCard renter={renter} />
              ) : (
                <p className="text-sm text-gray-400">
                  No renter info available
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 p-4 border-t border-gray-100 bg-white sticky bottom-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 border border-gray-200 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            How it works
          </button>
          <button
            onClick={onBookNow}
            className="flex-1 bg-emerald-500 text-white font-semibold py-2.5 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm text-sm"
          >
            Book Now
          </button>
        </div>
      </div>
      <HowItWorksModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default MobileCarDetailsDrawer;
