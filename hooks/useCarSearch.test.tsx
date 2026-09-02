import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ICar } from '@/lib/model/car/Car';
import { useCarSearchForm } from './useCarSearch';
import l from '@/helper/en';
import type { CarFilterState } from '@/lib/model/car/CarFilterState';

const filters: CarFilterState = {
  minPrice: '',
  maxPrice: '',
  make: '',
  carType: '',
  engine: '',
  minSeats: '',
};

const car = {
  _id: 'car-1',
  make: 'BMW',
  carModel: 'X5',
  carLocation: 'New Belgrade',
  renter: 'renter-1',
} as unknown as ICar;

const secondCar = {
  ...car,
  _id: 'car-2',
  carModel: 'X3',
} as unknown as ICar;

describe('useCarSearchForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal('fetch', vi.fn());
  });

  it('uses initial cars as initial search results', () => {
    const { result } = renderHook(() =>
      useCarSearchForm({
        filters,
        initialCars: [car, secondCar],
      })
    );

    expect(result.current.results.data).toEqual([car, secondCar]);
    expect(result.current.results.total).toBe(2);
    expect(result.current.results.loading).toBe(false);
  });

  it('does not fetch cars until both dates exist', () => {
    renderHook(() =>
      useCarSearchForm({
        filters,
      })
    );

    expect(fetch).not.toHaveBeenCalled();
  });

  it('fetches cars with dates, city and filter query parameters', async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        cars: [car],
        totalCars: 1,
        totalPages: 1,
        currentPage: 1,
      }),
    } as Response);

    const { result } = renderHook(() =>
      useCarSearchForm({
        filters: {
          ...filters,
          make: 'BMW',
          minPrice: '40',
          minSeats: '5',
        },
      })
    );

    act(() => {
      result.current.form.setValue('startDate', new Date(2026, 7, 1));

      result.current.form.setValue('endDate', new Date(2026, 7, 5));

      result.current.form.setValue('city', 'Belgrade');
    });

    await act(async () => {
      await result.current.onSearch({
        preventDefault: vi.fn(),
      } as unknown as React.BaseSyntheticEvent);
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledOnce();
    });

    const requestUrl = String(vi.mocked(fetch).mock.calls[0][0]);

    expect(requestUrl).toContain('/api/cars?');
    expect(requestUrl).toContain('city=Belgrade');
    expect(requestUrl).toContain('make=BMW');
    expect(requestUrl).toContain('minPrice=40');
    expect(requestUrl).toContain('minSeats=5');
    const requestQuery = new URL(requestUrl, 'http://localhost').searchParams;
    expect(requestQuery.get('start')).toBe('2026-08-01');
    expect(requestQuery.get('end')).toBe('2026-08-05');

    expect(result.current.results.data).toEqual([car]);
    expect(result.current.results.total).toBe(1);
    expect(result.current.results.loading).toBe(false);
  });

  it('calculates selected rental days', () => {
    const { result } = renderHook(() =>
      useCarSearchForm({
        filters,
      })
    );

    act(() => {
      result.current.form.setValue('startDate', new Date(2026, 7, 1));

      result.current.form.setValue('endDate', new Date(2026, 7, 4));
    });

    expect(result.current.daysSelected).toBe(4);
  });

  it('does not create booking when rental dates are missing', async () => {
    const { result } = renderHook(() =>
      useCarSearchForm({
        filters,
      })
    );

    await expect(result.current.confirmBooking(car)).rejects.toThrow(
      l.search.selectDatesFirst
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it('removes booked car from results after successful booking', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Booking successful' }),
    } as Response);

    const { result } = renderHook(() =>
      useCarSearchForm({
        filters,
        initialCars: [car, secondCar],
      })
    );

    act(() => {
      result.current.form.setValue('startDate', new Date(2026, 7, 1));

      result.current.form.setValue('endDate', new Date(2026, 7, 3));
    });

    await act(async () => {
      await result.current.confirmBooking(car);
    });

    expect(result.current.results.data).toEqual([secondCar]);
    expect(result.current.results.total).toBe(1);

    expect(fetch).toHaveBeenCalledWith(
      '/api/book-now',
      expect.objectContaining({
        method: 'POST',
      })
    );
    const bookingRequest = vi.mocked(fetch).mock.calls[0][1];
    expect(JSON.parse(bookingRequest?.body as string)).toEqual({
      carId: 'car-1',
      carLocation: 'New Belgrade',
      startDate: '2026-08-01',
      endDate: '2026-08-03',
    });
  });

  it('throws the booking error returned by the API', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({
        message:
          'You already have an active reservation for the selected dates',
      }),
    } as Response);

    const { result } = renderHook(() => useCarSearchForm({ filters }));

    act(() => {
      result.current.form.setValue('startDate', new Date(2026, 7, 1));
      result.current.form.setValue('endDate', new Date(2026, 7, 3));
    });

    await expect(result.current.confirmBooking(car)).rejects.toThrow(
      'You already have an active reservation for the selected dates'
    );
  });

  it('loads renter details when a car is opened', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        _id: 'renter-1',
        name: 'Marko Markovic',
      }),
    } as Response);

    const { result } = renderHook(() =>
      useCarSearchForm({
        filters,
      })
    );

    await act(async () => {
      await result.current.openDetails(car);
    });

    expect(result.current.selectedCar).toBe(car);

    expect(fetch).toHaveBeenCalledWith(
      '/api/users/renter-1',
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      })
    );

    expect(result.current.renter).toMatchObject({
      _id: 'renter-1',
      name: 'Marko Markovic',
    });

    expect(result.current.renterLoading).toBe(false);
  });
});
