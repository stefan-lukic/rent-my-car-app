import { ICar } from '@/lib/model/car/Car';
import { IUser } from '@/lib/model/User';
import Image from 'next/image';
import { RentalWithCar } from '@/types/RentalWithCar';
import ProfileInteractiveSection from './ProfileInteractiveSection';

interface ProfilePageProps {
  user: IUser;
  cars: ICar[];
  rentals: RentalWithCar[];
}

const ProfilePage = ({ user, cars, rentals }: ProfilePageProps) => {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
        <div className="flex flex-row h-48">
          <div className="w-1/4 bg-gradient-to-br from-blue-400 to-blue-600 p-4 flex flex-col items-center justify-center">
            <Image
              className="rounded-full shadow-lg mb-2 border-2 border-white"
              src={user?.images?.[0] || ''}
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
      <ProfileInteractiveSection cars={cars} rentals={rentals} />
    </div>
  );
};

export default ProfilePage;
