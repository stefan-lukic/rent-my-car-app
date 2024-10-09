'use client';

import { ICar } from '@/lib/model/car/Car';
import { IUser } from '@/lib/model/User';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from './UI/Button';
import { useRouter } from 'next/navigation';
import UpdateCarModal from './UpdateCarModal';
import CarCard from './CarCard';
import ReactPaginate from 'react-paginate';
import RentalCard from './RentalCard';
import { RentalWithCar } from '@/types/RentalWithCar';

const ProfilePage = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<IUser>();
  const [cars, setCars] = useState<ICar[]>([]);
  const [selectedCar, setSelectedCar] = useState<ICar | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [carsPerPage] = useState(4);
  const [rentals, setRentals] = useState<RentalWithCar[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/users?email=${encodeURIComponent(session.user.email)}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch user data');
          }
          return res.json();
        })
        .then((data) => {
          setUser(data);
          return fetch(`/api/cars/my-cars?userId=${data._id}`);
        })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch cars data');
          }
          return res.json();
        })
        .then((carsData) => setCars(carsData))
        .catch((error) => console.error('Error fetching data:', error));

      fetch(`/api/my-rentals?userId=${session.user.id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch rentals data');
          }
          return res.json();
        })
        .then((rentalData) => {
          setRentals(rentalData);
        })
        .catch((error) => console.error('Error fetching rentals:', error));
    }
  }, [session]);

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

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
        <div className="flex flex-row h-48">
          <div className="w-1/4 bg-gradient-to-br from-blue-400 to-blue-600 p-4 flex flex-col items-center justify-center">
            <Image
              className="rounded-full shadow-lg mb-2 border-2 border-white"
              src={user?.image || '/default-profile.png'}
              alt={user?.name}
              width={64}
              height={64}
              priority={true}
            />
            <h2 className="text-lg font-semibold text-white mb-1 truncate w-full text-center">
              {user.name}
            </h2>
            <p className="text-blue-100 text-xs truncate w-full text-center">
              {user.email}
            </p>
          </div>
          <div className="w-3/4 p-4 flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Account Information
            </h2>
            <p className="text-sm text-gray-600">
              Member since: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

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
                previousLabel={'Previous'}
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
                  'px-2 py-1 text-sm rounded-md bg-blue-100 text-blue-600'
                }
                pageLinkClassName={''}
                previousClassName={
                  'px-2 py-1 text-sm rounded-md bg-blue-500 text-white'
                }
                nextClassName={
                  'px-2 py-1 text-sm rounded-md bg-blue-500 text-white'
                }
                breakClassName={'px-3 py-2'}
                activeClassName={'bg-blue-500 text-white'}
              />
            </>
          )}
        </div>
        <div className="w-1/2 pl-4">
          <h2 className="text-xl font-semibold text-gray-800">
            My Booked Cars
          </h2>
          {rentals.length === 0 ? (
            <p className="text-gray-600 italic">
              You haven't booked any cars yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rentals.map((rental) => (
                <RentalCard key={rental._id} rental={rental} />
              ))}
            </div>
          )}
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

export default ProfilePage;
