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

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-sm">
      <div className="fixed inset-x-0 bottom-0 top-10 bg-white rounded-t-[32px] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="flex flex-col items-center p-4 border-b border-gray-50">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-4" />
          <div className="w-full flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Car Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 bg-gray-100 rounded-full text-gray-500"
            >
              &times;
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 pb-32">
          <div className="relative rounded-3xl overflow-hidden aspect-[16/10] shadow-inner bg-gray-50">
            <Image
              src={car.images?.[currentImageIndex] || '/placeholder-car.svg'}
              alt="Car"
              fill
              className="object-cover"
            />
            {(car.images?.length ?? 0) > 1 && (
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between">
                <button
                  onClick={() =>
                    setCurrentImageIndex((p) => Math.max(0, p - 1))
                  }
                  className="p-3 bg-white/90 rounded-full shadow-lg"
                >
                  &larr;
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex((p) =>
                      Math.min((car.images?.length || 0) - 1, p + 1)
                    )
                  }
                  className="p-3 bg-white/90 rounded-full shadow-lg"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-black text-gray-900 leading-tight">
              {car.make} <span className="text-blue-600">{car.carModel}</span>
            </h2>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400">
                  Engine
                </p>
                <p className="text-sm font-bold text-gray-700">{car.engine}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400">
                  Price
                </p>
                <p className="text-sm font-bold text-blue-600">
                  ${car.pricePerDay}/day
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
              Owner Information
            </p>
            {owner ? (
              <OwnerCard owner={owner} />
            ) : (
              <div className="h-20 bg-gray-50 rounded-2xl animate-pulse" />
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full mt-8 py-4 text-gray-500 font-bold text-sm border-2 border-dashed border-gray-200 rounded-2xl"
          >
            See How It Works
          </button>
        </div>

        <div className="absolute bottom-0 inset-x-0 p-5 bg-white/80 backdrop-blur-md border-t border-gray-100">
          <button
            onClick={onBookNow}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 active:scale-95 transition-all"
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
