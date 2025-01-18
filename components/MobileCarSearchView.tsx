'use client';

import { useState } from 'react';
import CarFilters from '@/components/CarFilters';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import MobileCarRentalSearch from './MobileCarRentalSearch';

export default function MobileCarSearchView() {
  const [filters, setFilters] = useState<CarFilterState>({
    minPrice: '',
    maxPrice: '',
    make: '',
    carType: '',
    engine: '',
  });

  return (
    <div className="h-screen bg-gray-100 flex flex-col w-full">
      <CarFilters filters={filters} setFilters={setFilters} />
      <MobileCarRentalSearch filters={filters} />
    </div>
  );
}
