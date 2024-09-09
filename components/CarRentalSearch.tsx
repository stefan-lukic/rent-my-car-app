'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from './UI/Button';
import SearchIcon from '@mui/icons-material/Search';
import { ICar } from '@/lib/model/car/Car';
import SearchResults from './CarSearchResults';
import BookingDialog from './BookNowDialog';

import { useRouter } from 'next/navigation';

export default function CarRentalSearch() {
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchResults, setSearchResults] = useState<ICar[]>([]);
  const [selectedCar, setSelectedCar] = useState<ICar | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCars, setTotalCars] = useState(0);
  const router = useRouter();

  const handleSearch = async (page = 1) => {
    if (!city || !startDate || !endDate) {
      alert('Please fill in all fields');
      return;
    }

    const response = await fetch(
      `/api/cars?city=${encodeURIComponent(city)}&start=${startDate.toISOString()}&end=${endDate.toISOString()}&page=${page}&limit=10`
    );
    const data = await response.json();
    setSearchResults(data.cars);
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
    setTotalCars(data.totalCars);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage);
    await handleSearch(newPage);

    // Scroll the search results into view
    const headerElement = document.getElementById('car-rental-search');
    if (headerElement) {
      headerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookNow = async (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    if (!selectedCar) return;

    try {
      const response = await fetch('/api/book-now', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId: selectedCar._id,
          startDate,
          endDate,
        }),
      });

      if (response.ok) {
        alert('Booking successful!');
        setSelectedCar(null);
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Error booking car:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleViewDetails = (carId: string) => {
    router.push(`/cars/${carId}`);
  };

  return (
    <div
      id="car-rental-search"
      className="flex flex-col space-y-4 p-4 bg-white rounded-lg shadow-md"
    >
      <input
        id="car-search-input"
        className="p-2 border rounded-md"
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <div className="flex space-x-4">
        <DatePicker
          className="p-2 border rounded-md w-full"
          selected={startDate}
          selectsStart
          startDate={startDate ?? undefined}
          endDate={endDate ?? undefined}
          placeholderText="Start Date"
          onChange={(date: Date | null) => setStartDate(date)}
        />
        <DatePicker
          className="p-2 border rounded-md w-full"
          selected={endDate}
          selectsEnd
          startDate={startDate ?? undefined}
          endDate={endDate ?? undefined}
          minDate={startDate ?? undefined}
          placeholderText="End Date"
          onChange={(date: Date | null) => setEndDate(date)}
        />
      </div>
      <Button
        className="flex items-center justify-center"
        onClick={() => handleSearch()}
      >
        <SearchIcon className="mr-2" />
        Search
      </Button>

      <div id="search-results" className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((car) => (
            <SearchResults
              key={car._id}
              car={car}
              startDate={startDate}
              endDate={endDate}
              onBookNow={() => setSelectedCar(car)}
              onViewDetails={() => handleViewDetails(car._id)}
            />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="mx-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
        <p className="text-center mt-2">Total cars: {totalCars}</p>
      </div>

      {selectedCar && (
        <BookingDialog
          car={selectedCar}
          isOpen={!!selectedCar}
          startDate={startDate}
          endDate={endDate}
          onClose={() => setSelectedCar(null)}
          onBook={() => handleBookNow(startDate, endDate)}
        />
      )}
    </div>
  );
}
