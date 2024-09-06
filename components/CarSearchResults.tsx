import React from 'react';
import { ICar } from '@/lib/model/car/Car';

interface SearchResultsProps {
  car: ICar;
  startDate: Date | null;
  endDate: Date | null;
  onBookNow: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ car, onBookNow }) => {
  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          className="w-full h-full object-cover transform"
          src={car.image || '/placeholder-car.jpg'}
          alt={car.carModel}
        />
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
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            onClick={onBookNow}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
