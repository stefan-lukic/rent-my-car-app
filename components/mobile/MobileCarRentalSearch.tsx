'use client';

import { useEffect, useState, type ReactNode } from 'react';
import {
  AlertCircle,
  CalendarSearch,
  MapPin,
  Search,
  Info,
  ChevronDown,
} from 'lucide-react';
import { CarCity } from '@/lib/model/car/CarCity';
import MobileCarSearchResults from './MobileCarSearchResults';
import BookingDialog from '../BookNowDialog';
import MobileCarDetailsDrawer from './MobileCarDetailsDrawer';
import CustomDatePicker from '../UI/CustomDatePicker';
import { useCarSearchForm } from '@/hooks/useCarSearch';
import { ICar } from '@/lib/model/car/Car';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import l from '@/helper/en';
import { CarResultsSkeleton } from '../UI/LoadingSkeletons';

interface MobileCarRentalSearchProps {
  filters: CarFilterState;
  filtersSlot?: ReactNode;
}

const MobileCarRentalSearch = ({
  filters,
  filtersSlot,
}: MobileCarRentalSearchProps) => {
  const {
    form,
    results,
    selectedCar,
    renter,
    onSearch,
    onPageChange,
    openDetails,
    confirmBooking,
    setSelectedCar,
    daysSelected,
    hasSearched,
    searchError,
  } = useCarSearchForm({ filters });

  const {
    modals,
    setModals,
    bookingFailed,
    isUnauthorized,
    handleBooking,
    openBooking,
    closeBooking,
    closeDetails,
  } = useBookingFlow({ confirmBooking, setSelectedCar });

  const [allCars, setAllCars] = useState<ICar[]>([]);

  useEffect(() => {
    if (results.currentPage === 1) {
      setAllCars(results.data);
    } else {
      setAllCars((prev) => [...prev, ...results.data]);
    }
  }, [results.data, results.currentPage]);

  return (
    <div className="space-y-4 pb-10">
      <form
        onSubmit={onSearch}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
            {l.search.location}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
            <select
              {...form.register('city')}
              className="w-full pl-10 px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none appearance-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{l.search.allCitiesMobile}</option>
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
            label={l.search.pickUp}
            minDate={new Date()}
          />
          <CustomDatePicker
            name="endDate"
            control={form.control}
            label={l.search.returnDate}
            minDate={form.watch('startDate') || new Date()}
          />
        </div>

        <button
          type="submit"
          disabled={results.loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-sm transition active:scale-[0.98] disabled:opacity-60"
        >
          {results.loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
          ) : (
            <>
              <Search size={18} /> {l.common.searchCars}
            </>
          )}
        </button>

        {daysSelected > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3">
            <Info size={16} className="text-blue-600" />
            <p className="text-xs font-bold text-blue-700">
              {l.search.bookingForDays(daysSelected)}
            </p>
          </div>
        )}
      </form>

      {searchError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{searchError}</span>
        </div>
      )}

      {filtersSlot}

      <div>
        {hasSearched && !results.loading && !searchError && (
          <div className="mb-4 flex items-center justify-between px-1">
            <h2 className="text-lg font-black text-slate-900">
              {l.search.availableCars}
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              {l.search.carsFound(results.total)}
            </span>
          </div>
        )}

        {!hasSearched && !results.loading && (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 text-center">
            <div className="mb-3 rounded-xl bg-blue-50 p-3 text-blue-600">
              <CalendarSearch className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {l.search.startSearchTitle}
            </h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {l.search.startSearchDescription}
            </p>
          </div>
        )}

        {results.loading && allCars.length === 0 ? (
          <CarResultsSkeleton mobile />
        ) : (
          <div className="flex flex-col gap-5">
            {allCars.map((car) => (
              <MobileCarSearchResults
                key={car._id}
                car={car}
                onBookNow={() => openBooking(car)}
                onViewDetails={() => {
                  openDetails(car);
                  setModals({ booking: false, details: true });
                }}
              />
            ))}
            {hasSearched &&
              !results.loading &&
              !searchError &&
              allCars.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
                  <p className="font-bold text-slate-800">
                    {l.search.noCarsFound}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {l.search.tryDifferentSearch}
                  </p>
                </div>
              )}
          </div>
        )}

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
                <ChevronDown size={16} /> {l.common.loadMore}
              </>
            )}
          </button>
        )}

        {results.currentPage >= results.totalPages && allCars.length > 0 && (
          <p className="text-center text-xs text-gray-400 py-4 italic">
            {l.common.allCarsLoaded}
          </p>
        )}
      </div>

      {selectedCar && (
        <>
          <MobileCarDetailsDrawer
            car={selectedCar}
            renter={renter}
            isOpen={modals.details}
            onClose={closeDetails}
            onBookNow={() => setModals({ details: false, booking: true })}
            startDate={form.getValues('startDate')}
            endDate={form.getValues('endDate')}
          />
          <BookingDialog
            car={selectedCar}
            isOpen={modals.booking}
            startDate={form.getValues('startDate')}
            endDate={form.getValues('endDate')}
            isUnauthorized={isUnauthorized}
            bookingFailed={bookingFailed}
            onClose={closeBooking}
            onBook={() => handleBooking(selectedCar)}
          />
        </>
      )}
    </div>
  );
};

export default MobileCarRentalSearch;
