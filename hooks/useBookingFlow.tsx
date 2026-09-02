'use client';

import { useState } from 'react';
import { ICar } from '@/lib/model/car/Car';
import { useAuth } from '@/hooks/useAuth';
import l from '@/helper/en';

interface UseBookingFlowProps {
  confirmBooking: (car: ICar) => Promise<void>;
  setSelectedCar: (car: ICar | null) => void;
}

export function useBookingFlow({
  confirmBooking,
  setSelectedCar,
}: UseBookingFlowProps) {
  const { isAuthenticated } = useAuth();

  const [modals, setModals] = useState({ booking: false, details: false });
  const [bookingError, setBookingError] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const handleBooking = async (selectedCar: ICar) => {
    if (isBooking) return;

    setIsBooking(true);
    setBookingError('');

    try {
      await confirmBooking(selectedCar);
      setModals({ booking: false, details: false });
      setSelectedCar(null);
    } catch (error) {
      setBookingError(
        error instanceof Error ? error.message : l.carDetailsPage.bookingFailed
      );
    } finally {
      setIsBooking(false);
    }
  };

  const openBooking = (car: ICar) => {
    setSelectedCar(car);
    setModals({ booking: true, details: false });
  };

  const closeBooking = () => {
    setModals((prev) => ({ ...prev, booking: false }));
    setSelectedCar(null);
    setBookingError('');
  };

  const openDetails = (car: ICar, detailsFn: (car: ICar) => void) => {
    detailsFn(car);
    setModals({ booking: false, details: true });
  };

  const closeDetails = () => {
    setModals((prev) => ({ ...prev, details: false }));
    setSelectedCar(null);
  };

  return {
    modals,
    setModals,
    bookingError,
    isBooking,
    isUnauthorized: !isAuthenticated,
    handleBooking,
    openBooking,
    closeBooking,
    openDetails,
    closeDetails,
  };
}
