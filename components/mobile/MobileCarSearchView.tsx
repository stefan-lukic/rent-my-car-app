'use client';

import { useState } from 'react';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import MobileCarRentalSearch from './MobileCarRentalSearch';
import MobileCarFilters from './MobileCarFilters';

export default function MobileCarSearchView() {
  const [filters, setFilters] = useState<CarFilterState>({
    minPrice: '',
    maxPrice: '',
    make: '',
    carType: '',
    engine: '',
  });

  return (
    <div className="h-full bg-gray-100 flex flex-col w-full">
      <MobileCarFilters filters={filters} setFilters={setFilters} />
      <MobileCarRentalSearch filters={filters} />
    </div>
  );
}
