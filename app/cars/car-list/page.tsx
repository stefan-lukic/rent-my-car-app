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
    minSeats: '',
  });

  return (
    <div className="flex min-h-[calc(100dvh-48px)] flex-col bg-surface">
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="relative mb-8 flex flex-col justify-center overflow-hidden rounded-2xl bg-ink-secondary p-6 shadow-sm sm:p-8 lg:p-10">
          <h1 className="relative z-10 mb-2 font-heading text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            {l.search.findPerfectRide}
          </h1>
          <p className="text-brand-tint text-sm sm:text-base max-w-xl relative z-10">
            {l.search.findCompareChoose}
          </p>
        </div>

        <div className="flex flex-grow flex-col gap-6 pb-12 lg:flex-row lg:gap-8">
          <aside className="w-full flex-shrink-0 lg:w-[300px] xl:w-[320px]">
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
