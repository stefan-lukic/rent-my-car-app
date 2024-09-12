'use client';

import { useState } from 'react';
import CarFilters from '@/components/CarFilters';
import CarRentalSearch from '@/components/CarRentalSearch';
import { CarFilterState } from '@/lib/model/car/CarFilterState';

export default function CarListPage() {
  const [filters, setFilters] = useState<CarFilterState>({
    minPrice: '',
    maxPrice: '',
    make: '',
    carType: '',
    engine: '',
  });

  return (
    <div className="bg-gray-100 h-[calc(100dvh-48px)] flex flex-col">
      <div className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
            Find Your Perfect Ride
          </h1>
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8">
            <aside className="w-full md:w-1/4">
              <CarFilters filters={filters} setFilters={setFilters} />
            </aside>
            <div className="w-full md:w-3/4">
              <CarRentalSearch filters={filters} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
