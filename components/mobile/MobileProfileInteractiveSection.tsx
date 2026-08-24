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
import { CarFront, Search } from 'lucide-react';

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
    <section className="pt-1">
      {activeTab === 'cars' && (
        <div>
          {cars.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <CarFront className="h-6 w-6" />
              </span>
              <p className="mt-4 text-sm font-semibold text-slate-800">
                {l.profile.noCarsListed}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Add your first vehicle using the button above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
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
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Search className="h-6 w-6" />
              </span>
              <p className="mt-4 text-sm font-semibold text-slate-800">
                {l.profile.noRentalsYet}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your future reservations will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
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
    </section>
  );
};

export default MobileProfileInteractiveSection;
