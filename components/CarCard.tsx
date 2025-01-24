import Image from 'next/image';
import { Button } from './UI/Button';
import { ICar } from '@/lib/model/car/Car';
import { useState } from 'react';

interface CarCardProps {
  car: ICar;
  onUpdate: (car: ICar) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onUpdate }) => {
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-102">
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={car.images?.[currentImageIndex] || '/placeholder-car.jpg'}
            alt={`${car.make} ${car.carModel}`}
            layout="fill"
            objectFit="contain"
            className="transition-all duration-300 hover:opacity-90 transform"
          />
          {car.images && car.images.length > 1 && (
            <div className="absolute left-2 right-2 inset-0 flex justify-between items-center">
              <button
                className={`text-white p-2 rounded-full hover:bg-gray-700 transition-colors text-xl ${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handlePrevImage}
                disabled={currentImageIndex === 0}
              >
                &lt;
              </button>
              <button
                className={`text-white p-2 rounded-full hover:bg-gray-700 transition-colors text-xl ${currentImageIndex === car.images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleNextImage}
                disabled={currentImageIndex === car.images.length - 1}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800">
          {car.make} {car.carModel}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{car.engine}</p>
        <div className="flex justify-between items-center">
          <span className="text-green-600 font-semibold">{car.power}</span>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition duration-300 ease-in-out"
            onClick={() => onUpdate(car)}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
