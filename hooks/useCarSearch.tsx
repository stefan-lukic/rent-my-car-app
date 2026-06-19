import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ICar } from '@/lib/model/car/Car';
import { IOwner } from '@/lib/model/User';
import { CarFilterState } from '@/lib/model/car/CarFilterState';

export type CarSearchFormValues = {
  city: string;
  startDate: Date | null;
  endDate: Date | null;
};

export function useCarSearchForm({
  filters,
  initialCars,
}: {
  filters: CarFilterState;
  initialCars?: ICar[];
}) {
  const form = useForm<CarSearchFormValues>({
    defaultValues: { city: '', startDate: null, endDate: null },
  });

  const [results, setResults] = useState({
    data: initialCars ?? [],
    total: initialCars?.length ?? 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
  });

  const [selectedCar, setSelectedCar] = useState<ICar | null>(null);
  const [owner, setOwner] = useState<IOwner | null>(null);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const ownerAbortRef = useRef<AbortController | null>(null);

  const [startDate, endDate] = form.watch(['startDate', 'endDate']);

  const daysSelected =
    startDate && endDate
      ? Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000)
      : 0;

  // JSON.stringify stabilizuje referencu filters objekta kao string
  // kako bi fetchCars bio stabilan između rendera kad se filters nije stvarno promenio
  const filtersJson = JSON.stringify(filters);

  const fetchCars = useCallback(
    async (values: CarSearchFormValues, page = 1, signal?: AbortSignal) => {
      if (!values.startDate || !values.endDate) return;

      setResults((prev) => ({ ...prev, loading: true }));
      try {
        const query = new URLSearchParams({
          page: page.toString(),
          limit: '10',
          start: values.startDate.toISOString(),
          end: values.endDate.toISOString(),
        });
        if (values.city) query.set('city', values.city);

        const parsedFilters: CarFilterState = JSON.parse(filtersJson);
        Object.entries(parsedFilters).forEach(([key, value]) => {
          if (value) query.set(key, value);
        });

        const res = await fetch(`/api/cars?${query}`, { signal });
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
        setResults((prev) => ({ ...prev, loading: false }));
      }
    },
    [filtersJson]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchCars(form.getValues(), 1, controller.signal);
    return () => controller.abort();
  }, [fetchCars]);

  const openDetails = async (car: ICar) => {
    setSelectedCar(car);
    setOwner(null);
    ownerAbortRef.current?.abort();
    const controller = new AbortController();
    ownerAbortRef.current = controller;

    setOwnerLoading(true);
    try {
      const res = await fetch(`/api/users/${car.owner}`, {
        signal: controller.signal,
      });
      if (res.ok) setOwner((await res.json()) as IOwner);
    } finally {
      setOwnerLoading(false);
    }
  };

  const confirmBooking = async (car: ICar): Promise<boolean> => {
    const { startDate, endDate } = form.getValues();
    if (!startDate || !endDate) return false;

    try {
      const response = await fetch('/api/book-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car._id,
          carLocation: car.carLocation,
          startDate,
          endDate,
        }),
      });

      if (response.ok) {
        setResults((prev) => ({
          ...prev,
          data: prev.data.filter((c) => c._id !== car._id),
          total: prev.total - 1,
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return {
    form,
    results,
    selectedCar,
    owner,
    ownerLoading,
    daysSelected,
    startDate,
    onSearch: form.handleSubmit((v) => fetchCars(v, 1)),
    onPageChange: (p: number) => fetchCars(form.getValues(), p),
    openDetails,
    confirmBooking,
    setSelectedCar,
  };
}
