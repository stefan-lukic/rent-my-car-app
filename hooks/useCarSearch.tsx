import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ICar } from '@/lib/model/car/Car';
import { IRenter } from '@/lib/model/User';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import l from '@/helper/en';
import {
  countInclusiveCalendarDays,
  formatCalendarDate,
} from '@/lib/utils/calendarDate';

export type CarSearchFormValues = {
  city: string;
  startDate: Date | null;
  endDate: Date | null;
};

const buildSearchQuery = (
  values: CarSearchFormValues,
  filters: CarFilterState
) => {
  const query = new URLSearchParams();

  if (values.startDate) {
    query.set('start', formatCalendarDate(values.startDate));
  }
  if (values.endDate) query.set('end', formatCalendarDate(values.endDate));
  if (values.city) query.set('city', values.city);

  Object.entries(filters).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });

  return query;
};

export function useCarSearchForm({
  filters,
  initialCars,
  initialValues,
  persistSearch = false,
}: {
  filters: CarFilterState;
  initialCars?: ICar[];
  initialValues?: CarSearchFormValues;
  persistSearch?: boolean;
}) {
  const form = useForm<CarSearchFormValues>({
    defaultValues: initialValues ?? {
      city: '',
      startDate: null,
      endDate: null,
    },
  });
  const getValues = form.getValues;

  const [results, setResults] = useState({
    data: initialCars ?? [],
    total: initialCars?.length ?? 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
  });

  const [selectedCar, setSelectedCar] = useState<ICar | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchQuery, setSearchQuery] = useState(() =>
    buildSearchQuery(
      initialValues ?? { city: '', startDate: null, endDate: null },
      filters
    ).toString()
  );
  const [renter, setRenter] = useState<IRenter | null>(null);
  const [renterLoading, setRenterLoading] = useState(false);
  const renterAbortRef = useRef<AbortController | null>(null);

  const [startDate, endDate] = form.watch(['startDate', 'endDate']);

  const daysSelected =
    startDate && endDate ? countInclusiveCalendarDays(startDate, endDate) : 0;

  // JSON.stringify stabilizuje referencu filters objekta kao string
  // kako bi fetchCars bio stabilan između rendera kad se filters nije stvarno promenio
  const filtersJson = JSON.stringify(filters);

  const fetchCars = useCallback(
    async (values: CarSearchFormValues, page = 1, signal?: AbortSignal) => {
      if (!values.startDate || !values.endDate) return;

      setHasSearched(true);
      setSearchError('');
      setResults((prev) => ({ ...prev, loading: true }));
      try {
        const parsedFilters: CarFilterState = JSON.parse(filtersJson);
        const persistedQuery = buildSearchQuery(values, parsedFilters);
        const query = new URLSearchParams(persistedQuery);
        query.set('page', page.toString());
        query.set('limit', '10');

        setSearchQuery(persistedQuery.toString());
        if (persistSearch && typeof window !== 'undefined') {
          // Keep only the active search in the URL so returning from a car restores it.
          window.history.replaceState(
            window.history.state,
            '',
            `${window.location.pathname}?${persistedQuery.toString()}#car-search`
          );
        }

        const res = await fetch(`/api/cars?${query}`, { signal });
        if (res.ok === false) throw new Error('Search request failed');
        const data = await res.json();

        setResults({
          data: data.cars ?? [],
          total: data.totalCars ?? 0,
          totalPages: data.totalPages ?? 0,
          currentPage: data.currentPage ?? page,
          loading: false,
        });
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        setSearchError(l.search.searchFailed);
        setResults((prev) => ({ ...prev, loading: false }));
      }
    },
    [filtersJson, persistSearch]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchCars(getValues(), 1, controller.signal);
    return () => controller.abort();
  }, [fetchCars, getValues]);

  const openDetails = async (car: ICar) => {
    setSelectedCar(car);
    setRenter(null);
    renterAbortRef.current?.abort();
    const controller = new AbortController();
    renterAbortRef.current = controller;

    setRenterLoading(true);
    try {
      const res = await fetch(`/api/users/${car.renter}`, {
        signal: controller.signal,
      });
      if (res.ok) setRenter((await res.json()) as IRenter);
    } finally {
      setRenterLoading(false);
    }
  };

  const confirmBooking = async (car: ICar): Promise<void> => {
    const { startDate, endDate } = form.getValues();
    if (!startDate || !endDate) {
      throw new Error(l.search.selectDatesFirst);
    }

    let response: Response;
    try {
      response = await fetch('/api/book-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car._id,
          carLocation: car.carLocation,
          startDate: formatCalendarDate(startDate),
          endDate: formatCalendarDate(endDate),
        }),
      });
    } catch {
      throw new Error(l.carDetailsPage.connectionError);
    }

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.message || l.carDetailsPage.bookingFailed);
    }

    setResults((prev) => ({
      ...prev,
      data: prev.data.filter((c) => c._id !== car._id),
      total: prev.total - 1,
    }));
  };

  return {
    form,
    results,
    selectedCar,
    renter,
    renterLoading,
    daysSelected,
    hasSearched,
    searchError,
    startDate,
    searchQuery,
    onSearch: form.handleSubmit((values) => {
      if (!values.startDate || !values.endDate) {
        setSearchError(l.search.selectDatesFirst);
        return;
      }
      fetchCars(values, 1);
    }),
    onPageChange: (p: number) => fetchCars(getValues(), p),
    openDetails,
    confirmBooking,
    setSelectedCar,
  };
}
