import { useState } from 'react';
import Image from 'next/image';
import { ICar } from '@/lib/model/car/Car';

interface MobileRentalCardProps {
  rental: {
    _id: string;
    car: ICar;
    rentalPeriod: {
      startDate: Date;
      endDate: Date;
    };
    totalCost: number;
  };
}

const MobileRentalCard: React.FC<MobileRentalCardProps> = ({ rental }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    if (rental.car.images && currentImageIndex < rental.car.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-3 space-y-2">
      <h3 className="text-base font-semibold text-gray-800 truncate">
        {rental.car?.carModel}
      </h3>
      <div className="relative h-40 w-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={
              rental.car.images?.[currentImageIndex] || '/placeholder-car.jpg'
            }
            alt={`${rental.car.make} ${rental.car.carModel}`}
            layout="fill"
            objectFit="cover"
            className="transition-opacity duration-300 hover:opacity-90"
          />
          {rental.car.images && rental.car.images.length > 1 && (
            <div className="absolute left-2 right-2 inset-0 flex justify-between items-center">
              <button
                className={`text-white p-1 rounded-full bg-gray-800 hover:bg-gray-600 transition-colors ${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handlePrevImage}
                disabled={currentImageIndex === 0}
              >
                &lt;
              </button>
              <button
                className={`text-white p-1 rounded-full bg-gray-800 hover:bg-gray-600 transition-colors ${currentImageIndex === rental.car.images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleNextImage}
                disabled={currentImageIndex === rental.car.images.length - 1}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600">
        <span className="font-medium text-gray-700">Car: </span>
        {rental.car.make} {rental.car.carModel}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium text-gray-700">Car: </span>
        {rental.car.city}, {rental.car.carLocation}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium text-gray-700">Rented from:</span>{' '}
        {new Date(rental.rentalPeriod.startDate).toLocaleDateString()} -{' '}
        {new Date(rental.rentalPeriod.endDate).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium text-gray-700">Total Cost:</span> $
        {rental.totalCost}
      </p>
    </div>
  );
};

export default MobileRentalCard;
