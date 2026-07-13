'use client';

import React from 'react';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarType } from '@/lib/model/car/CarType';
import l from '@/helper/en';

interface CarFiltersProps {
  filters: CarFilterState;
  setFilters: React.Dispatch<React.SetStateAction<CarFilterState>>;
}

const capitalize = (str: string) => str.charAt(0) + str.slice(1).toLowerCase();

const labelClass =
  'block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5';
const inputClass =
  'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none';

const MobileCarFilters: React.FC<CarFiltersProps> = ({
  filters,
  setFilters,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
          />
        </svg>
        <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">
          {l.search.filters}
        </span>
      </div>

      <div className="border-b border-gray-100" />

      <div>
        <label className={labelClass}>{l.search.priceRangeEur}</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              €
            </span>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder={l.search.min}
              className="w-full pl-7 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              €
            </span>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder={l.search.max}
              className="w-full pl-7 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>{l.search.carMake}</label>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <select
            name="make"
            value={filters.make}
            onChange={handleChange}
            className={`${inputClass} pl-9`}
          >
            <option value="">{l.search.allManufacturers}</option>
            {Object.values(CarMake).map((make) => (
              <option key={make} value={make}>
                {capitalize(make)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>{l.search.carType}</label>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <select
            name="carType"
            value={filters.carType}
            onChange={handleChange}
            className={`${inputClass} pl-9`}
          >
            <option value="">{l.search.allTypes}</option>
            {Object.values(CarType).map((type) => (
              <option key={type} value={type}>
                {capitalize(type)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>{l.search.engineType}</label>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <select
            name="engine"
            value={filters.engine}
            onChange={handleChange}
            className={`${inputClass} pl-9`}
          >
            <option value="">{l.search.allEngineTypes}</option>
            {Object.values(CarEngineType).map((engine) => (
              <option key={engine} value={engine}>
                {capitalize(engine)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 text-center pt-1">
        {l.search.pricesDisclaimer}
      </p>
    </div>
  );
};

export default MobileCarFilters;
