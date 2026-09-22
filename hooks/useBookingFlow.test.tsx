import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ICar } from '@/lib/model/car/Car';
import { useBookingFlow } from './useBookingFlow';

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: mocks.useAuth,
}));

const car = {
  _id: 'car-1',
  make: 'BMW',
  carModel: 'X5',
} as ICar;

describe('useBookingFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useAuth.mockReturnValue({
      isAuthenticated: true,
    });
  });

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

    expect(result.current.bookingError).toBe('');
    expect(result.current.isBooking).toBe(false);
  });

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

  it('closes booking, clears selected car and resets booking error', async () => {
    const setSelectedCar = vi.fn();
    const confirmBooking = vi
      .fn()
      .mockRejectedValue(new Error('Booking period is unavailable'));

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

    expect(result.current.bookingError).toBe('Booking period is unavailable');
    expect(result.current.bookingSuccess).toBe('');

    act(() => {
      result.current.closeBooking();
    });

    expect(result.current.modals.booking).toBe(false);
    expect(result.current.bookingError).toBe('');
    expect(result.current.bookingSuccess).toBe('');
    expect(setSelectedCar).toHaveBeenLastCalledWith(null);
  });

  it('closes all modals and clears car after successful booking', async () => {
    const setSelectedCar = vi.fn();
    const confirmBooking = vi.fn().mockResolvedValue(undefined);

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

    expect(result.current.bookingError).toBe('');
    expect(result.current.bookingSuccess).toBe(
      'BMW X5 is reserved. You can review the trip in My Rentals.'
    );
    expect(setSelectedCar).toHaveBeenLastCalledWith(null);

    act(() => {
      result.current.dismissBookingSuccess();
    });

    expect(result.current.bookingSuccess).toBe('');

    act(() => {
      result.current.openBooking(car);
    });

    expect(result.current.bookingSuccess).toBe('');
  });

  it('prevents another booking submission while one is pending', async () => {
    let finishBooking: () => void = () => undefined;
    const pendingBooking = new Promise<void>((resolve) => {
      finishBooking = resolve;
    });
    const confirmBooking = vi.fn().mockReturnValue(pendingBooking);

    const { result } = renderHook(() =>
      useBookingFlow({ confirmBooking, setSelectedCar: vi.fn() })
    );

    let firstBooking: Promise<void>;
    act(() => {
      firstBooking = result.current.handleBooking(car);
    });

    expect(result.current.isBooking).toBe(true);

    await act(async () => {
      await result.current.handleBooking(car);
    });

    expect(confirmBooking).toHaveBeenCalledOnce();

    finishBooking();
    await act(async () => {
      await firstBooking;
    });

    expect(result.current.isBooking).toBe(false);
  });

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
