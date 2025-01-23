'use client';

import { useState } from 'react';
import CarFilters from '@/components/CarFilters';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import MobileCarRentalSearch from './MobileCarRentalSearch';

export default function MobileCarSearchView() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<CarFilterState>({
    minPrice: '',
    maxPrice: '',
    make: '',
    carType: '',
    engine: '',
  });

  return (
    <div className="h-full bg-gray-100 flex flex-col w-full">
      <button onClick={() => setShowFilters((prev) => !prev)}>Filters</button>
      {showFilters && <CarFilters filters={filters} setFilters={setFilters} />}
      <MobileCarRentalSearch filters={filters} />
    </div>
  );
}
