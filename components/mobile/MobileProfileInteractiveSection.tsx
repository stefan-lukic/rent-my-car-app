'use client';

import { useState } from 'react';
import { ICar } from '@/lib/model/car/Car';
import { RentalWithCar } from '@/types/RentalWithCar';
import UpdateCarModal from '../UpdateCarModal';
import DeleteCarModal from '../DeleteCarModal';
import CancelRentalModal from '../CancelRentalModal';
import MobileCarCard from './MobileCarCard';
import MobileRentalCard from './MobileRentalCard';
import l from '@/helper/en';

interface MobileProfileInteractiveSectionProps {
  cars: ICar[];
  rentals: RentalWithCar[];
  activeTab: string;
}

const MobileProfileInteractiveSection = ({
  cars: initialCars,
  rentals,
  activeTab,
}: MobileProfileInteractiveSectionProps) => {
  const [cars, setCars] = useState<ICar[]>(initialCars);
  const [selectedCar, setSelectedCar] = useState<ICar | null>(null);
  const [carIdToDelete, setCarIdToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rentalsState, setRentalsState] = useState<RentalWithCar[]>(rentals);
  const [rentalToCancelId, setRentalToCancelId] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const availableRentals = rentalsState.filter((rental) => rental.car !== null);

  const handleUpdateCar = (updatedCar: ICar) => {
    setCars(cars.map((car) => (car._id === updatedCar._id ? updatedCar : car)));
    setSelectedCar(null);
  };

  const handleDeleteCar = (carId: string) => {
    setCars(cars.filter((car) => car._id !== carId));
  };

  const handleCancelRental = (updatedRental: RentalWithCar) => {
    setRentalsState((prev) =>
      prev.map((rental) =>
        rental._id === updatedRental._id ? updatedRental : rental
      )
    );
  };

  return (
    <div className="flex flex-col space-y-2 pt-2">
      {activeTab === 'cars' && (
        <div>
          {cars.length === 0 ? (
            <p className="text-gray-600 italic">{l.profile.noCarsListed}</p>
          ) : (
            <div className="space-y-2">
              {cars.map((car) => (
                <MobileCarCard
                  key={car._id}
                  car={car}
                  onUpdate={() => setSelectedCar(car)}
                  onDeleteClick={(carId) => {
                    setCarIdToDelete(carId);
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
          {availableRentals.length === 0 ? (
            <p className="text-gray-600 italic">{l.profile.noRentalsYet}</p>
          ) : (
            <div className="space-y-2">
              {availableRentals.map((rental) => (
                <MobileRentalCard
                  key={rental._id}
                  rental={rental}
                  onCancel={(rentalId) => {
                    setRentalToCancelId(rentalId);
                    setIsCancelModalOpen(true);
                  }}
                />
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

      {carIdToDelete && (
        <DeleteCarModal
          isOpen={isDeleteModalOpen}
          carId={carIdToDelete}
          onDelete={handleDeleteCar}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setCarIdToDelete(null);
          }}
        />
      )}

      {rentalToCancelId && (
        <CancelRentalModal
          isOpen={isCancelModalOpen}
          rentalId={rentalToCancelId}
          onCancelled={handleCancelRental}
          onClose={() => {
            setIsCancelModalOpen(false);
            setRentalToCancelId(null);
          }}
        />
      )}
    </div>
  );
};

export default MobileProfileInteractiveSection;
