'use client';

import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarType } from '@/lib/model/car/CarType';
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

const labelClass = 'mb-1.5 block text-xs font-semibold text-slate-600';
const inputClass =
  'w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-ink shadow-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-tint';

export default function MobileCarFilters({
  filters,
  setFilters,
}: CarFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-ink-secondary">
          <SlidersHorizontal className="h-4 w-4 text-brand" />
          {l.search.filters}
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] text-white">
              {activeFilterCount}
            </span>
          )}
          <span className="sr-only">
            {isOpen ? l.search.hideFilters : l.search.showFilters}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="space-y-4 border-t border-slate-100 px-4 pb-4 pt-4">
          <div>
            <label className={labelClass}>{l.search.priceRangeEur}</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min="0"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                placeholder={l.search.min}
                className={inputClass}
                aria-label={l.search.minPlaceholder}
              />
              <input
                type="number"
                min="0"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                placeholder={l.search.max}
                className={inputClass}
                aria-label={l.search.maxPlaceholder}
              />
            </div>
          </div>

          <MobileSelect
            label={l.search.carMake}
            name="make"
            value={filters.make}
            onChange={handleChange}
            placeholder={l.search.allMakes}
            options={Object.values(CarMake)}
          />
          <MobileSelect
            label={l.search.carType}
            name="carType"
            value={filters.carType}
            onChange={handleChange}
            placeholder={l.search.allTypes}
            options={Object.values(CarType)}
          />
          <MobileSelect
            label={l.search.engineType}
            name="engine"
            value={filters.engine}
            onChange={handleChange}
            placeholder={l.search.allEngineTypes}
            options={Object.values(CarEngineType)}
          />
          <MobileSelect
            label={l.search.minimumSeats}
            name="minSeats"
            value={filters.minSeats}
            onChange={handleChange}
            placeholder={l.search.anyNumberOfSeats}
            options={['2', '4', '5', '6', '7', '8', '9']}
          />

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => setFilters(emptyFilters)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
            >
              <X className="h-4 w-4" /> {l.search.clearFilters}
            </button>
          )}
          <p className="text-center text-[10px] leading-4 text-slate-400">
            {l.search.pricesDisclaimer}
          </p>
        </div>
      )}
    </div>
  );
}

interface MobileSelectProps {
  label: string;
  name: keyof CarFilterState;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function MobileSelect({
  label,
  name,
  value,
  placeholder,
  options,
  onChange,
}: MobileSelectProps) {
  return (
    <div>
      <label htmlFor={`mobile-${name}`} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <select
          id={`mobile-${name}`}
          name={name}
          value={value}
          onChange={onChange}
          className={`${inputClass} pr-9`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}
