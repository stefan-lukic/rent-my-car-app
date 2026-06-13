'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '../UI/Button';
import SearchIcon from '@mui/icons-material/Search';
import { ICar } from '@/lib/model/car/Car';
import { IUser } from '@/lib/model/User';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import MobileCarSearchResults from './MobileCarSearchResults';
import BookingDialog from '../BookNowDialog';
import MobileCarDetailsDrawer from './MobileCarDetailsDrawer';
import { useSession } from 'next-auth/react';

export interface CarRentalSearchProps {
  filters: CarFilterState;
}

const MobileCarRentalSearch: React.FC<CarRentalSearchProps> = ({ filters }) => {
  const { data: session } = useSession();

  const [searchParams, setSearchParams] = useState({
    city: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  });
  const [searchResults, setSearchResults] = useState<ICar[]>([]);
  const [selectedCar, setSelectedCar] = useState<ICar | null>(null);
  const [owner, setOwner] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

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

  const fetchCurrentUser = async () => {
    if (!session?.user?.email) return;
    try {
      const response = await fetch(
        `/api/users?email=${encodeURIComponent(session.user.email)}`
      );
      const data = await response.json();
      if (response.ok) setCurrentUser(data);
    } catch (error) {
      console.error('Error fetching current user:', error);
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

  const handleBookNow = async (car: ICar) => {
    setSelectedCar(car);
    await fetchCurrentUser();
    setIsBookingModalOpen(true);
  };

  const handleViewDetails = async (carId: string) => {
    const car = searchResults?.find((car) => car._id === carId);
    if (car) {
      setSelectedCar(car);
      await fetchOwnerDetails(car.owner.toString());
      setIsDetailsDrawerOpen(true);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: selectedCar._id,
          carLocation: selectedCar.carLocation,
          startDate,
          endDate,
        }),
      });

      if (response.ok) {
        alert('Booking successful!');
        setSearchResults((prevResults) =>
          prevResults.filter((car) => car._id !== selectedCar._id)
        );
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
    <div className="h-[calc(100vh-85px)] flex flex-col p-2 bg-white overflow-auto">
      <input
        type="text"
        placeholder="City"
        value={searchParams.city}
        onChange={(e) =>
          setSearchParams({ ...searchParams, city: e.target.value })
        }
        className="w-full p-2 mb-2 mt-2 border rounded-md"
      />
      <div className="w-full p-0 flex flex-col">
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
        <Button
          className="w-full flex items-center justify-center"
          onClick={handleSearch}
        >
          <SearchIcon className="mr-2" /> Search
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {searchResults.map((car) => (
          <MobileCarSearchResults
            key={car._id}
            car={car}
            onBookNow={() => handleBookNow(car)}
            onViewDetails={() => handleViewDetails(car._id)}
          />
        ))}
      </div>

      {selectedCar && owner && (
        <MobileCarDetailsDrawer
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
          user={currentUser}
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

export default MobileCarRentalSearch;
