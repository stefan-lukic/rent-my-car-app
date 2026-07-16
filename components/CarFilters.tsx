'use client';

import React from 'react';
import { CarType } from '../lib/model/car/CarType';
import { CarMake } from '../lib/model/car/CarMake';
import { CarEngineType } from '../lib/model/car/CarEngineType';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import { selectArrowStyle } from '@/utils/styles';
import l from '@/helper/en';

interface CarFiltersProps {
  filters: CarFilterState;
  setFilters: React.Dispatch<React.SetStateAction<CarFilterState>>;
}

const CarFilters: React.FC<CarFiltersProps> = ({ filters, setFilters }) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const inputClass =
    'mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer appearance-none pr-10';

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">{l.search.filters}</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {l.search.priceRangePerDay}
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleInputChange}
              placeholder={`${l.search.minPlaceholder} $`}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <span className="text-gray-400 font-medium">-</span>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleInputChange}
              placeholder={`${l.search.maxPlaceholder} $`}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="make"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            {l.search.carMake}
          </label>
          <select
            id="make"
            name="make"
            value={filters.make}
            onChange={handleInputChange}
            style={selectArrowStyle}
            className={inputClass}
          >
            <option value="">{l.search.allMakes}</option>
            {Object.values(CarMake).map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="carType"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            {l.search.carType}
          </label>
          <select
            id="carType"
            name="carType"
            value={filters.carType}
            onChange={handleInputChange}
            style={selectArrowStyle}
            className={inputClass}
          >
            <option value="">{l.search.allTypes}</option>
            {Object.values(CarType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="engine"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            {l.search.engineType}
          </label>
          <select
            id="engine"
            name="engine"
            value={filters.engine}
            onChange={handleInputChange}
            style={selectArrowStyle}
            className={inputClass}
          >
            <option value="">{l.search.allEngineTypes}</option>
            {Object.values(CarEngineType).map((engine) => (
              <option key={engine} value={engine}>
                {engine}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CarFilters;
