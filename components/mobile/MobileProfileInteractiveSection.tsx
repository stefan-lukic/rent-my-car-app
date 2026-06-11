'use client';

import { useState } from 'react';
import { ICar } from '@/lib/model/car/Car';
import { RentalWithCar } from '@/types/RentalWithCar';
import UpdateCarModal from '../UpdateCarModal';
import DeleteCarModal from '../DeleteCarModal';
import MobileCarCard from './MobileCarCard';
import MobileRentalCard from './MobileRentalCard';
import { useRouter } from 'next/navigation';

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
  const [carToDelete, setCarToDelete] = useState<ICar | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  const handleUpdateCar = (updatedCar: ICar) => {
    setCars(cars.map((car) => (car._id === updatedCar._id ? updatedCar : car)));
    setSelectedCar(null);
  };

  const handleDeleteCar = (carId: string) => {
    setCars(cars.filter((car) => car._id !== carId));
  };

  return (
    <div className="flex flex-col space-y-2 pt-2">
      {activeTab === 'cars' && (
        <div>
          {cars.length === 0 ? (
            <p className="text-gray-600 italic">
              You haven't listed any cars yet.
            </p>
          ) : (
            <div className="space-y-2">
              {cars.map((car) => (
                <MobileCarCard
                  key={car._id}
                  car={car}
                  onUpdate={() => setSelectedCar(car)}
                  onDeleteClick={(car) => {
                    setCarToDelete(car);
                    setIsDeleteModalOpen(true);
                  }}
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
              You haven't rented any cars yet.
            </p>
          ) : (
            <div className="space-y-2">
              {initialRentals.map((rental) => (
                <MobileRentalCard key={rental._id} rental={rental} />
              ))}
            </div>
          )}
        </div>
      )}

      {selectedCar && (
        <UpdateCarModal
          isOpen={!!selectedCar}
          car={selectedCar}
          onUpdate={handleUpdateCar}
          onClose={() => setSelectedCar(null)}
        />
      )}

      {carToDelete && (
        <DeleteCarModal
          isOpen={isDeleteModalOpen}
          carId={carToDelete._id}
          onDelete={handleDeleteCar}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setCarToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default MobileProfileInteractiveSection;
