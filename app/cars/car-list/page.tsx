'use client';

import l from '@/helper/en';
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
    <div className="bg-slate-50 min-h-[calc(100dvh-48px)] flex flex-col font-sans">
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col flex-grow">
        <div className="bg-blue-500 rounded-2xl p-6 sm:p-8 lg:p-10 mb-8 shadow-sm flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-20 -mb-10 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 relative z-10">
            {l.search.findPerfectRide}
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl relative z-10">
            {l.search.findCompareChoose}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 pb-12 flex-grow">
          <aside className="w-full lg:w-[300px] xl:w-[320px] flex-shrink-0">
            <div className="sticky top-6">
              <CarFilters filters={filters} setFilters={setFilters} />
            </div>
          </aside>

          <div className="w-full flex-1">
            <CarRentalSearch filters={filters} />
          </div>
        </div>
      </main>
    </div>
  );
}
