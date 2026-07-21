'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICar } from '@/lib/model/car/Car';
import { RentalWithCar } from '@/types/RentalWithCar';
import CarCard from './CarCard';
import RentalCard from './RentalCard';
import UpdateCarModal from './UpdateCarModal';
import DeleteCarModal from './DeleteCarModal';
import CancelRentalModal from './CancelRentalModal';
import l from '@/helper/en';

interface ProfileInteractiveSectionProps {
  cars: ICar[];
  rentals: RentalWithCar[];
}

const ProfileInteractiveSection = ({
  cars: initialCars,
  rentals: initialRentals,
}: ProfileInteractiveSectionProps) => {
  const [activeTab, setActiveTab] = useState<'cars' | 'rentals'>('cars');
  const [cars, setCars] = useState<ICar[]>(initialCars);
  const [selectedCar, setSelectedCar] = useState<ICar | null>(null);
  const [carToDeleteId, setCarToDeleteId] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentRentalPage, setCurrentRentalPage] = useState(0);
  const [rentals, setRentals] = useState<RentalWithCar[]>(initialRentals);
  const [rentalToCancelId, setRentalToCancelId] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const carsPerPage = 3;
  const rentalsPerPage = 3;
  const router = useRouter();

  const availableRentals = rentals.filter((rental) => rental.car !== null);

  const handleUpdateCar = (updatedCar: ICar) => {
    setCars(cars.map((car) => (car._id === updatedCar._id ? updatedCar : car)));
    setIsUpdateModalOpen(false);
  };

  const handleDeleteCar = (carId: string) => {
    setCars(cars.filter((car) => car._id !== carId));
  };

  const handleCancelRental = (updatedRental: RentalWithCar) => {
    setRentals((prev) =>
      prev.map((rental) =>
        rental._id === updatedRental._id ? updatedRental : rental
      )
    );
  };

  const pageCount = Math.ceil(cars.length / carsPerPage);
  const start = currentPage * carsPerPage;
  const end = start + carsPerPage;
  const currentCars = cars.slice(start, end);

  const rentalPageCount = Math.ceil(availableRentals.length / rentalsPerPage);
  const rentalStartIndex = currentRentalPage * rentalsPerPage;
  const rentalEndIndex = rentalStartIndex + rentalsPerPage;
  const currentRentals = availableRentals.slice(
    rentalStartIndex,
    rentalEndIndex
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-full max-w-xs">
        <button
          onClick={() => setActiveTab('cars')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'cars'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {l.profile.myCarsCount(cars.length)}
        </button>
        <button
          onClick={() => setActiveTab('rentals')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'rentals'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {l.profile.myRentalsCount(availableRentals.length)}
        </button>
      </div>

      {activeTab === 'cars' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {l.profile.myCarsHeading}
            </h2>
            <button
              onClick={() => router.push('/cars/add-car')}
              className="bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
            >
              {l.cars.addNewCarBtn}
            </button>
          </div>

          {cars.length === 0 ? (
            <p className="text-gray-400 italic text-sm">
              {l.profile.noCarsListed}
            </p>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 0}
                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-green-500 text-white text-xl hover:bg-green-600 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                >
                  ‹
                </button>

                <div className="flex-1 grid grid-cols-3 gap-3">
                  {currentCars.map((car) => (
                    <CarCard
                      key={car._id}
                      car={car}
                      onUpdate={() => {
                        setSelectedCar(car);
                        setIsUpdateModalOpen(true);
                      }}
                      onDeleteClick={(car) => {
                        setCarToDeleteId(car._id);
                        setIsDeleteModalOpen(true);
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage >= pageCount - 1}
                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-green-500 text-white text-xl hover:bg-green-600 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                >
                  ›
                </button>
              </div>

              {pageCount > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: pageCount }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === i
                          ? 'bg-green-500 text-white'
                          : 'border border-gray-200 text-gray-500 hover:border-green-400'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'rentals' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {l.profile.myRentalsHeading}
          </h2>

          {availableRentals.length === 0 ? (
            <p className="text-gray-400 italic text-sm">
              {l.profile.noRentalsYet}
            </p>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentRentalPage((p) => p - 1)}
                  disabled={currentRentalPage === 0}
                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-green-500 text-white text-xl hover:bg-green-600 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                >
                  ‹
                </button>

                <div className="flex-1 grid grid-cols-3 gap-3">
                  {currentRentals.map((rental) => (
                    <RentalCard
                      key={rental._id}
                      rental={rental}
                      onCancel={(rentalId) => {
                        setRentalToCancelId(rentalId);
                        setIsCancelModalOpen(true);
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setCurrentRentalPage((p) => p + 1)}
                  disabled={currentRentalPage >= rentalPageCount - 1}
                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-green-500 text-white text-xl hover:bg-green-600 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                >
                  ›
                </button>
              </div>

              {rentalPageCount > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: rentalPageCount }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentRentalPage(i)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentRentalPage === i
                          ? 'bg-green-500 text-white'
                          : 'border border-gray-200 text-gray-500 hover:border-green-400'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {selectedCar && (
        <UpdateCarModal
          isOpen={isUpdateModalOpen}
          car={selectedCar}
          onUpdate={handleUpdateCar}
          onClose={() => setIsUpdateModalOpen(false)}
        />
      )}

      {carToDeleteId && (
        <DeleteCarModal
          isOpen={isDeleteModalOpen}
          carId={carToDeleteId}
          onDelete={handleDeleteCar}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setCarToDeleteId(null);
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

export default ProfileInteractiveSection;
