'use client';

import { ICar } from '@/lib/model/Car';
import { IUser } from '@/lib/model/User';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from './UI/Button';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<IUser>();
  const [cars, setCars] = useState<ICar[]>([]);

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
        .then((data) => setUser(data))
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, [session]);

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        My Profile
      </h1>

      <Button className="mb-4" onClick={() => router.push('/cars/add-car')}>
        Add Car
      </Button>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-gray-100 p-8 flex flex-col items-center">
            <Image
              className="rounded-full shadow-md mb-4"
              src={user?.image || '/default-profile.png'}
              alt={user?.name}
              width={100}
              height={100}
              priority={true}
            />

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {user.name}
            </h2>
            <p className="text-gray-600 mb-4">{user.email}</p>
            {/* <p className="text-sm text-gray-500">Member since: {new Date(user.createdAt).toLocaleDateString()}</p> */}
          </div>
          <div className="md:w-2/3 p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                My Cars
              </h2>
              {/* {cars.length === 0 ? (
                <p className="text-gray-600">You haven't listed any cars yet.</p>
              ) : (
                <ul className="space-y-2">
                  {cars.map((car) => (
                    <li key={car.id} className="bg-gray-50 p-3 rounded-md shadow-sm">
                      <span className="font-medium">{car.make} {car.model}</span>
                      <span className="text-gray-600 ml-2">({car.year})</span>
                      <span className="float-right text-green-600">${car.pricePerDay}/day</span>
                    </li>
                  ))}
                </ul>
              )} */}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
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
    </div>
  );
};

export default ProfilePage;
