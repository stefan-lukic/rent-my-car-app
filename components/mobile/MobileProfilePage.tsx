import { ICar } from '@/lib/model/car/Car';
import { IUser } from '@/lib/model/User';
import Image from 'next/image';
import { RentalWithCar } from '@/types/RentalWithCar';
import ProfileInteractiveSection from '../ProfileInteractiveSection';

interface MobileProfilePageProps {
  user: IUser;
  cars: ICar[];
  rentals: RentalWithCar[];
}

const MobileProfilePage = ({ user, cars, rentals }: MobileProfilePageProps) => {
  return (
    <div className="h-screen bg-gray-50 p-4 overflow-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-500 to-blue-700">
          <Image
            className="rounded-full shadow-lg mb-3 border-4 border-white"
            src={user?.image || ''}
            alt={user?.name}
            width={100}
            height={100}
            priority={true}
          />
          <h2 className="text-xl font-semibold text-white text-center truncate w-full">
            {user.name}
          </h2>
          <p className="text-sm text-blue-100 text-center truncate w-full">
            {user.email}
          </p>
        </div>

        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Account Information
          </h2>
          <p className="text-sm text-gray-600">
            Member since: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <ProfileInteractiveSection cars={cars} rentals={rentals} />
    </div>
  );
};

export default MobileProfilePage;
