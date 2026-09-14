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
import RentalStatusFilter from '../RentalStatusFilter';
import {
  getRentalLifecycleStatus,
  RentalLifecycleStatus,
  RentalStatusFilterValue,
} from '@/lib/rentalLifecycle';

interface MobileProfileInteractiveSectionProps {
  cars: ICar[];
  rentals: RentalWithCar[];
  activeTab: string;
  currentDate: string;
}

const MobileProfileInteractiveSection = ({
  cars: initialCars,
  rentals,
  activeTab,
  currentDate,
}: MobileProfileInteractiveSectionProps) => {
  const [cars, setCars] = useState<ICar[]>(initialCars);
  const [selectedCar, setSelectedCar] = useState<ICar | null>(null);
  const [carIdToDelete, setCarIdToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rentalsState, setRentalsState] = useState<RentalWithCar[]>(rentals);
  const [rentalToCancelId, setRentalToCancelId] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [rentalStatusFilter, setRentalStatusFilter] =
    useState<RentalStatusFilterValue>('all');

  const availableRentals = rentalsState.filter((rental) => rental.car !== null);
  const rentalCounts = availableRentals.reduce(
    (counts, rental) => {
      const status = getRentalLifecycleStatus(rental, currentDate);
      counts.all += 1;
      counts[status] += 1;
      return counts;
    },
    {
      all: 0,
      [RentalLifecycleStatus.Upcoming]: 0,
      [RentalLifecycleStatus.Ongoing]: 0,
      [RentalLifecycleStatus.Completed]: 0,
      [RentalLifecycleStatus.Cancelled]: 0,
    }
  );
  const filteredRentals = availableRentals.filter(
    (rental) =>
      rentalStatusFilter === 'all' ||
      getRentalLifecycleStatus(rental, currentDate) === rentalStatusFilter
  );

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

  const handleRentalReviewed = (
    rentalId: string,
    review: NonNullable<RentalWithCar['clientReview']>
  ) => {
    setRentalsState((currentRentals) =>
      currentRentals.map((rental) =>
        rental._id === rentalId ? { ...rental, clientReview: review } : rental
      )
    );
  };

  return (
    <section className="pt-1">
      {activeTab === 'cars' && (
        <div>
          {cars.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-tint text-brand">
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
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-tint text-brand">
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
              <RentalStatusFilter
                value={rentalStatusFilter}
                counts={rentalCounts}
                label="Filter my rentals by status"
                onChange={setRentalStatusFilter}
              />
              {filteredRentals.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm text-slate-500">
                  No reservations match this status.
                </div>
              ) : null}
              {filteredRentals.map((rental) => (
                <MobileRentalCard
                  key={rental._id}
                  rental={rental}
                  currentDate={currentDate}
                  onReviewed={handleRentalReviewed}
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
