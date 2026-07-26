/**
 * useBookingFlow.test.tsx
 *
 * useBookingFlow hook upravlja booking modalima i flow-om za rezervaciju:
 *   - modals: objekat sa booking i details boolean vrednostima
 *   - bookingFailed: boolean za prikaz greške pri rezervaciji
 *   - isUnauthorized: boolean — true ako korisnik nije ulogovan
 *   - openBooking(car): otvara booking modal i postavlja selectedCar
 *   - closeBooking(): zatvara booking modal i resetuje state
 *   - openDetails(car, detailsFn): otvara details modal i poziva callback
 *   - handleBooking(car): pokušava da rezerviše (zove confirmBooking)
 *     i zatvara modal ako uspe, ili postavlja bookingFailed ako ne uspe
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je hook test — testiraju se stvarni state i grane hook-a.
 * - Koristimo renderHook + act iz React Testing Library.
 * - useAuth je mockovan (vi.hoisted) da kontrolišemo autentikaciju.
 * - confirmBooking i setSelectedCar su mockove koji se prosleđuju
 *   kao props hooku.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - useBookingFlow zavisi od useAuth (isUnauthorized) i spoljnih callback-a.
 * - Zato mockujemo useAuth i prosleđujemo mockove za confirmBooking
 *   i setSelectedCar.
 * - Testiramo: otvaranje/zatvaranje modala, booking flow (uspeh/neuspeh),
 *   i details flow.
 */

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ICar } from '@/lib/model/car/Car';
import { useBookingFlow } from './useBookingFlow';

/**
 * mocks.useAuth: cross-module mock za useAuth hook.
 * Značaj: useBookingFlow koristi useAuth da bi dobio isAuthenticated
 * state, koji se koristi za isUnauthorized property.
 *
 * vi.hoisted() je potreban jer useBookingFlow.tsx importuje useAuth
 * na top nivou, a mock factory takođe treba pristup istom mocku.
 */
const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
}));

/**
 * Mockujemo useAuth hook.
 * Značaj: useBookingFlow zavisi od isAuthenticated state-a.
 * Zato ga mockujemo da kontrolišemo da li je korisnik ulogovan ili ne.
 */
vi.mock('@/hooks/useAuth', () => ({
  useAuth: mocks.useAuth,
}));

/**
 * car: fiksni testni podaci za automobil.
 * Značaj: Koristimo ga kao argument za openBooking i handleBooking.
 * ICar type osigurava da su svi Required polja prisutna.
 */
const car = {
  _id: 'car-1',
  make: 'BMW',
  carModel: 'X5',
} as ICar;

