'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { IOwner } from '@/lib/model/User';
import OwnerCard from './OwnerCard';
import HowItWorksModal from './HowItWorksModal';
import { ICar } from '@/lib/model/car/Car';

interface CarDetailsDrawerProps {
  car: ICar | null;
  owner: IOwner | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: () => void;
}

const CarDetailsDrawer: React.FC<CarDetailsDrawerProps> = ({
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-gray-900 bg-opacity-70 transition-opacity"
        onClick={onClose}
      />
      <section className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Car Details</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 font-bold text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100 mb-6">
              <Image
                src={car.images?.[currentImageIndex] || '/placeholder-car.svg'}
                alt="Car"
                fill
                className="object-cover"
              />
              {(car.images?.length ?? 0) > 1 && (
                <div className="absolute inset-0 flex justify-between items-center px-2">
                  <button
                    onClick={() =>
                      setCurrentImageIndex((p) => Math.max(0, p - 1))
                    }
                    className="bg-black/40 text-white p-2 rounded-full"
                  >
                    &larr;
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((p) =>
                        Math.min((car.images?.length || 0) - 1, p + 1)
                      )
                    }
                    className="bg-black/40 text-white p-2 rounded-full"
                  >
                    &rarr;
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-extrabold text-gray-900">
                {car.make} {car.carModel}
              </h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-gray-500 font-medium italic">
                  Engine: {car.engine}
                </span>
                <span className="text-gray-500 font-medium italic">
                  Type: {car.carType}
                </span>
                <span className="text-gray-500 font-medium italic text-blue-600">
                  Price: ${car.pricePerDay}/day
                </span>
              </div>
            </div>

            <div className="my-8">{owner && <OwnerCard owner={owner} />}</div>

            <div className="mt-8 space-y-3 pb-10">
              <button
                onClick={onBookNow}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all"
              >
                Book Now
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-gray-50 text-gray-600 py-4 rounded-2xl font-semibold border border-gray-100"
              >
                See How It Works
              </button>
            </div>

            <HowItWorksModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarDetailsDrawer;
