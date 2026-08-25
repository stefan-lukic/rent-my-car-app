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

    expect(result.current.bookingFailed).toBe(false);
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
