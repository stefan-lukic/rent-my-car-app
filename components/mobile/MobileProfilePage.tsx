'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICar } from '@/lib/model/car/Car';
import { IUser } from '@/lib/model/User';
import { RentalWithCar } from '@/types/RentalWithCar';
import MobileProfileInteractiveSection from './MobileProfileInteractiveSection';
import MobileProfileUserInfoCard from './MobileUserProfileInfoCard';
import l from '@/helper/en';
import { CalendarDays, CarFront, Plus } from 'lucide-react';

interface MobileProfilePageProps {
  user: IUser;
  cars: ICar[];
  rentals: RentalWithCar[];
}

const MobileProfilePage = ({ user, cars, rentals }: MobileProfilePageProps) => {
  const [activeTab, setActiveTab] = useState<'cars' | 'rentals'>('cars');
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-24 pt-4">
      <div className="mx-auto max-w-xl space-y-4">
        <MobileProfileUserInfoCard
          user={user}
          carsCount={cars.length}
          rentalsCount={rentals.length}
        />
        <button
          type="button"
          onClick={() => router.push('/cars/add-car')}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          {l.profile.addNewCar}
        </button>

        <div
          role="tablist"
          aria-label="Profile activity"
          className="flex gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'cars'}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
              activeTab === 'cars'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-500'
            }`}
            onClick={() => setActiveTab('cars')}
          >
            <CarFront className="h-4 w-4" />
            {l.profile.myCars}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'rentals'}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
              activeTab === 'rentals'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-500'
            }`}
            onClick={() => setActiveTab('rentals')}
          >
            <CalendarDays className="h-4 w-4" />
            {l.profile.myRentals}
          </button>
        </div>

        <div>
          <MobileProfileInteractiveSection
            cars={cars}
            rentals={rentals}
            activeTab={activeTab}
          />
        </div>
      </div>
    </main>
  );
};

export default MobileProfilePage;
