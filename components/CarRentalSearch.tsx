'use client';

import { Button } from './UI/Button';
import SearchIcon from '@mui/icons-material/Search';
import { AlertCircle, CalendarSearch, MapPin } from 'lucide-react';
import { CarCity } from '@/lib/model/car/CarCity';
import { useCarSearchForm } from '@/hooks/useCarSearch';
import CustomDatePicker from './UI/CustomDatePicker';
import CarSearchResults from './CarSearchResults';
import BookingDialog from './BookNowDialog';
import CarDetailsDrawer from './CarDetailsDrawer';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import l from '@/helper/en';
import { CarResultsSkeleton } from './UI/LoadingSkeletons';

const CarRentalSearch = ({ filters, initialCars }: any) => {
  const {
    form,
    results,
    selectedCar,
    renter,
    startDate,
    hasSearched,
    searchError,
    onSearch,
    onPageChange,
    openDetails,
    confirmBooking,
    setSelectedCar,
  } = useCarSearchForm({ filters, initialCars });

  const {
    modals,
    setModals,
    bookingError,
    isBooking,
    isUnauthorized,
    handleBooking,
    openBooking,
    closeBooking,
    closeDetails,
  } = useBookingFlow({ confirmBooking, setSelectedCar });

  const pages = Array.from({ length: results.totalPages }, (_, i) => i + 1);

  return (
    <div className="flex w-full flex-col">
      <form
        onSubmit={onSearch}
        className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_1.4fr_auto] lg:items-end"
      >
        <div className="flex-1 w-full">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            {l.search.location}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              {...form.register('city')}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="">{l.search.allCities}</option>
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
            label={l.search.pickUp}
            minDate={new Date()}
          />
          <CustomDatePicker
            name="endDate"
            control={form.control}
            label={l.search.returnDate}
            minDate={startDate ?? new Date()}
          />
        </div>

        <Button
          type="submit"
          disabled={results.loading}
          className="flex min-w-[150px] items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {results.loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
          ) : (
            <>
              <SearchIcon className="mr-2" /> {l.common.search}
            </>
          )}
        </Button>
      </form>

      {searchError && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{searchError}</span>
        </div>
      )}

      {!hasSearched && !results.loading && (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
          <div className="mb-4 rounded-2xl bg-blue-50 p-3 text-blue-600">
            <CalendarSearch className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-slate-900">
            {l.search.startSearchTitle}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            {l.search.startSearchDescription}
          </p>
        </div>
      )}

      {hasSearched && !results.loading && !searchError && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-800">
            {l.search.carsFound(results.total)}
          </p>
        </div>
      )}

      {results.loading && results.data.length === 0 ? (
        <CarResultsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {results.data.map((car) => (
            <CarSearchResults
              key={car._id}
              car={car}
              onBookNow={() => openBooking(car)}
              onViewDetails={() => {
                openDetails(car);
                setModals({ booking: false, details: true });
              }}
            />
          ))}
        </div>
      )}

      {hasSearched &&
        !results.loading &&
        !searchError &&
        results.data.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <p className="font-bold text-slate-800">{l.search.noCarsFound}</p>
            <p className="mt-1 text-sm text-slate-500">
              {l.search.tryDifferentSearch}
            </p>
          </div>
        )}

      {results.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                results.currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 text-gray-500 hover:border-blue-400'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {selectedCar && (
        <>
          <CarDetailsDrawer
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
            bookingError={bookingError}
            isBooking={isBooking}
            onClose={closeBooking}
            onBook={() => handleBooking(selectedCar)}
          />
        </>
      )}
    </div>
  );
};

export default CarRentalSearch;
