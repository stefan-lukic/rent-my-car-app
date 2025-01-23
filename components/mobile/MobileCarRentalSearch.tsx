'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '../UI/Button';
import SearchIcon from '@mui/icons-material/Search';
import { ICar } from '@/lib/model/car/Car';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import MobileCarSearchResults from './MobileCarSearchResults';

export interface CarRentalSearchProps {
  filters: CarFilterState;
}

const MobileCarRentalSearch: React.FC<CarRentalSearchProps> = ({ filters }) => {
  const [searchParams, setSearchParams] = useState({
    city: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  const [searchResults, setSearchResults] = useState<ICar[]>([]);

  const handleSearch = async () => {
    if (!searchParams.startDate || !searchParams.endDate) return;

    const queryParams = new URLSearchParams({
      city: searchParams.city,
      start: searchParams.startDate.toISOString(),
      end: searchParams.endDate.toISOString(),
      ...filters,
    });

    const response = await fetch(`/api/cars?${queryParams}`);
    const data = await response.json();
    setSearchResults(data.cars);
  };

  return (
    <div className="h-[calc(100vh-150px)] flex flex-col p-2 bg-white rounded-lg shadow-md overflow-auto">
      <input
        type="text"
        placeholder="City"
        value={searchParams.city}
        onChange={(e) =>
          setSearchParams({ ...searchParams, city: e.target.value })
        }
        className="w-full p-2 mb-2 mt-2 border rounded-md"
      />
      <div className="w-full p-0 flex-1">
        <DatePicker
          selected={searchParams.startDate}
          onChange={(date) =>
            setSearchParams({ ...searchParams, startDate: date })
          }
          placeholderText="Start Date"
          className="flex flex-col p-2 border mb-2 rounded-md"
        />
        <DatePicker
          selected={searchParams.endDate}
          onChange={(date) =>
            setSearchParams({ ...searchParams, endDate: date })
          }
          placeholderText="End Date"
          className="flex p-2 border mb-2 rounded-md"
        />
      </div>
      <Button
        className="w-full flex items-center justify-center"
        onClick={handleSearch}
      >
        <SearchIcon className="mr-2" /> Search
      </Button>
      <div className="flex flex-col">
        {searchResults.map((car) => (
          <MobileCarSearchResults key={car._id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default MobileCarRentalSearch;
