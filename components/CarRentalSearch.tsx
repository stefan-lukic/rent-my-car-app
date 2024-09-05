'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from './UI/Button';
import SearchIcon from '@mui/icons-material/Search';
import { ICar } from '@/lib/model/Car';

export default function CarRentalSearch() {
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchResults, setSearchResults] = useState<ICar[]>([]);

  const handleSearch = async () => {
    const response = await fetch(
      `/api/search?city=${city}&start=${startDate?.toISOString()}&end=${endDate?.toISOString()}`
    );
    const data = await response.json();
    setSearchResults(data);
  };

  return (
    <div className="flex flex-col space-y-4 p-4 bg-white rounded-lg shadow-md">
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="p-2 border rounded-md"
      />
      <div className="flex space-x-4">
        <DatePicker
          className="p-2 border rounded-md w-full"
          selected={startDate}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          onChange={(date: Date | null) => setStartDate(date)}
        />
        <DatePicker
          className="p-2 border rounded-md w-full"
          selected={endDate}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="End Date"
          onChange={(date: Date | null) => setEndDate(date)}
        />
      </div>
      <Button
        onClick={handleSearch}
        className="flex items-center justify-center"
      >
        <SearchIcon className="mr-2" />
        Search
      </Button>

      {searchResults.length > 0 && (
        <ul>
          {searchResults.map((car) => (
            <li key={car.id}>
              {car.carModel} - {car.city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
