import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import IncomingBookingsSection from './IncomingBookingsSection';
import { RentalStatus } from '@/types/RentalWithCar';
import l from '@/helper/en';

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) =>
    React.createElement('img', { src, alt }),
}));

const currentDate = '2026-08-25';
const booking = {
  _id: 'booking-1',
  car: {
    _id: 'car-1',
    make: 'BMW',
    carModel: 'X5',
    images: ['/bmw.jpg'],
    city: 'Novi Sad',
    carLocation: 'City center',
  },
  client: {
    _id: 'client-1',
    name: 'Ana Jovanovic',
    email: 'ana@example.com',
    contactInfo: '+381601234567',
    images: ['/ana.jpg'],
    rating: 4.7,
    ratingCount: 6,
  },
  carLocation: 'City center',
  rentalPeriod: {
    startDate: '2026-09-01T00:00:00.000Z',
    endDate: '2026-09-05T00:00:00.000Z',
  },
  totalCost: 400,
  status: RentalStatus.Active,
};

describe('IncomingBookingsSection', () => {
  it('shows the booked car, customer, dates and contact actions', () => {
    render(
      <IncomingBookingsSection bookings={[booking]} currentDate={currentDate} />
    );

    expect(screen.getByText('BMW X5')).toBeInTheDocument();
    expect(screen.getByText('Ana Jovanovic')).toBeInTheDocument();
    expect(screen.getByText(/4\.7 \(6 ratings\)/)).toBeInTheDocument();
    expect(screen.getAllByText('Upcoming')).toHaveLength(2);
    expect(screen.getByText('01 Sept 2026')).toBeInTheDocument();
    expect(screen.getByText('05 Sept 2026')).toBeInTheDocument();
    expect(screen.getByText('€400')).toBeInTheDocument();
    expect(screen.getByText('ana@example.com')).toHaveAttribute(
      'href',
      'mailto:ana@example.com'
    );
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:ana@example.com'
    );
    expect(screen.getByRole('link', { name: '+381601234567' })).toHaveAttribute(
      'href',
      'tel:+381601234567'
    );
    expect(screen.getByRole('link', { name: 'Call' })).toHaveAttribute(
      'href',
      'tel:+381601234567'
    );
    expect(
      screen.getByRole('button', {
        name: 'Message customer, coming soon',
      })
    ).toBeDisabled();
  });

  it('shows two bookings per page and navigates horizontally', async () => {
    const user = userEvent.setup();
    const bookings = [
      booking,
      {
        ...booking,
        _id: 'booking-2',
        car: { ...booking.car, _id: 'car-2', carModel: 'X3' },
      },
      {
        ...booking,
        _id: 'booking-3',
        car: { ...booking.car, _id: 'car-3', carModel: 'M3' },
      },
    ];

    render(
      <IncomingBookingsSection bookings={bookings} currentDate={currentDate} />
    );

    expect(screen.getByText('BMW X5')).toBeInTheDocument();
    expect(screen.getByText('BMW X3')).toBeInTheDocument();
    expect(screen.queryByText('BMW M3')).not.toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Next bookings page' })
    );

    expect(screen.getByText('BMW M3')).toBeInTheDocument();
    expect(screen.queryByText('BMW X5')).not.toBeInTheDocument();
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
  });

  it('clearly shows when the customer did not provide a phone number', () => {
    render(
      <IncomingBookingsSection
        bookings={[
          {
            ...booking,
            client: { ...booking.client, contactInfo: undefined },
          },
        ]}
        currentDate={currentDate}
      />
    );

    expect(screen.getByText('No phone provided')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Call' })).toBeDisabled();
  });

  it('shows a clear empty state when there are no bookings', () => {
    render(<IncomingBookingsSection bookings={[]} currentDate={currentDate} />);

    expect(
      screen.getByText('No bookings for your cars yet')
    ).toBeInTheDocument();
  });

  it('marks cancelled bookings clearly', () => {
    render(
      <IncomingBookingsSection
        bookings={[{ ...booking, status: RentalStatus.Cancelled }]}
        currentDate={currentDate}
      />
    );

    expect(screen.getAllByText('Cancelled')).toHaveLength(2);
    expect(screen.queryByText('1 active')).not.toBeInTheDocument();
  });

  it('filters bookings by their calculated lifecycle status', async () => {
    const user = userEvent.setup();
    const completedBooking = {
      ...booking,
      _id: 'booking-completed',
      car: { ...booking.car, _id: 'car-completed', carModel: 'M3' },
      rentalPeriod: {
        startDate: '2026-08-01T00:00:00.000Z',
        endDate: '2026-08-05T00:00:00.000Z',
      },
    };

    render(
      <IncomingBookingsSection
        bookings={[booking, completedBooking]}
        currentDate={currentDate}
      />
    );

    await user.click(screen.getByRole('tab', { name: /Completed/ }));

    expect(screen.getByText('BMW M3')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: l.reviews.rateClient })
    ).toBeInTheDocument();
    expect(screen.queryByText('BMW X5')).not.toBeInTheDocument();
  });

  it('does not expose incomplete bookings with a missing car or customer', () => {
    render(
      <IncomingBookingsSection
        bookings={[
          { ...booking, car: null },
          { ...booking, client: null },
        ]}
        currentDate={currentDate}
      />
    );

    expect(
      screen.getByText('No bookings for your cars yet')
    ).toBeInTheDocument();
  });
});
