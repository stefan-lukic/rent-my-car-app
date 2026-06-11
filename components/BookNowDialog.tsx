import { ICar } from '@/lib/model/car/Car';
import React from 'react';

interface BookingDialogProps {
  car: ICar;
  isOpen: boolean;
  startDate: Date | null;
  endDate: Date | null;
  onClose: () => void;
  onBook: () => void;
}

const BookingDialog: React.FC<BookingDialogProps> = ({
  car,
  isOpen,
  startDate,
  endDate,
  onClose,
  onBook,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBook();
  };

  const calculateTotalPrice = () => {
    if (startDate && endDate) {
      const days =
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
      return days * car.pricePerDay;
    }
    return 0;
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Book {car.carModel}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p>Start Date: {startDate?.toLocaleDateString()}</p>
            <p>End Date: {endDate?.toLocaleDateString()}</p>
            <p className="mt-2 font-semibold">
              Total Price: ${totalPrice.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingDialog;
