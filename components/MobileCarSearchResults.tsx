import React from 'react';
import { ICar } from '@/lib/model/car/Car';
import Image from 'next/image';

interface CarSearchResultsProps {
  car: ICar;
}

const MobileCarSearchResults: React.FC<CarSearchResultsProps> = ({ car }) => {
  return (
    <div className="h-[380px] bg-gray-100 rounded-lg overflow-hidden shadow-md">
      <Image
        src={car.images?.[0] || '/placeholder-car.jpg'}
        alt={car.carModel}
        width={400}
        height={200}
        className="w-full h-40 object-cover rounded-md"
      />
      <div className="mt-2">
        <h3 className="text-lg font-bold">{car.carModel}</h3>
        <p className="text-gray-500">{car.city}</p>
        <p className="text-green-600 font-semibold">${car.pricePerDay}/day</p>
        <button className="w-full mt-2 py-2 bg-blue-500 text-white rounded-md">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default MobileCarSearchResults;
