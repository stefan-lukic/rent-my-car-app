import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingDialog from './BookNowDialog';
import { createNextImageMock } from '@/test-utils/mocks/next-image';
import { createMockCar } from '@/test-utils/fixtures/car';

createNextImageMock();

const mockCar = createMockCar();

describe('BookingDialog', () => {
  const defaultProps = {
    car: mockCar,
    isOpen: true,
    startDate: new Date(2026, 7, 1),
    endDate: new Date(2026, 7, 3),
    isUnauthorized: false,
    bookingFailed: false,
    onClose: vi.fn(),
    onBook: vi.fn(),
  };

  it('does not render when closed', async () => {
    const user = userEvent.setup();
    render(<BookingDialog {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders car title when open', async () => {
    const user = userEvent.setup();
    render(<BookingDialog {...defaultProps} />);
    expect(screen.getByText('Book MERCEDES C-Class')).toBeInTheDocument();
  });

  it('displays selected car image or no photo fallback', async () => {
    const user = userEvent.setup();
    render(<BookingDialog {...defaultProps} />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('renders without images when car has no images', async () => {
    const user = userEvent.setup();
    const carWithoutImages = { ...mockCar, images: [] };
    render(<BookingDialog {...defaultProps} car={carWithoutImages} />);
    expect(screen.getByText('No photo')).toBeInTheDocument();
  });

  it('formats rental dates', async () => {
    const user = userEvent.setup();
    render(<BookingDialog {...defaultProps} />);
    expect(screen.getByText('01/08/2026')).toBeInTheDocument();
    expect(screen.getByText('03/08/2026')).toBeInTheDocument();
  });

  it('calculates days and total price including both start and end date', async () => {
    const user = userEvent.setup();
    render(<BookingDialog {...defaultProps} />);
    expect(screen.getByText(/€50 × 3/)).toBeInTheDocument();
    const totals = screen.getAllByText('€150.00');
    expect(totals.length).toBeGreaterThan(0);
  });

  it('counts calendar days across the autumn clock change', () => {
    render(
      <BookingDialog
        {...defaultProps}
        startDate={new Date(2026, 9, 25)}
        endDate={new Date(2026, 9, 26)}
      />
    );

    expect(screen.getByText(/€50 × 2/)).toBeInTheDocument();
    expect(screen.getAllByText('€100.00').length).toBeGreaterThan(0);
  });

  it('returns total 0 when dates are missing', async () => {
    const user = userEvent.setup();
    render(<BookingDialog {...defaultProps} startDate={null} endDate={null} />);
    const totals = screen.getAllByText('€0.00');
    expect(totals.length).toBeGreaterThan(0);
  });

  it('closes dialog when cancel is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<BookingDialog {...defaultProps} onClose={onClose} />);
    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('requests booking when confirm reservation is clicked', async () => {
    const user = userEvent.setup();
    const onBook = vi.fn();
    render(<BookingDialog {...defaultProps} onBook={onBook} />);
    await user.click(screen.getByText('Confirm Reservation'));
    expect(onBook).toHaveBeenCalled();
  });

  it('shows unauthorized banner when isUnauthorized is true', async () => {
    const user = userEvent.setup();
    render(<BookingDialog {...defaultProps} isUnauthorized />);
    expect(
      screen.getByText('Sign in to complete your reservation')
    ).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('does not show unauthorized banner when isUnauthorized is false', async () => {
    const user = userEvent.setup();
    render(<BookingDialog {...defaultProps} isUnauthorized={false} />);
    expect(
      screen.queryByText('Sign in to complete your reservation')
    ).not.toBeInTheDocument();
  });

  it('shows booking failed message when bookingFailed is true', async () => {
    const user = userEvent.setup();
    render(<BookingDialog {...defaultProps} bookingFailed />);
    expect(
      screen.getByText('Booking failed, please sign in to continue.')
    ).toBeInTheDocument();
  });

  it('does not show booking failed banner when bookingFailed is false', async () => {
    const user = userEvent.setup();
    render(<BookingDialog {...defaultProps} bookingFailed={false} />);
    expect(
      screen.queryByText('Booking failed, please sign in to continue.')
    ).not.toBeInTheDocument();
  });
});
