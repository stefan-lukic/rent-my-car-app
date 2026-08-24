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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[110]">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-2">{l.booking.cancelReservation}</h2>
        <p className="text-gray-500 mb-6">
          {l.booking.cancelReservationConfirm}
        </p>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            className="bg-gray-300 hover:bg-gray-400 text-black"
          >
            {l.booking.keepReservation}
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isCancelling ? l.booking.cancellingReservation : l.booking.cancelReservation}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelRentalModal;
