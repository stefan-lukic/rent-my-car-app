'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  AlertCircle,
  Banknote,
  CalendarDays,
  CheckCircle2,
  Milestone,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import l from '@/helper/en';
import {
  countInclusiveCalendarDays,
  formatCalendarDate,
} from '@/lib/utils/calendarDate';

interface CarBookingPanelProps {
  carId: string;
  carName: string;
  pricePerDay: number;
  bookedPeriods: Array<{ startDate: string; endDate: string }>;
  today: string;
  initialStartDate?: string;
  initialEndDate?: string;
}

const toLocalCalendarDate = (value: string) => {
  const date = new Date(value);
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

const getInitialDate = (value: string | undefined, minimumDate: Date) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const localDate = toLocalCalendarDate(value);
  return localDate >= minimumDate ? localDate : null;
};

export default function CarBookingPanel({
  carId,
  carName,
  pricePerDay,
  bookedPeriods,
  today,
  initialStartDate,
  initialEndDate,
}: CarBookingPanelProps) {
  const minimumDate = useMemo(() => toLocalCalendarDate(today), [today]);
  const unavailablePeriods = useMemo(
    () =>
      bookedPeriods.map((period) => ({
        start: toLocalCalendarDate(period.startDate),
        end: toLocalCalendarDate(period.endDate),
      })),
    [bookedPeriods]
  );
  const [startDate, setStartDate] = useState<Date | null>(() =>
    getInitialDate(initialStartDate, minimumDate)
  );
  const [endDate, setEndDate] = useState<Date | null>(() => {
    const initialEnd = getInitialDate(initialEndDate, minimumDate);
    const initialStart = getInitialDate(initialStartDate, minimumDate);
    return initialEnd && (!initialStart || initialEnd >= initialStart)
      ? initialEnd
      : null;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error' | 'unauthorized';
    message: string;
  } | null>(null);

  const selectedDays =
    startDate && endDate ? countInclusiveCalendarDays(startDate, endDate) : 0;
  const estimatedTotal = selectedDays * pricePerDay;

  const overlapsExistingBooking = () =>
    Boolean(
      startDate &&
        endDate &&
        unavailablePeriods.some(
          (period) => startDate <= period.end && endDate >= period.start
        )
    );

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date && endDate && endDate < date) setEndDate(null);
    setResult(null);
  };

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      setResult({
        type: 'error',
        message: l.carDetailsPage.selectDatesError,
      });
      return;
    }

    if (overlapsExistingBooking()) {
      setResult({
        type: 'error',
        message: l.carDetailsPage.unavailablePeriodError,
      });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch('/api/book-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId,
          startDate: formatCalendarDate(startDate),
          endDate: formatCalendarDate(endDate),
        }),
      });
      const data = await response.json().catch(() => null);

      if (response.status === 401) {
        setResult({
          type: 'unauthorized',
          message: l.carDetailsPage.signInToReserve,
        });
        return;
      }

      if (!response.ok) {
        setResult({
          type: 'error',
          message: data?.message || l.carDetailsPage.bookingFailed,
        });
        return;
      }

      setResult({
        type: 'success',
        message: l.carDetailsPage.bookingSuccessful(carName),
      });
    } catch {
      setResult({
        type: 'error',
        message: l.carDetailsPage.connectionError,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg lg:sticky lg:top-6 lg:p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            {l.carDetailsPage.reserveThisCar}
          </p>
          <p className="mt-2 font-heading text-3xl font-bold text-ink">
            €{pricePerDay}
            <span className="ml-1 text-sm font-semibold text-slate-500">
              {l.common.perDay}
            </span>
          </p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
          <ShieldCheck className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <label
            htmlFor="car-booking-start-date"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            {l.carDetailsPage.pickupDate}
          </label>
          <DatePicker
            id="car-booking-start-date"
            selected={startDate}
            onChange={handleStartDateChange}
            minDate={minimumDate}
            excludeDateIntervals={unavailablePeriods}
            placeholderText={l.carDetailsPage.selectPickup}
            dateFormat="dd/MM/yyyy"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-tint"
            wrapperClassName="w-full"
          />
        </div>
        <div>
          <label
            htmlFor="car-booking-end-date"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            {l.carDetailsPage.returnDate}
          </label>
          <DatePicker
            id="car-booking-end-date"
            selected={endDate}
            onChange={(date) => {
              setEndDate(date);
              setResult(null);
            }}
            minDate={startDate ?? minimumDate}
            excludeDateIntervals={unavailablePeriods}
            placeholderText={l.carDetailsPage.selectReturn}
            dateFormat="dd/MM/yyyy"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-tint"
            wrapperClassName="w-full"
          />
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <CalendarDays className="h-4 w-4 text-brand" />
          {l.carDetailsPage.priceEstimate}
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
          <span>
            {selectedDays > 0
              ? l.carDetailsPage.days(selectedDays)
              : l.carDetailsPage.chooseDates}
          </span>
          <span className="font-heading text-lg font-bold text-ink">
            €{estimatedTotal}
          </span>
        </div>
      </div>

      {result ? (
        <div
          role="alert"
          className={`mt-4 rounded-xl border p-3 text-sm ${
            result.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : result.type === 'unauthorized'
                ? 'border-amber-200 bg-amber-50 text-amber-800'
                : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          <div className="flex items-start gap-2">
            {result.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            )}
            <div>
              <p>{result.message}</p>
              {result.type === 'unauthorized' ? (
                <Link
                  href="/sign-in"
                  className="mt-1 inline-block font-bold underline"
                >
                  {l.carDetailsPage.goToSignIn}
                </Link>
              ) : null}
              {result.type === 'success' ? (
                <Link
                  href="/profile/my-profile"
                  className="mt-1 inline-block font-bold underline"
                >
                  {l.carDetailsPage.viewMyRentals}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleBooking}
        disabled={isSubmitting || result?.type === 'success'}
        className="mt-5 w-full rounded-xl bg-brand px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? l.carDetailsPage.reserving : l.carDetailsPage.bookNow}
      </button>

      <p className="mt-3 text-center text-xs leading-5 text-slate-500">
        {l.carDetailsPage.availabilityNote}
      </p>

      <section className="mt-6 border-t border-slate-200 pt-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          {l.carDetailsPage.tripTerms}
        </h2>

        <div className="mt-4 divide-y divide-slate-100">
          <div className="flex gap-3 pb-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                {l.carDetailsPage.cancellationPolicy}
              </p>
              <p className="mt-1 text-sm font-semibold text-ink-secondary">
                {l.carDetailsPage.flexibleCancellation}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {l.carDetailsPage.cancellationSummary}
              </p>
              <Link
                href="/cancellation"
                className="mt-2 inline-flex text-xs font-semibold text-brand transition-colors hover:text-brand/90"
              >
                {l.carDetailsPage.viewCancellationPolicy}
              </Link>
            </div>
          </div>

          <div className="flex gap-3 py-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Banknote className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                {l.carDetailsPage.paymentOptions}
              </p>
              <p className="mt-1 text-sm font-semibold text-ink-secondary">
                {l.carDetailsPage.payInPerson}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {l.carDetailsPage.paymentSummary}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand">
              <Milestone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                {l.carDetailsPage.distanceIncluded}
              </p>
              <p className="mt-1 text-sm font-semibold text-ink-secondary">
                {l.carDetailsPage.unlimitedDistance}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {l.carDetailsPage.distanceSummary}
              </p>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}
