'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICar } from '@/lib/model/car/Car';
import { RentalWithCar } from '@/types/RentalWithCar';
import { Button } from '../UI/Button';
import ReactPaginate from 'react-paginate';
import UpdateCarModal from '../UpdateCarModal';
import MobileCarCard from './MobileCarCard';
import MobileRentalCard from './MobileRentalCard';

interface MobileProfileInteractiveSectionProps {
  cars: ICar[];
  rentals: RentalWithCar[];
}

const MobileProfileInteractiveSection = ({
  cars: initialCars,
  rentals: initialRentals,
}: MobileProfileInteractiveSectionProps) => {
  const [cars, setCars] = useState<ICar[]>(initialCars);
  const [selectedCar, setSelectedCar] = useState<ICar | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [carsPerPage] = useState(2);
  const [currentRentalPage, setCurrentRentalPage] = useState(0);
  const router = useRouter();

  const rentalsPerPage = 2;

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
    <div className="flex flex-col space-y-4 px-4">
      <Button
        onClick={() => router.push('/cars/add-car')}
        className="bg-blue-500 text-white hover:bg-blue-600"
      >
        Add New
      </Button>

      <div>
        <h2 className="text-lg font-semibold text-gray-800">My Cars</h2>
        {cars.length === 0 ? (
          <p className="text-gray-600 italic">
            You haven`t listed any cars yet.
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {currentCars.map((car) => (
                <MobileCarCard
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
              marginPagesDisplayed={1}
              pageRangeDisplayed={2}
              onPageChange={handlePageChange}
              containerClassName={
                'pagination flex justify-center mt-4 space-x-2'
              }
              pageClassName={
                'px-2 py-1 text-sm rounded-md bg-blue-100 text-blue-600'
              }
              previousClassName={
                'px-2 py-1 text-sm rounded-md bg-blue-500 text-white'
              }
              nextClassName={
                'px-2 py-1 text-sm rounded-md bg-blue-500 text-white'
              }
              activeClassName={'bg-blue-500 text-white'}
            />
          </>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800">My Rentals</h2>
        {currentRentals.length === 0 ? (
          <p className="text-gray-600 italic">
            You haven`t rented any cars yet.
          </p>
        ) : (
          <div className="space-y-4">
            {currentRentals.map((rental) => (
              <MobileRentalCard key={rental._id} rental={rental} />
            ))}
          </div>
        )}
        <ReactPaginate
          previousLabel={'Prev'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={rentalPageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={handleRentalPageChange}
          containerClassName={'pagination flex justify-center mt-4 space-x-2'}
          pageClassName={
            'px-2 py-1 text-sm rounded-md bg-blue-100 text-blue-600'
          }
          previousClassName={
            'px-2 py-1 text-sm rounded-md bg-blue-500 text-white'
          }
          nextClassName={'px-2 py-1 text-sm rounded-md bg-blue-500 text-white'}
          activeClassName={'bg-blue-500 text-white'}
        />
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

export default MobileProfileInteractiveSection;
