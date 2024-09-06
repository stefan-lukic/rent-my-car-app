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

const ProfilePage = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<IUser>();
  const [cars, setCars] = useState<ICar[]>([]);
  const [selectedCar, setSelectedCar] = useState<ICar | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

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
    }
  }, [session]);

  const handleUpdateCar = (updatedCar: ICar) => {
    setCars(cars.map((car) => (car._id === updatedCar._id ? updatedCar : car)));
    setIsUpdateModalOpen(false);
  };

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8 p-4 text-left text-gray-800">
        My Profile
      </h1>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-gradient-to-br from-blue-400 to-blue-600 p-8 flex flex-col items-center md:h-[calc(100vh-35rem)] md:sticky md:top-24 rounded-[10px]">
            <Image
              className="rounded-full shadow-lg mb-4 border-4 border-white"
              src={user?.image || '/default-profile.png'}
              alt={user?.name}
              width={120}
              height={120}
              priority={true}
            />

            <h2 className="text-2xl font-semibold text-white mb-2">
              {user.name}
            </h2>
            <p className="text-blue-100 mb-4">{user.email}</p>
            <p className="text-sm text-blue-200">
              Member since: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="md:w-2/3 p-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl p-4 font-semibold text-gray-800">
                  My Cars
                </h2>
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => router.push('/cars/add-car')}
                >
                  Add Car
                </Button>
              </div>
              {cars.length === 0 ? (
                <p className="text-gray-600 italic">
                  You haven't listed any cars yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cars.map((car) => (
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
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Account Statistics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {/* <div className="bg-blue-100 p-4 rounded-md">
                  <p className="text-2xl font-bold text-blue-800">{user.totalRentals}</p>
                  <p className="text-sm text-blue-600">Total Rentals</p>
                </div>
                <div className="bg-green-100 p-4 rounded-md">
                  <p className="text-2xl font-bold text-green-800">{user.averageRating.toFixed(1)}</p>
                  <p className="text-sm text-green-600">Average Rating</p>
                </div> */}
              </div>
            </div>
          </div>
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
