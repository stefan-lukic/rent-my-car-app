'use client';

import { useState } from 'react';
import { Button } from './UI/Button';
import { RentalWithCar } from '@/types/RentalWithCar';
import l from '@/helper/en';

interface CancelRentalModalProps {
  isOpen: boolean;
  rentalId: string;
  onCancelled: (updatedRental: RentalWithCar) => void;
  onClose: () => void;
}

interface CancelRentalResponse {
  rental: RentalWithCar;
  message?: string;
}

const CancelRentalModal: React.FC<CancelRentalModalProps> = ({
  isOpen,
  rentalId,
  onCancelled,
  onClose,
}) => {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const response = await fetch('/api/rentals/cancel-rental', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rentalId }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || l.errors.anErrorOccurred);
      }

      const data: CancelRentalResponse = await response.json();

      onCancelled(data.rental);
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : l.errors.anErrorOccurred);
    } finally {
      setIsCancelling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <h2 className="mb-2 font-heading text-xl font-bold text-ink">
          {l.booking.cancelReservation}
        </h2>
        <p className="mb-6 text-sm leading-6 text-slate-500">
          {l.booking.cancelReservationConfirm}
        </p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            variant="outline"
            className="sm:min-w-32"
          >
            {l.booking.keepReservation}
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling}
            variant="destructive"
            className="sm:min-w-32"
          >
            {isCancelling
              ? l.booking.cancellingReservation
              : l.booking.cancelReservation}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelRentalModal;
