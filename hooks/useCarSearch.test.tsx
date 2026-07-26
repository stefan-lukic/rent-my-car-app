/**
 * useCarSearch.test.tsx
 *
 * useCarSearchForm hook upravlja kompletnom logikom za pretragu automobila:
 *   - useForm za upravljanje search formom (city, startDate, endDate)
 *   - results state: data, total, totalPages, currentPage, loading
 *   - selectedCar state: trenutno selektovan automobil za details
 *   - renter state: podaci o vlasniku automobila
 *   - renterLoading state: loading zaFetch ranter details
 *   - onSearch: submit forme za pretragu (zove fetchCars)
 *   - onPageChange: paginacija za rezultate
 *   - openDetails: otvara detalje automobila (zove fetch za renter)
 *   - confirmBooking: pokušava da rezerviše automobil (zove /api/book-now)
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je hook test — testiraju se stvarni state i grane hook-a.
 * - Koristimo renderHook + act iz React Testing Library.
 * - fetch je globalno mockovan (vi.stubGlobal) da ne bismo pozivali
 *   stvarni API.
 * - useBookingFlow nije zasebno mockovan jer useCarSearch ne importuje
 *   onaj hook — on ima svoj vlastiti confirmBooking logiku.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - useCarSearchForm je kompleksan hook sa vise state-a i async operacija.
 * - Zato testiramo svaki deo zasebno: initial state, fetching cars,
 *   calculating days, booking flow, renter details loading.
 * - Koristimo vi.stubGlobal za fetch jer hook koristi global fetch API.
 */

import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ICar } from '@/lib/model/car/Car';
import { useCarSearchForm } from './useCarSearch';

/**
 * filters: fiksni testni filteri za pretragu.
 * Značaj: Koristimo ga kao podrazumevane vrednosti za useCarSearchForm.
 * Ovi filteri odražavaju stvarnu strukturu CarFilterState.
 */
const filters = {
  minPrice: '',
  maxPrice: '',
  make: '',
  carType: '',
  engine: '',
} as any;

