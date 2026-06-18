'use client';
import React, { useState, useEffect } from 'react';
import { MapPin, Search, Info, ChevronDown } from 'lucide-react';
import { CarCity } from '@/lib/model/car/CarCity';
import MobileCarSearchResults from './MobileCarSearchResults';
import BookingDialog from '../BookNowDialog';
import MobileCarDetailsDrawer from './MobileCarDetailsDrawer';
import CustomDatePicker from '../UI/CustomDatePicker';
import { useCarSearchForm } from '@/hooks/useCarSearch';
import { IUser } from '@/lib/model/User';
import { ICar } from '@/lib/model/car/Car';

const MobileCarRentalSearch = ({ filters }: { filters: any }) => {
  const {
    form,
    results,
    selectedCar,
    owner,
    onSearch,
    onPageChange,
    openDetails,
    confirmBooking,
    setSelectedCar,
    daysSelected,
  } = useCarSearchForm({ filters });

  const [modals, setModals] = useState({ booking: false, details: false });
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [allCars, setAllCars] = useState<ICar[]>([]);

  useEffect(() => {
    if (results.currentPage === 1) {
      setAllCars(results.data);
    } else {
      setAllCars((prev) => [...prev, ...results.data]);
    }
  }, [results.data, results.currentPage]);

  const handleBookingConfirm = async () => {
    if (!selectedCar) return;
    const ok = await confirmBooking(selectedCar);
    if (ok) {
      setModals({ booking: false, details: false });
      setSelectedCar(null);
    } else {
      alert('Reservation failed. Check your connection or login status.');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <form
        onSubmit={onSearch}
        className="bg-white rounded-3xl border border-gray-100 shadow-xl p-5 space-y-4"
      >
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
            <select
              {...form.register('city')}
              className="w-full pl-10 px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none appearance-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All cities (Serbia)</option>
              {Object.values(CarCity).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <CustomDatePicker
            name="startDate"
            control={form.control}
            label="Pick-up"
            minDate={new Date()}
          />
          <CustomDatePicker
            name="endDate"
            control={form.control}
            label="Return"
            minDate={form.watch('startDate') || new Date()}
          />
        </div>

        <button
          type="submit"
          disabled={results.loading}
          className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          {results.loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
          ) : (
            <>
              <Search size={18} /> Search Cars
            </>
          )}
        </button>

        {daysSelected > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 p-4 rounded-2xl border border-blue-100 animate-pulse">
            <Info size={16} className="text-blue-600" />
            <p className="text-xs font-bold text-blue-700">
              Booking for {daysSelected} days
            </p>
          </div>
        )}
      </form>

      <div>
        <h2 className="text-xl font-black text-gray-900 mb-5 px-1">
          Available Cars
        </h2>
        <div className="flex flex-col gap-5">
          {allCars.map((car) => (
            <MobileCarSearchResults
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
          {!results.loading && allCars.length === 0 && (
            <p className="text-center text-gray-400 italic py-10">
              No cars found...
            </p>
          )}
        </div>

        {results.currentPage < results.totalPages && (
          <button
            onClick={() => onPageChange(results.currentPage + 1)}
            disabled={results.loading}
            className="w-full mt-6 py-4 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            {results.loading ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent animate-spin rounded-full" />
            ) : (
              <>
                <ChevronDown size={16} /> Load more
              </>
            )}
          </button>
        )}

        {results.currentPage >= results.totalPages && allCars.length > 0 && (
          <p className="text-center text-xs text-gray-400 py-4 italic">
            All cars loaded
          </p>
        )}
      </div>

      {selectedCar && (
        <>
          <MobileCarDetailsDrawer
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
            onBook={handleBookingConfirm}
          />
        </>
      )}
    </div>
  );
};

export default MobileCarRentalSearch;
