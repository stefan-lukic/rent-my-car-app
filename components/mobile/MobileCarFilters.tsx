import React, { useState } from 'react';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarType } from '@/lib/model/car/CarType';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface CarFiltersProps {
  filters: CarFilterState;
  setFilters: React.Dispatch<React.SetStateAction<CarFilterState>>;
}

const MobileCarFilters: React.FC<CarFiltersProps> = ({
  filters,
  setFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-2">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-sm font-semibold">Filters</h2>
        {isExpanded ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {isExpanded && (
        <div className="space-y-3 mt-2">
          <div>
            <label
              htmlFor="minPrice"
              className="block text-xs font-medium text-gray-600"
            >
              Price Range (per day)
            </label>
            <div className="flex items-center space-x-1">
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleInputChange}
                placeholder="Min"
                className="w-1/2 rounded-md border-gray-300 text-xs shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="text-xs">-</span>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleInputChange}
                placeholder="Max"
                className="w-1/2 rounded-md border-gray-300 text-xs shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="make"
              className="block text-xs font-medium text-gray-600"
            >
              Car Make
            </label>
            <select
              id="make"
              name="make"
              value={filters.make}
              onChange={handleInputChange}
              className="block w-full mt-1 rounded-md border-gray-300 text-xs shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
              className="block text-xs font-medium text-gray-600"
            >
              Car Type
            </label>
            <select
              id="carType"
              name="carType"
              value={filters.carType}
              onChange={handleInputChange}
              className="block w-full mt-1 rounded-md border-gray-300 text-xs shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
              className="block text-xs font-medium text-gray-600"
            >
              Engine Type
            </label>
            <select
              id="engine"
              name="engine"
              value={filters.engine}
              onChange={handleInputChange}
              className="block w-full mt-1 rounded-md border-gray-300 text-xs shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
      )}
    </div>
  );
};

export default MobileCarFilters;
