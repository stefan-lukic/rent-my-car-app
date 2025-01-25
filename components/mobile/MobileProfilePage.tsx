import { ICar } from '@/lib/model/car/Car';
import { IUser } from '@/lib/model/User';
import Image from 'next/image';
import { RentalWithCar } from '@/types/RentalWithCar';
import MobileProfileInteractiveSection from './MobileProfileInteractiveSection';

interface MobileProfilePageProps {
  user: IUser;
  cars: ICar[];
  rentals: RentalWithCar[];
}

const MobileProfilePage = ({ user, cars, rentals }: MobileProfilePageProps) => {
  return (
    <div className="h-screen pb-16 bg-gray-50 p-2 flex flex-col">
      <div className="bg-white rounded-md shadow-sm overflow-hidden mb-4">
        <div className="flex flex-col items-center p-1 bg-gradient-to-br from-blue-500 to-blue-700">
          <Image
            className="rounded-full shadow-md mb-2 border-2 border-white"
            src={user?.images?.[0] || ''}
            alt={user?.name}
            width={70}
            height={70}
            priority={true}
          />
          <h2 className="text-sm font-semibold text-white text-center truncate w-full">
            {user.name}
          </h2>
          <p className="text-xs text-blue-100 text-center truncate w-full">
            {user.email}
          </p>
        </div>

        <div className="p-2">
          <h2 className="text-sm font-semibold text-gray-800 mb-1">
            Account Information
          </h2>
          <p className="text-xs text-gray-600">
            Member since: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="h-full flex-1 overflow-auto pb-16">
        <MobileProfileInteractiveSection cars={cars} rentals={rentals} />
      </div>
    </div>
  );
};

export default MobileProfilePage;
