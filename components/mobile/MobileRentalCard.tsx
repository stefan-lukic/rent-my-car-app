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
    <div className="bg-white rounded shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-40 w-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={
              rental.car.images?.[currentImageIndex] || '/placeholder-car.svg'
            }
            alt={`${rental.car.make} ${rental.car.carModel}`}
            layout="fill"
            objectFit="cover"
            className="transition-opacity duration-300 hover:opacity-90 rounded"
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
      <div className="p-2">
        <p className="text-sm text-black-600">
          <span className="font-bold text-black">Car: </span>
          {rental.car.make} {rental.car.carModel}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-bold text-black">Location: </span>
          {rental.car.city}, {rental.car.carLocation}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-bold text-black">Rented from:</span>{' '}
          {new Date(rental.rentalPeriod.startDate).toLocaleDateString()} -{' '}
          {new Date(rental.rentalPeriod.endDate).toLocaleDateString()}
        </p>
        <p className="text-sm text-red-500">
          <span className="font-bold text-black">Total Cost:</span> $
          {rental.totalCost}
        </p>
      </div>
    </div>
  );
};

export default MobileRentalCard;