describe('useBookingFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    /**
     * Default: korisnik je ulogovan.
     * Značaj: Većina testova testira booking flow za autentifikovane
     * korisnike. Za unauthorized test, override-ujemo u tom testu.
     */
    mocks.useAuth.mockReturnValue({
      isAuthenticated: true,
    });
  });

  /**
   * TEST 1: Početno stanje modala
   * ZAŠTO: useBookingFlow treba da počne sa oba modala zatvorena
   * i bookingFailed = false.
   * KAKO:
   * 1. Renderujemo hook sa dummy confirmBooking i setSelectedCar
   * 2. Proveravamo da je modals.booking = false
   * 3. Proveravamo da je modals.details = false
   * 4. Proveravamo da je bookingFailed = false
   */
  it('starts with both modals closed', () => {
    const { result } = renderHook(() =>
      useBookingFlow({
        confirmBooking: vi.fn(),
        setSelectedCar: vi.fn(),
      })
    );

    expect(result.current.modals).toEqual({
      booking: false,
      details: false,
    });

    expect(result.current.bookingFailed).toBe(false);
  });

  /**
   * TEST 2: Unauthorized state za neulogovanog korisnika
   * ZAŠTO: useBookingFlow treba da postavi isUnauthorized = true
   * kada korisnik nije ulogovan (da bi se prikao "Sign in to reserve" banner).
   * KAKO:
   * 1. Override-ujemo useAuth da vrati isAuthenticated: false
   * 2. Renderujemo hook
   * 3. Proveravamo da je isUnauthorized = true
   */
  it('sets unauthorized state when user is not authenticated', () => {
    mocks.useAuth.mockReturnValue({
      isAuthenticated: false,
    });

    const { result } = renderHook(() =>
      useBookingFlow({
        confirmBooking: vi.fn(),
        setSelectedCar: vi.fn(),
      })
    );

    expect(result.current.isUnauthorized).toBe(true);
  });

  /**
   * TEST 3: Otvaranje booking modala i selekcija automobila
   * ZAŠTO: Kada korisnik klikne "Book Now", treba da se otvori
   * booking modal i da se postavi selectedCar.
   * KAKO:
   * 1. Kreiramo setSelectedCar mock da možemo da proverimo poziv
   * 2. Pozivamo openBooking(car)
   * 3. Proveravamo da je modals.booking = true
   * 4. Proveravamo da je modals.details = false (ne sme da bude otvoreno)
   * 5. Proveravamo da je setSelectedCar pozvan sa car objektom
   */
  it('opens booking and selects the car', () => {
    const setSelectedCar = vi.fn();

    const { result } = renderHook(() =>
      useBookingFlow({
        confirmBooking: vi.fn(),
        setSelectedCar,
      })
    );

    act(() => {
      result.current.openBooking(car);
    });

    expect(result.current.modals).toEqual({
      booking: true,
      details: false,
    });

    expect(setSelectedCar).toHaveBeenCalledWith(car);
  });

  /**
   * TEST 4: Zatvaranje booking modala nakon neuspeha
   * ZAŠTO: Ako confirmBooking vrati false (neuspeh), bookingFailed
   * treba da bude postavljen na true. Kada korisnik zatvori modal,
   * sve treba da se resetuje (modals.booking = false,
   * bookingFailed = false, setSelectedCar(null)).
   * KAKO:
   * 1. Kreiramo confirmBooking mock koji vraća false (simuliram neuspeh)
   * 2. Otvaramo booking modal
   * 3. Pozivamo handleBooking (async)
   * 4. Proveravamo da je bookingFailed = true
   * 5. Zatvaramo booking modal
   * 6. Proveravamo da je sve resetovano
   */
  it('closes booking, clears selected car and resets booking error', async () => {
    const setSelectedCar = vi.fn();
    const confirmBooking = vi.fn().mockResolvedValue(false);

    const { result } = renderHook(() =>
      useBookingFlow({
        confirmBooking,
        setSelectedCar,
      })
    );

    act(() => {
      result.current.openBooking(car);
    });

    await act(async () => {
      await result.current.handleBooking(car);
    });

    expect(result.current.bookingFailed).toBe(true);

    act(() => {
      result.current.closeBooking();
    });

    expect(result.current.modals.booking).toBe(false);
    expect(result.current.bookingFailed).toBe(false);
    expect(setSelectedCar).toHaveBeenLastCalledWith(null);
  });

  /**
   * TEST 5: Uspešan booking — zatvaranje i reset
   * ZAŠTO: Ako confirmBooking vrati true (uspeh), svi modali treba
   * da se zatvore, selectedCar treba da se obriše, i bookingFailed
   * treba da bude false.
   * KAKO:
   * 1. Kreiramo confirmBooking mock koji vraća true (uspeh)
   * 2. Otvaramo booking modal
   * 3. Pozivamo handleBooking (async)
   * 4. Proveravamo da je confirmBooking pozvan sa car
   * 5. Proveravamo da su svi modali zatvoreni
   * 6. Proveravamo da je selectedCar obrisan (setSelectedCar(null))
   */
  it('closes all modals and clears car after successful booking', async () => {
    const setSelectedCar = vi.fn();
    const confirmBooking = vi.fn().mockResolvedValue(true);

    const { result } = renderHook(() =>
      useBookingFlow({
        confirmBooking,
        setSelectedCar,
      })
    );

    act(() => {
      result.current.openBooking(car);
    });

    await act(async () => {
      await result.current.handleBooking(car);
    });

    expect(confirmBooking).toHaveBeenCalledWith(car);

    expect(result.current.modals).toEqual({
      booking: false,
      details: false,
    });

    expect(result.current.bookingFailed).toBe(false);
    expect(setSelectedCar).toHaveBeenLastCalledWith(null);
  });

  /**
   * TEST 6: Otvaranje details modala i callback
   * ZAŠTO: Kada korisnik klikne na "Details" dugme za automobil,
   * treba da se otvori details modal i da se pozove dati callback
   * (npr. za prikaz detalja auta).
   * KAKO:
   * 1. Kreiramo detailsFn mock
   * 2. Pozivamo openDetails(car, detailsFn)
   * 3. Proveravamo da je detailsFn pozvan sa car objektom
   * 4. Proveravamo da je modals.details = true
   * 5. Proveravamo da je modals.booking = false (ne sme biti otvoreno)
   */
  it('opens details and calls the provided details callback', () => {
    const detailsFn = vi.fn();

    const { result } = renderHook(() =>
      useBookingFlow({
        confirmBooking: vi.fn(),
        setSelectedCar: vi.fn(),
      })
    );

    act(() => {
      result.current.openDetails(car, detailsFn);
    });

    expect(detailsFn).toHaveBeenCalledWith(car);

    expect(result.current.modals).toEqual({
      booking: false,
      details: true,
    });
  });
});