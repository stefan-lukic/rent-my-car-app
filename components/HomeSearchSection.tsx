'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CarFilters from '@/components/CarFilters';
import CarRentalSearch from '@/components/CarRentalSearch';
import MobileCarFilters from '@/components/mobile/MobileCarFilters';
import MobileCarRentalSearch from '@/components/mobile/MobileCarRentalSearch';
import Skeleton from '@/components/UI/Skeleton';
import useMediaQuery from '@/hooks/useMediaQuery';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import { parseCalendarDate } from '@/lib/utils/calendarDate';

const initialFilters: CarFilterState = {
  minPrice: '',
  maxPrice: '',
  make: '',
  carType: '',
  engine: '',
  minSeats: '',
};

export default function HomeSearchSection() {
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [filters, setFilters] = useState<CarFilterState>(() => ({
    minPrice: searchParams.get('minPrice') ?? initialFilters.minPrice,
    maxPrice: searchParams.get('maxPrice') ?? initialFilters.maxPrice,
    make: searchParams.get('make') ?? initialFilters.make,
    carType: searchParams.get('carType') ?? initialFilters.carType,
    engine: searchParams.get('engine') ?? initialFilters.engine,
    minSeats: searchParams.get('minSeats') ?? initialFilters.minSeats,
  }));
  const initialSearchValues = {
    city: searchParams.get('city') ?? '',
    startDate: parseCalendarDate(searchParams.get('start')),
    endDate: parseCalendarDate(searchParams.get('end')),
  };

  // Delay only the responsive search controls, not the public landing content.
  if (isMobile === null) {
    return <Skeleton className="h-44 w-full bg-white" />;
  }

  if (isMobile) {
    return (
      <MobileCarRentalSearch
        filters={filters}
        initialValues={initialSearchValues}
        persistSearch
        filtersSlot={
          <MobileCarFilters filters={filters} setFilters={setFilters} />
        }
      />
    );
  }

  return (
    <div className="grid items-start gap-6 md:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
      <aside className="sticky top-24">
        <CarFilters filters={filters} setFilters={setFilters} />
      </aside>
      <CarRentalSearch
        filters={filters}
        initialValues={initialSearchValues}
        persistSearch
      />
    </div>
  );
}
