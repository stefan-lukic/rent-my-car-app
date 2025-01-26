import React, { useState } from 'react';
import { ICar } from '@/lib/model/car/Car';
import Image from 'next/image';

interface SearchResultsProps {
  car: ICar;
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
          <div className="flex flex-row justify-between align-center items-center">
            <div className="flex flex-col justify-start align-start items-start">
              <p className="text-black">Make: </p>
              <p className="text-black">Model:</p>
              <p className="text-black">Type:</p>
              <p className="text-black">Engine:</p>
              <p className="text-black">Avg/100km:</p>
              <p className="text-black">City:</p>
              <p className="text-black">Location:</p>
              <p className="text-black">Price per day:</p>
            </div>

            <div className="flex flex-col">
              <p className="text-black font-bold">
                {car.make.charAt(0).toUpperCase() +
                  car.make.slice(1).toLowerCase()}
              </p>
              <p className="text-black font-bold">{car.carModel}</p>
              <p className="text-black">
                {car.carType.charAt(0).toUpperCase() +
                  car.carType.slice(1).toLowerCase()}
              </p>
              <p className="text-black">
                {car.engine.charAt(0).toUpperCase() +
                  car.engine.slice(1).toLowerCase()}
              </p>
              <p className="text-black">{car.averageConsumption} l/100km</p>
              <p className="text-black">{car.city}</p>
              <p className="text-black">{car.carLocation}</p>
              <p className="text-green-500 font-bold">€{car.pricePerDay}/day</p>
            </div>
          </div>

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