/**
 * car i secondCar: fiksni testni automobili.
 * Značaj: Koristimo ih kao initialCars i za testiranje booking flow-a.
 * ICar type osigurava da su svi Required polja prisutna.
 */
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

    /**
     * Globalni mock za fetch.
     * Značaj: useCarSearchForm koristi fetch('/api/cars?') za pretragu
     * i fetch(`/api/users/${car.renter}`) za detalje vlasnika.
     * Zato ga mockujemo da ne bismo pozivali stvarni API.
     */
    vi.stubGlobal('fetch', vi.fn());
  });

  /**
   * TEST 1: Inicijalizacija rezultata sa initialCars
   * ZAŠTO: Ako prosledimo initialCars prop, useCarSearchForm treba
   * da iskoristi te automobile kao početne rezultate pretrage.
   * KAKO:
   * 1. Renderujemo hook sa initialCars=[car, secondCar]
   * 2. Proveravamo da je results.data = [car, secondCar]
   * 3. Proveravamo da je results.total = 2
   * 4. Proveravamo da je results.loading = false
   */
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

  /**
   * TEST 2: Ne fetch-uje automobile dok nedatumi nisu postavljeni
   * ZAŠTO: useCarSearchForm ima useEffect koji zove fetchCars ali
   * samo ako su i startDate i endDate postavljeni. Ako nisu, fetch
   * se ne sme pozvati.
   * KAKO:
   * 1. Renderujemo hook bez dates (samo filters)
   * 2. Proveravamo da fetch NIJE pozvan
   */
  it('does not fetch cars until both dates exist', () => {
    renderHook(() =>
      useCarSearchForm({
        filters,
      })
    );

    expect(fetch).not.toHaveBeenCalled();
  });

  /**
   * TEST 3: Fetch automobila sa query parametrima
   * ZAŠTO: Kada su startDate i endDate postavljeni i korisnik
   * submit-uje formu, useCarSearchForm treba da zove fetch sa
   * tačnim query parametrima (city, make, minPrice, dates).
   * KAKO:
   * 1. Mockujemo fetch da vrati JSON sa cars: [car], totalCars: 1, itd.
   * 2. Renderujemo hook sa filters (make: 'BMW', minPrice: '40')
   * 3. Koristimo act() da postavimo startDate, endDate i city
   *    preko form.setValue (react-hook-form metoda)
   * 4. Pozivamo onSearch() (async)
   * 5. Čekamo da fetch bude pozvan
   * 6. Proveravamo da request URL sadrži tačne parametre
   * 7. Proveravamo da su results ažurirani
   */
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
        },
      })
    );

    act(() => {
      result.current.form.setValue(
        'startDate',
        new Date('2026-08-01T00:00:00.000Z')
      );

      result.current.form.setValue(
        'endDate',
        new Date('2026-08-05T00:00:00.000Z')
      );

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

    expect(result.current.results.data).toEqual([car]);
    expect(result.current.results.total).toBe(1);
    expect(result.current.results.loading).toBe(false);
  });

  /**
   * TEST 4: Računanje izabranih dana
   * ZAŠTO: daysSelected treba da bude Math.ceil((endDate - startDate) / 86400000).
   * Za 2026-08-01 do 2026-08-04 to je 3 dana.
   * KAKO:
   * 1. Renderujemo hook
   * 2. Postavimo startDate i endDate preko form.setValue
   * 3. Proveravamo da je daysSelected = 3
   */
  it('calculates selected rental days', () => {
    const { result } = renderHook(() =>
      useCarSearchForm({
        filters,
      })
    );

    act(() => {
      result.current.form.setValue(
        'startDate',
        new Date('2026-08-01T00:00:00.000Z')
      );

      result.current.form.setValue(
        'endDate',
        new Date('2026-08-04T00:00:00.000Z')
      );
    });

    expect(result.current.daysSelected).toBe(3);
  });

  /**
   * TEST 5: Blokiranje booking-a bez datuma
   * ZAŠTO: Ako startDate ili endDate nisu postavljeni, confirmBooking
   * treba da vrati false i ne poziva fetch.
   * KAKO:
   * 1. Renderujemo hook bez postavljanih datuma
   * 2. Pozivamo confirmBooking(car)
   * 3. Proveravamo da je rezultat false
   * 4. Proveravamo da fetch NIJE pozvan
   */
  it('does not create booking when rental dates are missing', async () => {
    const { result } = renderHook(() =>
      useCarSearchForm({
        filters,
      })
    );

    let bookingResult = true;

    await act(async () => {
      bookingResult = await result.current.confirmBooking(car);
    });

    expect(bookingResult).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  /**
   * TEST 6: Uspešan booking — uklanjanje auta iz rezultata
   * ZAŠTO: Kada confirmBooking uspe (fetch ok: true), auto treba da
   * se ukloni iz results.data i results.total treba da se smanji za 1.
   * KAKO:
   * 1. Mockujemo fetch da vrati ok: true
   * 2. Renderujemo hook sa initialCars=[car, secondCar]
   * 3. Postavimo startDate i endDate
   * 4. Pozivamo confirmBooking(car) (async)
   * 5. Proveravamo da je bookingResult = true
   * 6. Proveravamo da je car uklonjen iz results.data
   * 7. Proveravamo da je results.total = 1
   * 8. Proveravamo da je fetch pozvan za /api/book-now
   */
  it('removes booked car from results after successful booking', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
    } as Response);

    const { result } = renderHook(() =>
      useCarSearchForm({
        filters,
        initialCars: [car, secondCar],
      })
    );

    act(() => {
      result.current.form.setValue(
        'startDate',
        new Date('2026-08-01T00:00:00.000Z')
      );

      result.current.form.setValue(
        'endDate',
        new Date('2026-08-03T00:00:00.000Z')
      );
    });

    let bookingResult = false;

    await act(async () => {
      bookingResult = await result.current.confirmBooking(car);
    });

    expect(bookingResult).toBe(true);

    expect(result.current.results.data).toEqual([secondCar]);
    expect(result.current.results.total).toBe(1);

    expect(fetch).toHaveBeenCalledWith(
      '/api/book-now',
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  /**
   * TEST 7: Učitavanje renter details
   * ZAŠTO: Kada korisnik otvori detalje automobila, useCarSearchForm
   * treba da zove fetch za /api/users/:renterId i postavi renter state.
   * KAKO:
   * 1. Mockujemo fetch da vrati ok: true i JSON sa renter podacima
   * 2. Renderujemo hook
   * 3. Pozivamo openDetails(car) (async)
   * 4. Čekamo da fetch bude pozvan za /api/users/renter-1
   *    sa AbortSignal (za cleanup)
   * 5. Proveravamo da je selectedCar postavljen
   * 6. Proveravamo da je renter state ažuriran sa podacima
   * 7. Proveravamo da je renterLoading = false
   */
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