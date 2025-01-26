import { ICar } from '@/lib/model/car/Car';
import { IUser } from '@/lib/model/User';
import { RentalWithCar } from '@/types/RentalWithCar';
import MobileProfileInteractiveSection from './MobileProfileInteractiveSection';
import MobileProfileUserInfoCard from './MobileUserProfileInfoCard';

interface MobileProfilePageProps {
  user: IUser;
  cars: ICar[];
  rentals: RentalWithCar[];
}

const MobileProfilePage = ({ user, cars, rentals }: MobileProfilePageProps) => {
  return (
    <div className="h-screen pb-2 bg-gray-50 p-2 flex flex-col">
      <div className="bg-white rounded-md shadow-sm overflow-hidden mb-4">
        <MobileProfileUserInfoCard user={user} />
      </div>
      <div className="h-full flex-1 overflow-auto pb-16">
        <MobileProfileInteractiveSection cars={cars} rentals={rentals} />
      </div>
    </div>
  );
};

export default MobileProfilePage;
