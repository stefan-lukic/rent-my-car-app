'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { ICar } from '@/lib/model/car/Car';
import OwnerCard from '../OwnerCard';
import HowItWorksModal from '../HowItWorksModal';
import { IOwner } from '@/lib/model/User';

interface CarDetailsDrawerProps {
  car: ICar | null;
  owner: IOwner | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: () => void;
}

const MobileCarDetailsDrawer: React.FC<CarDetailsDrawerProps> = ({
  car,
  owner,
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
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
            Car Details
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
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
                      className={`h-1.5 rounded-full transition-all ${
                        i === currentImageIndex
                          ? 'w-5 bg-white'
                          : 'w-1.5 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentImageIndex((i) => Math.max(i - 1, 0))
                  }
                  disabled={currentImageIndex === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center disabled:opacity-30 text-lg"
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex((i) => Math.min(i + 1, total - 1))
                  }
                  disabled={currentImageIndex === total - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center disabled:opacity-30 text-lg"
                >
                  ›
                </button>
              </>
            )}
          </div>

          <div className="px-6 py-5 space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {car.make}{' '}
                  <span className="text-gray-400 font-medium">
                    {car.carModel}
                  </span>
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {car.carType} • {car.city}
                  {car.carLocation && `, ${car.carLocation}`}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-500">
                  €{car.pricePerDay}
                </div>
                <div className="text-xs text-gray-400">/ day</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {specs.map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5"
                >
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <span>{icon}</span> {label}
                  </div>
                  <div className="text-sm font-medium text-gray-800">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {car.description && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Description
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {car.description}
                </p>
              </div>
            )}

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Owner
              </p>
              {owner ? (
                <OwnerCard owner={owner} />
              ) : (
                <p className="text-sm text-gray-400">No owner info available</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-white">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            How it works
          </button>
          <button
            onClick={onBookNow}
            className="flex-1 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
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
