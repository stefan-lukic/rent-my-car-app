'use client';

import { useEffect, useState, type ReactNode } from 'react';
import {
  AlertCircle,
  CalendarSearch,
  MapPin,
  Search,
  Info,
  ChevronDown,
  CheckCircle2,
  X,
} from 'lucide-react';
import Link from 'next/link';
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
import type { CarSearchFormValues } from '@/hooks/useCarSearch';

interface MobileCarRentalSearchProps {
  filters: CarFilterState;
  filtersSlot?: ReactNode;
  initialValues?: CarSearchFormValues;
  persistSearch?: boolean;
}

const MobileCarRentalSearch = ({
  filters,
  filtersSlot,
  initialValues,
  persistSearch,
}: MobileCarRentalSearchProps) => {
  const {
    form,
    results,
    selectedCar,
    renter,
    renterLoading,
    onSearch,
    onPageChange,
    openDetails,
    confirmBooking,
    setSelectedCar,
    daysSelected,
    hasSearched,
    searchError,
    searchQuery,
  } = useCarSearchForm({ filters, initialValues, persistSearch });

  const {
    modals,
    setModals,
    bookingError,
    bookingSuccess,
    dismissBookingSuccess,
    isBooking,
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
        className="space-y-4 rounded-2xl border border-border bg-white p-4 shadow-sm"
      >
        <div>
          <label
            htmlFor="mobile-search-city"
            className="mb-2 block text-xs font-semibold uppercase tracking-widest text-body"
          >
            {l.search.location}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand" />
            <select
              id="mobile-search-city"
              {...form.register('city')}
              className="min-h-11 w-full appearance-none rounded-xl border border-border bg-white py-3.5 pl-10 pr-4 text-sm text-ink shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-tint"
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
            centerOnScreen
          />
          <CustomDatePicker
            name="endDate"
            control={form.control}
            label={l.search.returnDate}
            minDate={form.watch('startDate') || new Date()}
            centerOnScreen
          />
        </div>

        <button
          type="submit"
          disabled={results.loading}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-60"
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
          <div className="flex items-center gap-2 rounded-xl border border-brand-tint bg-brand-tint p-3">
            <Info size={16} className="text-brand" />
            <p className="text-xs font-bold text-brand/90">
              {l.search.bookingForDays(daysSelected)}
            </p>
          </div>
        )}
      </form>

      {bookingSuccess && (
        <div
          role="status"
          className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-4 right-4 z-[110] flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 pr-2 text-sm text-emerald-800 shadow-xl"
        >
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 h-5 w-5 shrink-0"
          />
          <div>
            <p>{bookingSuccess}</p>
            <Link
              href="/profile/my-profile"
              className="mt-1 inline-block font-semibold underline"
            >
              {l.carDetailsPage.viewMyRentals}
            </Link>
          </div>
          <button
            type="button"
            onClick={dismissBookingSuccess}
            aria-label="Dismiss booking confirmation"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      )}

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
            <h2 className="font-heading text-lg font-bold text-ink">
              {l.search.availableCars}
            </h2>
            <span className="text-xs font-semibold text-body-subtle">
              {l.search.carsFound(results.total)}
            </span>
          </div>
        )}

        {!hasSearched && !results.loading && (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-white px-5 text-center">
            <div className="mb-3 rounded-xl bg-brand-tint p-3 text-brand">
              <CalendarSearch className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-ink">
              {l.search.startSearchTitle}
            </h3>
            <p className="mt-1 text-xs leading-5 text-body-subtle">
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
                <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-12 text-center">
                  <p className="font-bold text-ink-secondary">
                    {l.search.noCarsFound}
                  </p>
                  <p className="mt-1 text-xs text-body-subtle">
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
            className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-white py-3.5 text-sm font-semibold text-body transition-colors hover:bg-surface hover:text-ink disabled:opacity-50"
          >
            {results.loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-body-faint border-t-transparent" />
            ) : (
              <>
                <ChevronDown size={16} /> {l.common.loadMore}
              </>
            )}
          </button>
        )}

        {results.currentPage >= results.totalPages && allCars.length > 0 && (
          <p className="py-4 text-center text-xs text-body-faint">
            {l.common.allCarsLoaded}
          </p>
        )}
      </div>

      {selectedCar && (
        <>
          <MobileCarDetailsDrawer
            car={selectedCar}
            renter={renter}
            // Keep the mobile owner state synchronized with the shared drawer.
            renterLoading={renterLoading}
            isOpen={modals.details}
            onClose={closeDetails}
            onBookNow={() => setModals({ details: false, booking: true })}
            startDate={form.getValues('startDate')}
            endDate={form.getValues('endDate')}
            searchQuery={searchQuery}
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

export default MobileCarRentalSearch;
