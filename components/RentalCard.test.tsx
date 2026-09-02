import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RentalCard from './RentalCard';
import l from '@/helper/en';
import { createNextImageMock } from '@/test-utils/mocks/next-image';
import { createMockRental } from '@/test-utils/fixtures/rental';
import { createMockCar } from '@/test-utils/fixtures/car';
import { RentalStatus } from '@/types/RentalWithCar';
createNextImageMock();

const mockRental = createMockRental();

describe('RentalCard', () => {
  const defaultProps = {
    rental: mockRental,
    showStatus: true,
    currentDate: '2024-07-25',
  };

  it('renders car make and model', () => {
    render(<RentalCard {...defaultProps} />);

    expect(screen.getByText(/MERCEDES/)).toBeInTheDocument();
    expect(screen.getByText(/C-Class/)).toBeInTheDocument();
  });

  it('renders price per day and city', () => {
    render(<RentalCard {...defaultProps} />);

    expect(screen.getByText(/€50/)).toBeInTheDocument();
    expect(screen.getByText(/\//)).toBeInTheDocument();
    expect(screen.getByText('Belgrade')).toBeInTheDocument();
  });

  it('shows Upcoming badge for a future active rental', () => {
    const activeRental = createMockRental({ status: RentalStatus.Active });

    render(<RentalCard {...defaultProps} rental={activeRental} />);

    expect(screen.getByText(l.status.upcoming)).toBeInTheDocument();
  });

  it('shows Cancelled badge for a cancelled rental', () => {
    const cancelledRental = createMockRental({
      status: RentalStatus.Cancelled,
    });

    const { container } = render(
      <RentalCard {...defaultProps} rental={cancelledRental} />
    );

    expect(screen.getByText(l.status.cancelled)).toBeInTheDocument();
    expect(container.querySelector('article')).toHaveClass(
      'bg-slate-100',
      'opacity-70',
      'grayscale'
    );
  });

  it('uses rental status instead of car availability status', () => {
    const activeRentalWithInactiveCar = createMockRental({
      status: RentalStatus.Active,
      car: createMockCar({ status: 'inactive' }),
    });

    render(
      <RentalCard {...defaultProps} rental={activeRentalWithInactiveCar} />
    );

    expect(screen.getByText(l.status.upcoming)).toBeInTheDocument();
    expect(screen.queryByText('Inactive')).not.toBeInTheDocument();
  });

  it('derives the lifecycle when the persisted status is missing', () => {
    const noStatusRental = createMockRental({ status: undefined });

    render(<RentalCard {...defaultProps} rental={noStatusRental} />);

    expect(screen.getByText(l.status.upcoming)).toBeInTheDocument();
  });

  it('renders total rental cost', () => {
    render(<RentalCard {...defaultProps} />);

    expect(screen.getByText('€200')).toBeInTheDocument();
  });

  it('renders rental period dates', () => {
    render(<RentalCard {...defaultProps} />);

    expect(screen.getByText('→')).toBeInTheDocument();

    const dateElements = screen.getAllByText(/2024/);

    expect(dateElements.length).toBeGreaterThanOrEqual(2);
  });

  it('shows placeholder image when car has no images', () => {
    const noImagesRental = createMockRental({
      car: createMockCar({ images: [] }),
    });

    render(<RentalCard {...defaultProps} rental={noImagesRental} />);

    const placeholderImg = screen.getByRole('img', {
      name: /MERCEDES C-Class/,
    });

    expect(placeholderImg).toHaveAttribute('src', '/placeholder-car.svg');
  });

  it('shows unavailable message when car is missing', () => {
    const noCarRental = createMockRental({ car: undefined });

    render(<RentalCard {...defaultProps} rental={noCarRental} />);

    expect(screen.getByText(l.common.unavailable)).toBeInTheDocument();
  });

  it('hides status badge when showStatus is false', () => {
    render(<RentalCard {...defaultProps} showStatus={false} />);

    expect(screen.queryByText('Available')).not.toBeInTheDocument();
  });

  it('formats dates in dd MMM yyyy format', () => {
    render(<RentalCard {...defaultProps} />);

    expect(screen.getByText('01 Aug 2024')).toBeInTheDocument();
    expect(screen.getByText('05 Aug 2024')).toBeInTheDocument();
  });

  it('allows an upcoming reservation to be cancelled', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<RentalCard {...defaultProps} onCancel={onCancel} />);

    await user.click(
      screen.getByRole('button', { name: l.booking.cancelReservation })
    );
    expect(onCancel).toHaveBeenCalledWith(mockRental._id);
  });

  it('does not offer cancellation after a reservation has started', () => {
    render(
      <RentalCard
        {...defaultProps}
        currentDate="2024-08-01"
        onCancel={vi.fn()}
      />
    );

    expect(
      screen.queryByRole('button', { name: l.booking.cancelReservation })
    ).not.toBeInTheDocument();
  });

  it('explains why cancellation is unavailable within 24 hours', () => {
    render(
      <RentalCard
        {...defaultProps}
        currentDate="2024-07-31T01:00:00.000Z"
        onCancel={vi.fn()}
      />
    );

    expect(
      screen.getByText(l.booking.cancellationCutoffPassed)
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: l.booking.cancelReservation })
    ).not.toBeInTheDocument();
  });

  it('allows cancellation exactly 24 hours before the rental starts', () => {
    render(
      <RentalCard
        {...defaultProps}
        currentDate="2024-07-31T00:00:00.000Z"
        onCancel={vi.fn()}
      />
    );

    expect(
      screen.getByRole('button', { name: l.booking.cancelReservation })
    ).toBeInTheDocument();
  });

  it('offers rating only after the rental is completed', () => {
    render(<RentalCard {...defaultProps} currentDate="2024-08-06" />);

    expect(
      screen.getByRole('button', { name: l.reviews.rateTrip })
    ).toBeInTheDocument();
  });

  it('shows that a completed rental was already rated', () => {
    const reviewedRental = createMockRental({
      clientReview: {
        carRating: 5,
        ownerRating: 4,
        submittedAt: new Date('2024-08-06T00:00:00.000Z'),
      },
    });

    render(
      <RentalCard
        {...defaultProps}
        rental={reviewedRental}
        currentDate="2024-08-06"
      />
    );

    expect(screen.getByText(l.reviews.carAndOwnerRated)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: l.reviews.rateTrip })
    ).not.toBeInTheDocument();
  });
});
