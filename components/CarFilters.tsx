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

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="minPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Price Range (per day)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleInputChange}
              placeholder="Min"
              className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span>-</span>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleInputChange}
              placeholder="Max"
              className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="make"
            className="block text-sm font-medium text-gray-700"
          >
            Car Make
          </label>
          <select
            id="make"
            name="make"
            value={filters.make}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
            className="block text-sm font-medium text-gray-700"
          >
            Car Type
          </label>
          <select
            id="carType"
            name="carType"
            value={filters.carType}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
            className="block text-sm font-medium text-gray-700"
          >
            Engine Type
          </label>
          <select
            id="engine"
            name="engine"
            value={filters.engine}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
