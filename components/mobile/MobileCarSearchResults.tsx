import React, { useState } from 'react';
import { ICar } from '@/lib/model/car/Car';
import Image from 'next/image';

interface CarSearchResultsProps {
  car: ICar;
  onBookNow: () => void;
  onViewDetails: () => void;
}

const MobileCarSearchResults: React.FC<CarSearchResultsProps> = ({
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
    <div className="flex flex-col bg-gray-100 rounded-lg overflow-hidden shadow-md pb-2">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={car.images?.[currentImageIndex] || '/placeholder-car.jpg'}
          alt={car.carModel}
          width={450}
          height={450}
          className=" h-40 object-cover rounded-md"
        />
        {car.images && car.images.length > 1 && (
          <div className="absolute inset-0 bottom-0 flex justify-between items-center">
            <button
              className={`text-white p-2 rounded-full hover:bg-gray-700 transition-colors text-2xl ${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handlePrevImage}
              disabled={currentImageIndex === 0}
            >
              &lt;
            </button>
            <button
              className={`text-white p-2 rounded-full hover:bg-gray-700 transition-colors text-2xl ${currentImageIndex === car.images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleNextImage}
              disabled={currentImageIndex === car.images.length - 1}
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      <div className="mt-2">
        <h3 className="text-lg font-bold">{car.carModel}</h3>
        <p className="text-gray-500">{car.city}</p>
        <p className="text-green-600 font-semibold">${car.pricePerDay}/day</p>
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 w-full text-white px-3 py-2 text-sm rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap"
            onClick={onBookNow}
          >
            Book
          </button>
          <button
            className="bg-blue-500 w-full text-white px-3 py-2 text-sm rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap"
            onClick={onViewDetails}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileCarSearchResults;
