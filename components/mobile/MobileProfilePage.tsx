'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICar } from '@/lib/model/car/Car';
import { IUser } from '@/lib/model/User';
import { RentalWithCar } from '@/types/RentalWithCar';
import MobileProfileInteractiveSection from './MobileProfileInteractiveSection';
import MobileProfileUserInfoCard from './MobileUserProfileInfoCard';
import l from '@/helper/en';

interface MobileProfilePageProps {
  user: IUser;
  cars: ICar[];
  rentals: RentalWithCar[];
}

const MobileProfilePage = ({ user, cars, rentals }: MobileProfilePageProps) => {
  const [activeTab, setActiveTab] = useState<'cars' | 'rentals'>('cars');
  const router = useRouter();

  return (
    <div className="h-screen pb-2 bg-gray-50 p-2 flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-3">
        <MobileProfileUserInfoCard
          user={user}
          carsCount={cars.length}
          rentalsCount={rentals.length}
        />
      </div>

      <button
        onClick={() => router.push('/cars/add-car')}
        className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors mb-3"
      >
        <span className="text-lg leading-none">+</span> {l.profile.addNewCar}
      </button>

      <div className="flex border-b border-gray-200 bg-white rounded-t-xl">
        <button
          className={`flex-1 text-center py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'cars'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('cars')}
        >
          {l.profile.myCars}
        </button>
        <button
          className={`flex-1 text-center py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'rentals'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('rentals')}
        >
          {l.profile.myRentals}
        </button>
      </div>

      <div className="h-full flex-1 overflow-auto pb-12">
        <MobileProfileInteractiveSection
          cars={cars}
          rentals={rentals}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
};

export default MobileProfilePage;
