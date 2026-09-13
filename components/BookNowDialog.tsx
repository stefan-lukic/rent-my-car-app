import { ICar } from '@/lib/model/car/Car';
import Image from 'next/image';
import React from 'react';
import l from '@/helper/en';
import { countInclusiveCalendarDays } from '@/lib/utils/calendarDate';

const FOCUSABLE_ELEMENTS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface BookingDialogProps {
  car: ICar;
  isOpen: boolean;
  startDate: Date | null;
  endDate: Date | null;
  isUnauthorized: boolean;
  bookingError: string;
  isBooking: boolean;
  onClose: () => void;
  onBook: () => void;
}

const BookingDialog: React.FC<BookingDialogProps> = ({
  car,
  isOpen,
  startDate,
  endDate,
  isUnauthorized,
  bookingError,
  isBooking,
  onClose,
  onBook,
}) => {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    // Keep keyboard focus and page scrolling contained while the dialog is open.
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== 'Tab' || !dialogRef.current) return;

    const focusableElements = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS)
    );

    if (focusableElements.length === 0) {
      event.preventDefault();
      dialogRef.current.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (
      event.shiftKey &&
      (document.activeElement === firstElement ||
        document.activeElement === dialogRef.current)
    ) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  const calculateDays = () => {
    if (startDate && endDate) {
      return countInclusiveCalendarDays(startDate, endDate);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-[2px] sm:p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-dialog-title"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl outline-none sm:max-h-[calc(100dvh-2rem)]"
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 px-5 pb-4 pt-5 sm:px-6">
          <div>
            <h2
              id="booking-dialog-title"
              className="text-lg font-bold text-gray-900"
            >
              {l.booking.bookMakeModel(car.make, car.carModel)}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close booking dialog"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {l.common.close}
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-4 sm:px-6">
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
                €{car.pricePerDay} × {l.common.days(days)}
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

        {bookingError && (
          <div
            role="alert"
            className="mx-5 mb-3 rounded-xl border border-red-200 bg-red-50 p-3 sm:mx-6"
          >
            <p className="text-sm text-red-700 font-medium">{bookingError}</p>
          </div>
        )}

        <div className="flex flex-shrink-0 gap-3 border-t border-gray-100 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pb-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {l.common.cancel}
          </button>
          <button
            type="button"
            onClick={onBook}
            disabled={isBooking}
            aria-busy={isBooking}
            className="flex-1 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBooking
              ? l.carDetailsPage.reserving
              : l.common.confirmReservation}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDialog;
