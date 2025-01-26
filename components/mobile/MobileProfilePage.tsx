'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICar } from '@/lib/model/car/Car';
import { IUser } from '@/lib/model/User';
import { RentalWithCar } from '@/types/RentalWithCar';
import MobileProfileInteractiveSection from './MobileProfileInteractiveSection';
import MobileProfileUserInfoCard from './MobileUserProfileInfoCard';
import { Button } from '../UI/Button';

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
      <div className="bg-white rounded-md shadow-sm overflow-hidden mb-4">
        <MobileProfileUserInfoCard user={user} />
      </div>

      <Button
        onClick={() => router.push('/cars/add-car')}
        className="bg-blue-500 text-white hover:bg-blue-600"
      >
        Add New
      </Button>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-300">
        <button
          className={`py-2 px-4 ${
            activeTab === 'cars'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('cars')}
        >
          My Cars
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === 'rentals'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('rentals')}
        >
          My Rentals
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
