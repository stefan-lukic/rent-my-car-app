import React, { useState } from 'react';
import { ICar } from '@/lib/model/car/Car';
import Image from 'next/image';

interface SearchResultsProps {
  car: ICar;
  startDate: Date | null;
  endDate: Date | null;
  onBookNow: () => void;
  onViewDetails: () => void;
}

const CarSearchResults: React.FC<SearchResultsProps> = ({
  car,
  onBookNow,
  onViewDetails,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={car.images?.[currentImageIndex] || '/placeholder-car.jpg'}
          alt={car.carModel}
          width={500}
          height={300}
          className="object-cover"
        />
        {car.images && car.images.length > 1 && (
          <div className="absolute inset-0 flex justify-between items-center">
            <button
              className={`text-white p-4 rounded-full hover:bg-gray-700 transition-colors text-2xl ${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handlePrevImage}
              disabled={currentImageIndex === 0}
            >
              &lt;
            </button>
            <button
              className={`text-white p-4 rounded-full hover:bg-gray-700 transition-colors text-2xl ${currentImageIndex === car.images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleNextImage}
              disabled={currentImageIndex === car.images.length - 1}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold">{car.carModel}</h3>
          <p className="text-gray-600">{car.city}</p>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-lg font-bold text-green-600">
            ${car.pricePerDay}/day
          </span>
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap"
              onClick={onBookNow}
            >
              Book
            </button>
            <button
              className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap"
              onClick={onViewDetails}
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarSearchResults;
