import React from 'react';
import { CarType } from '../lib/model/car/CarType';
import { CarMake } from '../lib/model/car/CarMake';
import { CarEngineType } from '../lib/model/car/CarEngineType';
import { CarFilterState } from '@/lib/model/car/CarFilterState';

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
    'mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer';

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Filters</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price Range (per day)
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleInputChange}
              placeholder="Min $"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <span className="text-gray-400 font-medium">-</span>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleInputChange}
              placeholder="Max $"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="make"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Car Make
          </label>
          <select
            id="make"
            name="make"
            value={filters.make}
            onChange={handleInputChange}
            className={inputClass}
          >
            <option value="">All Makes</option>
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
            Car Type
          </label>
          <select
            id="carType"
            name="carType"
            value={filters.carType}
            onChange={handleInputChange}
            className={inputClass}
          >
            <option value="">All Types</option>
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
            Engine Type
          </label>
          <select
            id="engine"
            name="engine"
            value={filters.engine}
            onChange={handleInputChange}
            className={inputClass}
          >
            <option value="">All Engine Types</option>
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
