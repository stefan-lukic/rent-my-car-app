'use client';
import React, { useState } from 'react';
import { Button } from './UI/Button';
import SearchIcon from '@mui/icons-material/Search';
import { MapPin } from 'lucide-react';
import { CarCity } from '@/lib/model/car/CarCity';
import { useCarSearchForm } from '@/hooks/useCarSearch';
import CustomDatePicker from './UI/CustomDatePicker';
import CarSearchResults from './CarSearchResults';
import BookingDialog from './BookNowDialog';
import CarDetailsDrawer from './CarDetailsDrawer';
import { IUser } from '@/lib/model/User';

const CarRentalSearch = ({ filters, initialCars }: any) => {
  const {
    form,
    results,
    selectedCar,
    owner,
    startDate,
    onSearch,
    onPageChange,
    openDetails,
    confirmBooking,
    setSelectedCar,
  } = useCarSearchForm({ filters, initialCars });

  const [modals, setModals] = useState({ booking: false, details: false });
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const handleBooking = async () => {
    if (!selectedCar) return;
    const ok = await confirmBooking(selectedCar);
    if (ok) {
      setModals({ booking: false, details: false });
      setSelectedCar(null);
    } else {
      alert('Booking failed. Please check your dates and try again.');
    }
  };

  return (
    <div className="flex flex-col w-full">
      <form
        onSubmit={onSearch}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col lg:flex-row gap-4 items-end"
      >
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 px-1">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              {...form.register('city')}
              className="w-full pl-10 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all"
            >
              <option value="">All Cities (Serbia)</option>
              {Object.values(CarCity).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 flex gap-4 w-full">
          <CustomDatePicker
            name="startDate"
            control={form.control}
            label="Pick Up"
            minDate={new Date()}
          />
          <CustomDatePicker
            name="endDate"
            control={form.control}
            label="Return"
            minDate={startDate ?? new Date()}
          />
        </div>

        <Button
          type="submit"
          disabled={results.loading}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-sm hover:bg-blue-700 transition-all flex items-center justify-center min-w-[160px]"
        >
          {results.loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
          ) : (
            <>
              <SearchIcon className="mr-2" /> Search
            </>
          )}
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {results.data.map((car) => (
          <CarSearchResults
            key={car._id}
            car={car}
            onBookNow={() => {
              setSelectedCar(car);
              setModals({ booking: true, details: false });
            }}
            onViewDetails={() => {
              openDetails(car);
              setModals({ booking: false, details: true });
            }}
          />
        ))}
      </div>

      {selectedCar && (
        <>
          <CarDetailsDrawer
            car={selectedCar}
            owner={owner}
            isOpen={modals.details}
            onClose={() => {
              setModals((p) => ({ ...p, details: false }));
              setSelectedCar(null);
            }}
            onBookNow={() => setModals({ details: false, booking: true })}
          />
          <BookingDialog
            user={currentUser}
            car={selectedCar}
            isOpen={modals.booking}
            startDate={form.getValues('startDate')}
            endDate={form.getValues('endDate')}
            onClose={() => {
              setModals((p) => ({ ...p, booking: false }));
              setSelectedCar(null);
            }}
            onBook={handleBooking}
          />
        </>
      )}
    </div>
  );
};

export default CarRentalSearch;
