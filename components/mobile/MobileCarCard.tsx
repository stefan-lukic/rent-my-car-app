import Image from 'next/image';
import { ICar } from '@/lib/model/car/Car';
import { useState } from 'react';
import { Button } from '../UI/Button';

interface MobileCarCardProps {
  car: ICar;
  onUpdate: (car: ICar) => void;
}

const MobileCarCard: React.FC<MobileCarCardProps> = ({ car, onUpdate }) => {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-40 w-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={car.images?.[currentImageIndex] || '/placeholder-car.jpg'}
            alt={`${car.make} ${car.carModel}`}
            layout="fill"
            objectFit="cover"
            className="transition-opacity duration-300 hover:opacity-90"
          />
          {car.images && car.images.length > 1 && (
            <div className="absolute left-2 right-2 inset-0 flex justify-between items-center">
              <button
                className={`text-white p-1 rounded-full bg-gray-800 hover:bg-gray-600 transition-colors ${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handlePrevImage}
                disabled={currentImageIndex === 0}
              >
                &lt;
              </button>
              <button
                className={`text-white p-1 rounded-full bg-gray-800 hover:bg-gray-600 transition-colors ${currentImageIndex === car.images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleNextImage}
                disabled={currentImageIndex === car.images.length - 1}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm text-base text-gray-800 truncate">
          {car.make} {car.carModel}
        </h3>
        <div className="flex flex-row gap-2">
          <p className="text-sm text-gray-600">{car.engine}</p>
          <p className="text-blue-500 font-medium text-sm">{car.power} hp</p>
        </div>
        <h3 className="text-sm text-base text-gray-800 truncate">{car.city}</h3>
        <h3 className="text-sm text-base text-gray-800 truncate">
          {car.carLocation}
        </h3>
        <div className="flex justify-between items-center mt-1">
          <Button
            className="h-8 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition duration-300"
            onClick={() => onUpdate(car)}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileCarCard;
