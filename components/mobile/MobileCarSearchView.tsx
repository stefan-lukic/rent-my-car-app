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
    minSeats: '',
  });

  return (
    <div className="flex h-full w-full flex-col bg-surface">
      <MobileCarFilters filters={filters} setFilters={setFilters} />
      <MobileCarRentalSearch filters={filters} />
    </div>
  );
}
