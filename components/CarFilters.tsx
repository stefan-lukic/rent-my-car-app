import React from 'react';
import { CarType } from '../lib/model/car/CarType';
import { CarMake } from '../lib/model/car/CarMake';
import { CarEngineType } from '../lib/model/car/CarEngineType';
import { CarCity } from '../lib/model/car/CarCity';

const CarFilters: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price Range (per day)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              id="minPrice"
              placeholder="Min"
              className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span>-</span>
            <input
              type="number"
              id="maxPrice"
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
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Car Type
          </label>
          <select
            id="type"
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
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <select
            id="city"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">All Cities</option>
            {Object.values(CarCity).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CarFilters;
