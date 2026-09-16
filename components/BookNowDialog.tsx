import { ICar } from '@/lib/model/car/Car';
import Image from 'next/image';
import React from 'react';
import { CalendarDays } from 'lucide-react';
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-3 backdrop-blur-[2px] sm:p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-dialog-title"
        tabIndex={-1}
        className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-surface-0 shadow-xl outline-none sm:max-h-[calc(100dvh-2rem)]"
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-5 pb-4 pt-5 sm:px-6">
          <div>
            <h2
              id="booking-dialog-title"
              className="font-heading text-lg font-bold text-ink"
            >
              {l.booking.bookMakeModel(car.make, car.carModel)}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close booking dialog"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl leading-none text-body transition-colors hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            {l.common.close}
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3 rounded-xl border border-border p-3">
            <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-surface">
              {car.images?.[0] ? (
                <Image
                  src={car.images[0]}
                  alt={car.carModel}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-body">
                  {l.common.noPhoto}
                </div>
              )}
            </div>
            <div>
              <p className="font-heading font-semibold text-ink">
                {car.make} {car.carModel}
              </p>
              <p className="text-sm text-body">
                {capitalize(car.carType)} • {car.city}
              </p>
              <p className="text-sm font-medium text-brand">
                €{car.pricePerDay}
                {l.common.perDay}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-body">
                {l.search.pickUpDate}
              </p>
              <div className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5">
                <CalendarDays
                  aria-hidden="true"
                  className="h-4 w-4 text-brand"
                />
                <span className="text-sm text-body">
                  {formatDate(startDate)}
                </span>
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-body">
                {l.search.returnDateLabel}
              </p>
              <div className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5">
                <CalendarDays
                  aria-hidden="true"
                  className="h-4 w-4 text-brand"
                />
                <span className="text-sm text-body">{formatDate(endDate)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              <p className="text-xs font-semibold uppercase tracking-wide text-body">
                {l.common.estimatedTotal}
              </p>
            </div>
            <div className="mb-1 flex justify-between text-sm text-body">
              <span>
                €{car.pricePerDay} × {l.common.days(days)}
              </span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold text-ink">
              <span>{l.common.total}</span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {isUnauthorized && (
          <div className="mx-6 mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="text-amber-600">
                !
              </span>
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

        <div className="flex flex-shrink-0 gap-3 border-t border-slate-100 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pb-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {l.common.cancel}
          </button>
          <button
            type="button"
            onClick={onBook}
            disabled={isBooking}
            aria-busy={isBooking}
            className="flex-1 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
