'use client';

import { useState } from 'react';
import { Button } from './UI/Button';
import { Dialog } from './UI/Dialog';
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
    <Dialog
      onClose={onClose}
      ariaLabelledBy="cancel-rental-title"
      overlayClassName="z-[110] bg-ink/60 p-4 backdrop-blur-[2px]"
      panelClassName="w-full max-w-sm rounded-2xl border border-border bg-white p-6 shadow-xl"
    >
      {/* Keep cancellation controls inside the shared keyboard boundary. */}
      <h2
        id="cancel-rental-title"
        className="mb-2 font-heading text-xl font-bold text-ink"
      >
        {l.booking.cancelReservation}
      </h2>
      <p className="mb-6 text-sm leading-6 text-body-subtle">
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
    </Dialog>
  );
};

export default CancelRentalModal;
