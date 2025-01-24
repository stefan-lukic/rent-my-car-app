'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICar } from '@/lib/model/car/Car';
import { RentalWithCar } from '@/types/RentalWithCar';
import CarCard from './CarCard';
import RentalCard from './RentalCard';
import UpdateCarModal from './UpdateCarModal';
import ReactPaginate from 'react-paginate';
import { Button } from './UI/Button';

interface ProfileInteractiveSectionProps {
  cars: ICar[];
  rentals: RentalWithCar[];
}

const ProfileInteractiveSection = ({
  cars: initialCars,
  rentals: initialRentals,
}: ProfileInteractiveSectionProps) => {
  const [cars, setCars] = useState<ICar[]>(initialCars);
  const [selectedCar, setSelectedCar] = useState<ICar | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [carsPerPage] = useState(4);
  const [currentRentalPage, setCurrentRentalPage] = useState(0);

  const router = useRouter();

  const rentalsPerPage = 4;
  const handleUpdateCar = (updatedCar: ICar) => {
    setCars(cars.map((car) => (car._id === updatedCar._id ? updatedCar : car)));
    setIsUpdateModalOpen(false);
  };

  const pageCount = Math.ceil(cars.length / carsPerPage);
  const offset = currentPage * carsPerPage;
  const currentCars = cars.slice(offset, offset + carsPerPage);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const rentalPageCount = Math.ceil(initialRentals.length / rentalsPerPage);
  const rentalOffset = currentRentalPage * rentalsPerPage;
  const currentRentals = initialRentals.slice(
    rentalOffset,
    rentalOffset + rentalsPerPage
  );

  const handleRentalPageChange = ({ selected }: { selected: number }) => {
    setCurrentRentalPage(selected);
  };

  return (
    <div className="flex flex-col overflow-x-hidden">
      <Button
        onClick={() => router.push('/cars/add-car')}
        className="bg-green-500 text-white hover:bg-green-600"
      >
        Add New
      </Button>

      <div className="mb-6 flex">
        <div className="w-1/2 pr-4">
          <h2 className="text-xl font-semibold text-gray-800">My Cars</h2>
          {cars.length === 0 ? (
            <p className="text-gray-600 italic">
              You haven`t listed any cars yet.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentCars.map((car) => (
                  <CarCard
                    key={car._id}
                    car={car}
                    onUpdate={() => {
                      setSelectedCar(car);
                      setIsUpdateModalOpen(true);
                    }}
                  />
                ))}
              </div>
              <ReactPaginate
                previousLabel={'Prev'}
                nextLabel={'Next'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={
                  'pagination flex justify-left mt-6 space-x-2'
                }
                pageClassName={
                  'px-1 py-1 text-sm rounded-md bg-blue-100 text-blue-600'
                }
                pageLinkClassName={''}
                previousClassName={
                  'px-1 py-1 text-sm rounded-md bg-blue-500 text-white'
                }
                nextClassName={
                  'px-1 py-1 text-sm rounded-md bg-blue-500 text-white'
                }
                breakClassName={'px-3 py-2'}
                activeClassName={'bg-blue-500 text-white'}
              />
            </>
          )}
        </div>
        <div className="w-1/2">
          <h2 className="text-xl font-semibold text-gray-800">My Rentals</h2>
          {currentRentals.length === 0 ? (
            <p className="text-gray-600 italic">
              You haven`t rented any cars yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-2 w-full max-w-lg">
              {currentRentals.map((rental) => (
                <RentalCard key={rental._id} rental={rental} />
              ))}
            </div>
          )}
          <ReactPaginate
            previousLabel={'Prev'}
            nextLabel={'Next'}
            breakLabel={'...'}
            pageCount={rentalPageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handleRentalPageChange}
            containerClassName={'pagination flex justify-left mt-6 space-x-2'}
            pageClassName={
              'px-1 py-1 text-sm rounded-md bg-blue-100 text-blue-600'
            }
            previousClassName={
              'px-1 py-1 text-sm rounded-md bg-blue-500 text-white'
            }
            nextClassName={
              'px-1 py-1 text-sm rounded-md bg-blue-500 text-white'
            }
            breakClassName={'px-3 py-2'}
            activeClassName={'bg-blue-500 text-white'}
          />
        </div>
      </div>

      {selectedCar && (
        <UpdateCarModal
          isOpen={isUpdateModalOpen}
          car={selectedCar}
          onUpdate={handleUpdateCar}
          onClose={() => setIsUpdateModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileInteractiveSection;
