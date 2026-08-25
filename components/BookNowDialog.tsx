import { ICar } from '@/lib/model/car/Car';
import Image from 'next/image';
import React from 'react';
import l from '@/helper/en';

interface BookingDialogProps {
  car: ICar;
  isOpen: boolean;
  startDate: Date | null;
  endDate: Date | null;
  isUnauthorized: boolean;
  bookingFailed: boolean;
  onClose: () => void;
  onBook: () => void;
}

const BookingDialog: React.FC<BookingDialogProps> = ({
  car,
  isOpen,
  startDate,
  endDate,
  isUnauthorized,
  bookingFailed,
  onClose,
  onBook,
}) => {
  if (!isOpen) return null;

  const calculateDays = () => {
    if (startDate && endDate) {
      return (
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
      );
    }
    return 0;
  };

  const days = calculateDays();
  const totalPrice = days * car.pricePerDay;

  const formatDate = (date: Date | null) =>
    date
      ? date.toLocaleDateString('en-GB', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        })
      : '';

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {l.booking.bookMakeModel(car.make, car.carModel)}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            {l.common.close}
          </button>
        </div>

        <div className="px-6 py-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
            <div className="w-20 h-14 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {car.images?.[0] ? (
                <Image
                  src={car.images[0]}
                  alt={car.carModel}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  {l.common.noPhoto}
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {car.make} {car.carModel}
              </p>
              <p className="text-sm text-gray-500">
                {capitalize(car.carType)} • {car.city}
              </p>
              <p className="text-sm text-blue-500 font-medium">
                €{car.pricePerDay}
                {l.common.perDay}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {l.search.pickUpDate}
              </p>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
                <span className="text-gray-400 text-sm">📅</span>
                <span className="text-sm text-gray-700">
                  {formatDate(startDate)}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {l.search.returnDateLabel}
              </p>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
                <span className="text-gray-400 text-sm">📅</span>
                <span className="text-sm text-gray-700">
                  {formatDate(endDate)}
                </span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {l.common.estimatedTotal}
              </p>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>
                €{car.pricePerDay} × {days} {l.common.days(days)}
              </span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold text-gray-900">
              <span>{l.common.total}</span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {isUnauthorized && (
          <div className="mx-6 mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-amber-500">🔒</span>
              <p className="text-sm text-amber-800 font-medium">
                {l.common.signInToReserve}
              </p>
            </div>
            <a
              href="/sign-in"
              className="text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
            >
              {l.common.signIn}
            </a>
          </div>
        )}

        {bookingFailed && (
          <div className="mx-6 mb-3 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700 font-medium">
              {l.common.bookingFailed}
            </p>
          </div>
        )}

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            {l.common.cancel}
          </button>
          <button
            onClick={onBook}
            className="flex-1 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            {l.common.confirmReservation}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDialog;
