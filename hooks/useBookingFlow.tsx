'use client';

import { useState } from 'react';
import { ICar } from '@/lib/model/car/Car';
import { useAuth } from '@/hooks/useAuth';

interface UseBookingFlowProps {
  confirmBooking: (car: ICar) => Promise<boolean>;
  setSelectedCar: (car: ICar | null) => void;
}

export function useBookingFlow({
  confirmBooking,
  setSelectedCar,
}: UseBookingFlowProps) {
  const { isAuthenticated } = useAuth();

  const [modals, setModals] = useState({ booking: false, details: false });
  const [bookingFailed, setBookingFailed] = useState(false);

  const handleBooking = async (selectedCar: ICar) => {
    const ok = await confirmBooking(selectedCar);
    if (ok) {
      setModals({ booking: false, details: false });
      setSelectedCar(null);
      setBookingFailed(false);
    } else {
      setBookingFailed(true);
    }
  };

  const openBooking = (car: ICar) => {
    setSelectedCar(car);
    setModals({ booking: true, details: false });
  };

  const closeBooking = () => {
    setModals((prev) => ({ ...prev, booking: false }));
    setSelectedCar(null);
    setBookingFailed(false);
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
    bookingFailed,
    isUnauthorized: !isAuthenticated,
    handleBooking,
    openBooking,
    closeBooking,
    openDetails,
    closeDetails,
  };
}
