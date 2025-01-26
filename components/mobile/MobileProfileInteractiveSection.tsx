'use client';

import { useState } from 'react';
import { ICar } from '@/lib/model/car/Car';
import { RentalWithCar } from '@/types/RentalWithCar';
import UpdateCarModal from '../UpdateCarModal';
import MobileCarCard from './MobileCarCard';
import MobileRentalCard from './MobileRentalCard';

interface MobileProfileInteractiveSectionProps {
  cars: ICar[];
  rentals: RentalWithCar[];
  activeTab: string;
}

const MobileProfileInteractiveSection = ({
  cars: initialCars,
  rentals: initialRentals,
  activeTab,
}: MobileProfileInteractiveSectionProps) => {
  const [cars, setCars] = useState<ICar[]>(initialCars);
  const [selectedCar, setSelectedCar] = useState<ICar | null>(null);

  const handleUpdateCar = (updatedCar: ICar) => {
    setCars(cars.map((car) => (car._id === updatedCar._id ? updatedCar : car)));
    handleCloseModal();
  };

  const handleOpenModal = (car: ICar) => {
    setSelectedCar(car);
  };

  const handleCloseModal = () => {
    setSelectedCar(null);
  };

  return (
    <div className="flex flex-col space-y-2 pt-2">
      {activeTab === 'cars' && (
        <div>
          {cars.length === 0 ? (
            <p className="text-gray-600 italic">
              You haven`t listed any cars yet.
            </p>
          ) : (
            <div className="space-y-2">
              {cars.map((car) => (
                <MobileCarCard
                  key={car._id}
                  car={car}
                  onUpdate={() => handleOpenModal(car)} // Open modal with selected car
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'rentals' && (
        <div>
          {initialRentals.length === 0 ? (
            <p className="text-gray-600 italic">
              You haven`t rented any cars yet.
            </p>
          ) : (
            <div className="space-y-4">
              {initialRentals.map((rental) => (
                <MobileRentalCard key={rental._id} rental={rental} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Update Car Modal */}
      {selectedCar && (
        <UpdateCarModal
          isOpen={!!selectedCar}
          car={selectedCar}
          onUpdate={handleUpdateCar}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MobileProfileInteractiveSection;
