'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICar } from '@/lib/model/car/Car';
import { IUser } from '@/lib/model/User';
import { RentalWithCar } from '@/types/RentalWithCar';
import { OwnerBooking } from '@/types/OwnerBooking';
import MobileProfileInteractiveSection from './MobileProfileInteractiveSection';
import MobileProfileUserInfoCard from './MobileUserProfileInfoCard';
import IncomingBookingsSection from '../IncomingBookingsSection';
import l from '@/helper/en';
import { CalendarDays, CarFront, Plus, Search } from 'lucide-react';

interface MobileProfilePageProps {
  user: IUser;
  cars: ICar[];
  rentals: RentalWithCar[];
  ownerBookings: OwnerBooking[];
  currentDate: string;
}

const MobileProfilePage = ({
  user,
  cars,
  rentals,
  ownerBookings,
  currentDate,
}: MobileProfilePageProps) => {
  const [activeTab, setActiveTab] = useState<'cars' | 'rentals'>('cars');
  const router = useRouter();
  const visibleRentalsCount = rentals.filter(
    (rental) => rental.car !== null
  ).length;

  return (
    <main className="min-h-screen bg-surface px-4 pb-24 pt-4">
      <div className="mx-auto max-w-xl space-y-4">
        <MobileProfileUserInfoCard
          user={user}
          carsCount={cars.length}
          rentalsCount={visibleRentalsCount}
        />
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => router.push('/cars/add-car')}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-3 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            {l.profile.addNewCar}
          </button>
          <button
            type="button"
            onClick={() => router.push('/#car-search')}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-brand-light bg-white px-3 py-3.5 text-sm font-semibold text-brand shadow-sm transition-colors hover:bg-brand-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <Search className="h-4 w-4" />
            Browse Cars
          </button>
        </div>

        <IncomingBookingsSection
          bookings={ownerBookings}
          currentDate={currentDate}
        />

        <div
          role="tablist"
          aria-label="Profile activity"
          className="flex gap-1 rounded-2xl border border-border bg-white p-1.5 shadow-sm"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'cars'}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
              activeTab === 'cars' ? 'bg-brand-tint text-brand' : 'text-body'
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
              activeTab === 'rentals' ? 'bg-brand-tint text-brand' : 'text-body'
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
            currentDate={currentDate}
          />
        </div>
      </div>
    </main>
  );
};

export default MobileProfilePage;
