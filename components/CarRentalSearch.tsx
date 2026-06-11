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
    totalCars: initialCars ? initialCars.length : 0,
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
    const headerElement = document.getElementById('search-results');
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

  const inputStyling =
    'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all';

  return (
    <div id="car-rental-search" className="flex flex-col w-full">
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 px-1">
              Location
            </label>
            <input
              id="car-search-input"
              className={inputStyling}
              type="text"
              placeholder="Where are you going?"
              value={searchParams.city}
              onChange={(e) =>
                setSearchParams({ ...searchParams, city: e.target.value })
              }
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="flex-1 flex gap-4">
            <div className="w-1/2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 px-1">
                Pick up
              </label>
              <DatePicker
                className={inputStyling}
                selected={searchParams.startDate}
                selectsStart
                startDate={searchParams.startDate ?? undefined}
                endDate={searchParams.endDate ?? undefined}
                placeholderText="Start Date"
                onChange={(date: Date | null) =>
                  setSearchParams({ ...searchParams, startDate: date })
                }
              />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 px-1">
                Drop off
              </label>
              <DatePicker
                className={inputStyling}
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
          </div>

          <div className="lg:w-auto flex items-end">
            <Button
              className="w-full lg:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center transition-colors shadow-sm"
              onClick={() => handleSearch()}
            >
              <SearchIcon className="mr-2" fontSize="small" />
              Search
            </Button>
          </div>
        </div>
      </div>

      <div id="search-results" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Available Cars
          </h2>
          <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-sm font-semibold">
            {searchState.totalCars} found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
          <div className="mt-10 mb-8 flex justify-center items-center space-x-4">
            <Button
              className={`px-4 py-2 rounded-lg font-medium border ${searchState.currentPage === 1 ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 shadow-sm'}`}
              onClick={() => handlePageChange(searchState.currentPage - 1)}
              disabled={searchState.currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-gray-600 font-medium">
              Page {searchState.currentPage} of {searchState.totalPages}
            </span>
            <Button
              className={`px-4 py-2 rounded-lg font-medium border ${searchState.currentPage === searchState.totalPages ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 shadow-sm'}`}
              onClick={() => handlePageChange(searchState.currentPage + 1)}
              disabled={searchState.currentPage === searchState.totalPages}
            >
              Next
            </Button>
          </div>
        )}
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
          onBookNow={() => handleBookNow(selectedCar)}
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
