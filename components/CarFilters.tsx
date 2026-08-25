'use client';

import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { CarType } from '../lib/model/car/CarType';
import { CarMake } from '../lib/model/car/CarMake';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import { selectArrowStyle } from '@/utils/styles';
import l from '@/helper/en';

interface CarFiltersProps {
  filters: CarFilterState;
  setFilters: React.Dispatch<React.SetStateAction<CarFilterState>>;
}

const emptyFilters: CarFilterState = {
  minPrice: '',
  maxPrice: '',
  make: '',
  carType: '',
  engine: '',
  minSeats: '',
};

const labelClass = 'mb-2 block text-xs font-bold text-slate-600';
const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100';

export default function CarFilters({ filters, setFilters }: CarFiltersProps) {
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-blue-600" />
          <h3 className="font-bold text-slate-900">{l.search.filters}</h3>
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={() => setFilters(emptyFilters)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 transition hover:text-blue-600"
          >
            <X className="h-3.5 w-3.5" /> {l.search.clearFilters}
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>{l.search.priceRangeEur}</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="0"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleInputChange}
              placeholder={l.search.min}
              className={inputClass}
              aria-label={l.search.minPlaceholder}
            />
            <input
              type="number"
              min="0"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleInputChange}
              placeholder={l.search.max}
              className={inputClass}
              aria-label={l.search.maxPlaceholder}
            />
          </div>
        </div>

        <FilterSelect
          label={l.search.carMake}
          name="make"
          value={filters.make}
          onChange={handleInputChange}
          placeholder={l.search.allMakes}
          options={Object.values(CarMake)}
        />
        <FilterSelect
          label={l.search.carType}
          name="carType"
          value={filters.carType}
          onChange={handleInputChange}
          placeholder={l.search.allTypes}
          options={Object.values(CarType)}
        />
        <FilterSelect
          label={l.search.engineType}
          name="engine"
          value={filters.engine}
          onChange={handleInputChange}
          placeholder={l.search.allEngineTypes}
          options={Object.values(CarEngineType)}
        />
        <FilterSelect
          label={l.search.minimumSeats}
          name="minSeats"
          value={filters.minSeats}
          onChange={handleInputChange}
          placeholder={l.search.anyNumberOfSeats}
          options={['2', '4', '5', '6', '7', '8', '9']}
        />
      </div>
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  name: keyof CarFilterState;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function FilterSelect({
  label,
  name,
  value,
  placeholder,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <div>
      <label htmlFor={`desktop-${name}`} className={labelClass}>
        {label}
      </label>
      <select
        id={`desktop-${name}`}
        name={name}
        value={value}
        onChange={onChange}
        style={selectArrowStyle}
        className={`${inputClass} cursor-pointer appearance-none pr-9`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
