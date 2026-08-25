import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  it('shows Booked badge for an active rental', () => {
    const activeRental = createMockRental({ status: RentalStatus.Active });

    render(<RentalCard {...defaultProps} rental={activeRental} />);

    expect(screen.getByText(l.status.booked)).toBeInTheDocument();
  });

  it('shows Cancelled badge for a cancelled rental', () => {
    const cancelledRental = createMockRental({
      status: RentalStatus.Cancelled,
    });

    render(<RentalCard {...defaultProps} rental={cancelledRental} />);

    expect(screen.getByText(l.status.cancelled)).toBeInTheDocument();
  });

  it('uses rental status instead of car availability status', () => {
    const activeRentalWithInactiveCar = createMockRental({
      status: RentalStatus.Active,
      car: createMockCar({ status: 'inactive' }),
    });

    render(
      <RentalCard {...defaultProps} rental={activeRentalWithInactiveCar} />
    );

    expect(screen.getByText(l.status.booked)).toBeInTheDocument();
    expect(screen.queryByText('Inactive')).not.toBeInTheDocument();
  });

  it('defaults to Booked badge when rental status is missing', () => {
    const noStatusRental = createMockRental({ status: undefined });

    render(<RentalCard {...defaultProps} rental={noStatusRental} />);

    expect(screen.getByText(l.status.booked)).toBeInTheDocument();
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
});
