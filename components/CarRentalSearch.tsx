'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from './UI/Button';
import SearchIcon from '@mui/icons-material/Search';
import { ICar } from '@/lib/model/car/Car';
import CarSearchResults from './CarSearchResults';
import BookingDialog from './BookNowDialog';
import CarDetailsDrawer from './CarDetailsDrawer';
import { CarFilterState } from '@/lib/model/car/CarFilterState';

export interface CarRentalSearchProps {
  filters: CarFilterState;
  initialCars?: ICar[];
}

const CarRentalSearch: React.FC<CarRentalSearchProps> = ({
  filters,
  initialCars,
}) => {
  const [searchParams, setSearchParams] = useState({
    city: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  });
  const [searchState, setSearchState] = useState({
    results: initialCars,
    currentPage: 1,
    totalPages: 0,
    totalCars: 0,
  });
  const [selectedCar, setSelectedCar] = useState<ICar | null>(null);
  const [owner, setOwner] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  const handleSearch = async (page = 1) => {
    if (!searchParams.startDate || !searchParams.endDate) {
      return;
    }

    const queryParams = new URLSearchParams({
      start: searchParams.startDate.toISOString(),
      end: searchParams.endDate.toISOString(),
      page: page.toString(),
      limit: '10',
      city: searchParams.city,
      ...filters,
    });

    const response = await fetch(`/api/cars?${queryParams}`);
    const data = await response.json();
    setSearchState({
      results: data.cars,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      totalCars: data.totalCars,
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = async (newPage: number) => {
    await handleSearch(newPage);

    // Scroll the search results into view
    const headerElement = document.getElementById('car-rental-search');
    if (headerElement) {
      headerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookNow = (car: ICar) => {
    setSelectedCar(car);
    setIsBookingModalOpen(true);
  };

  const handleViewDetails = async (carId: string) => {
    const car = searchState?.results?.find((car) => car._id === carId);
    if (car) {
      setSelectedCar(car);
      await fetchOwnerDetails(car.owner.toString());
      setIsDetailsDrawerOpen(true);
    }
  };

  const fetchOwnerDetails = async (ownerId: string) => {
    try {
      const response = await fetch(`/api/users/${ownerId}`);
      const data = await response.json();
      if (response.ok) {
        setOwner(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching owner details:', error);
    }
  };

  const handleBookingConfirmation = async (
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
          carLocation: selectedCar.carLocation,
          startDate,
          endDate,
        }),
      });

      if (response.ok) {
        alert('Booking successful!');
        setSearchState((prevState) => ({
          ...prevState,
          results: prevState.results?.filter(
            (car) => car._id !== selectedCar._id
          ),
          totalCars: prevState.totalCars - 1,
        }));
      } else {
        alert('Booking failed. Please login and try again.');
      }
    } catch (error) {
      console.error('Error booking car:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsBookingModalOpen(false);
      setSelectedCar(null);
    }
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
        value={searchParams.city}
        onChange={(e) =>
          setSearchParams({ ...searchParams, city: e.target.value })
        }
        onKeyPress={handleKeyPress}
      />
      <div className="flex space-x-4">
        <DatePicker
          className="p-2 border rounded-md w-full"
          selected={searchParams.startDate}
          selectsStart
          startDate={searchParams.startDate ?? undefined}
          endDate={searchParams.endDate ?? undefined}
          placeholderText="Start Date"
          onChange={(date: Date | null) =>
            setSearchParams({ ...searchParams, startDate: date })
          }
        />
        <DatePicker
          className="p-2 border rounded-md w-full"
          selected={searchParams.endDate}
          selectsEnd
          startDate={searchParams.startDate ?? undefined}
          endDate={searchParams.endDate ?? undefined}
          minDate={searchParams.startDate ?? undefined}
          placeholderText="End Date"
          onChange={(date: Date | null) =>
            setSearchParams({ ...searchParams, endDate: date })
          }
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
          {searchState.results?.map((car) => (
            <CarSearchResults
              key={car._id}
              car={car}
              onBookNow={() => handleBookNow(car)}
              onViewDetails={() => handleViewDetails(car._id)}
            />
          ))}
        </div>
        {searchState.totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => handlePageChange(searchState.currentPage - 1)}
              disabled={searchState.currentPage === 1}
            >
              Previous
            </Button>
            <span className="mx-4">
              Page {searchState.currentPage} of {searchState.totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(searchState.currentPage + 1)}
              disabled={searchState.currentPage === searchState.totalPages}
            >
              Next
            </Button>
          </div>
        )}
        <p className="text-center mt-2">Total cars: {searchState.totalCars}</p>
      </div>

      {selectedCar && owner && (
        <CarDetailsDrawer
          car={selectedCar}
          owner={owner}
          isOpen={isDetailsDrawerOpen}
          onClose={() => {
            setIsDetailsDrawerOpen(false);
            setSelectedCar(null);
            setOwner(null);
          }}
        />
      )}

      {selectedCar && (
        <BookingDialog
          car={selectedCar}
          isOpen={isBookingModalOpen}
          startDate={searchParams.startDate}
          endDate={searchParams.endDate}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedCar(null);
          }}
          onBook={() =>
            handleBookingConfirmation(
              searchParams.startDate,
              searchParams.endDate
            )
          }
        />
      )}
    </div>
  );
};

export default CarRentalSearch;
