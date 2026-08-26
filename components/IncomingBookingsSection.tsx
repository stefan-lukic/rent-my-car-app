'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  UserRound,
} from 'lucide-react';
import { OwnerBooking } from '@/types/OwnerBooking';
import RentalStatusFilter from './RentalStatusFilter';
import {
  getRentalLifecycleStatus,
  RentalLifecycleStatus,
  RentalStatusFilterValue,
} from '@/lib/rentalLifecycle';
import l from '@/helper/en';
import RatingModal from './RatingModal';

interface IncomingBookingsSectionProps {
  bookings: OwnerBooking[];
  currentDate: string;
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const formatDate = (date: string | Date) =>
  dateFormatter.format(new Date(date));

const statusPresentation = {
  [RentalLifecycleStatus.Upcoming]: {
    label: l.status.upcoming,
    className: 'bg-blue-100 text-blue-700',
  },
  [RentalLifecycleStatus.Ongoing]: {
    label: l.status.ongoing,
    className: 'bg-emerald-100 text-emerald-700',
  },
  [RentalLifecycleStatus.Completed]: {
    label: l.status.completed,
    className: 'bg-slate-100 text-slate-600',
  },
  [RentalLifecycleStatus.Cancelled]: {
    label: l.status.cancelled,
    className: 'bg-red-100 text-red-700',
  },
};

export default function IncomingBookingsSection({
  bookings: initialBookings,
  currentDate,
}: IncomingBookingsSectionProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [currentPage, setCurrentPage] = useState(0);
  const [bookingToReview, setBookingToReview] = useState<OwnerBooking | null>(
    null
  );
  const [statusFilter, setStatusFilter] =
    useState<RentalStatusFilterValue>('all');
  const visibleBookings = bookings.filter(
    (booking) => booking.car !== null && booking.client !== null
  );
  const bookingCounts = visibleBookings.reduce(
    (counts, booking) => {
      const status = getRentalLifecycleStatus(booking, currentDate);
      counts.all += 1;
      counts[status] += 1;
      return counts;
    },
    {
      all: 0,
      [RentalLifecycleStatus.Upcoming]: 0,
      [RentalLifecycleStatus.Ongoing]: 0,
      [RentalLifecycleStatus.Completed]: 0,
      [RentalLifecycleStatus.Cancelled]: 0,
    }
  );
  const filteredBookings = visibleBookings.filter(
    (booking) =>
      statusFilter === 'all' ||
      getRentalLifecycleStatus(booking, currentDate) === statusFilter
  );
  const bookingsPerPage = 2;
  const pageCount = Math.ceil(filteredBookings.length / bookingsPerPage);
  const currentBookings = filteredBookings.slice(
    currentPage * bookingsPerPage,
    currentPage * bookingsPerPage + bookingsPerPage
  );
  const activeBookingCount = visibleBookings.filter((booking) => {
    const status = getRentalLifecycleStatus(booking, currentDate);
    return (
      status === RentalLifecycleStatus.Upcoming ||
      status === RentalLifecycleStatus.Ongoing
    );
  }).length;

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:items-center sm:px-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
            Owner dashboard
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">
            Bookings for your cars
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            See who booked your vehicles and prepare for the next handoff.
          </p>
        </div>

        {activeBookingCount > 0 && (
          <span className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
            <Clock3 className="h-3.5 w-3.5" />
            {activeBookingCount} active
          </span>
        )}
      </div>

      {visibleBookings.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <CalendarDays className="h-6 w-6" />
          </span>
          <h3 className="mt-4 font-bold text-slate-900">
            No bookings for your cars yet
          </h3>
          <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
            When another user reserves one of your vehicles, their dates and
            contact details will appear here.
          </p>
        </div>
      ) : (
        <div className="p-5 lg:p-6">
          <RentalStatusFilter
            value={statusFilter}
            counts={bookingCounts}
            label="Filter incoming bookings by status"
            onChange={(status) => {
              setStatusFilter(status);
              setCurrentPage(0);
            }}
          />
          {filteredBookings.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
              No bookings match this status.
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {currentBookings.map((booking) => {
                const car = booking.car!;
                const client = booking.client!;
                const lifecycleStatus = getRentalLifecycleStatus(
                  booking,
                  currentDate
                );
                const status = statusPresentation[lifecycleStatus];
                const pickupLocation = booking.carLocation || car.carLocation;

                return (
                  <article
                    key={booking._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex gap-4 border-b border-slate-100 bg-slate-50 p-4">
                      <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-200">
                        <Image
                          src={car.images?.[0] || '/placeholder-car.svg'}
                          alt={`${car.make} ${car.carModel}`}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600">
                              Your vehicle
                            </p>
                            <h3 className="mt-1 truncate font-bold text-slate-950">
                              {car.make} {car.carModel}
                            </h3>
                          </div>
                          <span
                            className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        {pickupLocation && (
                          <p className="mt-2 flex items-center gap-1.5 truncate text-xs text-slate-500">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-blue-500" />
                            {pickupLocation}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 p-4">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                          Reserved period
                        </p>
                        <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-700">
                          <span>
                            {formatDate(booking.rentalPeriod.startDate)}
                          </span>
                          <span className="text-slate-400">→</span>
                          <span>
                            {formatDate(booking.rentalPeriod.endDate)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-100 text-blue-700">
                          {client.images?.[0] ? (
                            <Image
                              src={client.images[0]}
                              alt={client.name || 'Booking customer'}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          ) : (
                            <UserRound className="h-5 w-5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Booked by
                          </p>
                          <p className="truncate text-sm font-bold text-slate-900">
                            {client.name || 'RentMyCar user'}
                          </p>
                          {client.ratingCount ? (
                            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              {client.rating?.toFixed(1)} ({client.ratingCount}{' '}
                              {l.reviews.ratings})
                            </p>
                          ) : (
                            <p className="mt-1 text-xs text-slate-400">
                              {l.profile.noRatingYet}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-blue-600">
                            €{booking.totalCost}
                          </p>
                          <p className="text-[10px] uppercase tracking-wide text-slate-400">
                            Total
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Email
                          </p>
                          <a
                            href={`mailto:${client.email}`}
                            className="mt-1 block truncate text-xs font-semibold text-slate-700 transition hover:text-blue-600"
                          >
                            {client.email}
                          </a>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Phone
                          </p>
                          {client.contactInfo ? (
                            <a
                              href={`tel:${client.contactInfo}`}
                              className="mt-1 block truncate text-xs font-semibold text-slate-700 transition hover:text-blue-600"
                            >
                              {client.contactInfo}
                            </a>
                          ) : (
                            <p className="mt-1 text-xs font-medium text-slate-400">
                              No phone provided
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <a
                          href={`mailto:${client.email}`}
                          className="flex min-w-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Mail className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Email</span>
                        </a>
                        {client.contactInfo ? (
                          <a
                            href={`tel:${client.contactInfo}`}
                            className="flex min-w-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Phone className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">Call</span>
                          </a>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-xs font-semibold text-slate-400"
                          >
                            <Phone className="h-4 w-4" />
                            Call
                          </button>
                        )}
                        <button
                          type="button"
                          disabled
                          aria-label="Message customer, coming soon"
                          className="flex min-w-0 flex-col items-center justify-center rounded-xl bg-blue-50 px-2 py-1.5 text-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          <span className="flex items-center gap-1 text-xs font-semibold">
                            <MessageCircle className="h-4 w-4" />
                            Message
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wide text-blue-400">
                            Coming soon
                          </span>
                        </button>
                      </div>

                      {lifecycleStatus === RentalLifecycleStatus.Completed &&
                        (booking.ownerReview?.submittedAt ? (
                          <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-2.5 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" />
                            {l.reviews.clientRated}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setBookingToReview(booking)}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
                          >
                            <Star className="h-4 w-4" />
                            {l.reviews.rateClient}
                          </button>
                        ))}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-3 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            aria-label="Previous bookings page"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((page) => page - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-semibold text-slate-500">
            Page {currentPage + 1} of {pageCount}
          </span>
          <button
            type="button"
            aria-label="Next bookings page"
            disabled={currentPage === pageCount - 1}
            onClick={() => setCurrentPage((page) => page + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {bookingToReview?.client && (
        <RatingModal
          rentalId={bookingToReview._id}
          reviewerRole="owner"
          targetName={bookingToReview.client.name || 'RentMyCar user'}
          onClose={() => setBookingToReview(null)}
          onSubmitted={(review) => {
            setBookings((currentBookings) =>
              currentBookings.map((booking) =>
                booking._id === bookingToReview._id
                  ? {
                      ...booking,
                      ownerReview: review,
                    }
                  : booking
              )
            );
            setBookingToReview(null);
          }}
        />
      )}
    </section>
  );
}
