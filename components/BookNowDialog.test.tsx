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
    bookingError: '',
    isBooking: false,
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

  it('exposes an accessible modal name and moves focus inside', () => {
    render(<BookingDialog {...defaultProps} />);

    const dialog = screen.getByRole('dialog', {
      name: 'Book MERCEDES C-Class',
    });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveFocus();
    expect(
      screen.getByRole('button', { name: 'Close booking dialog' })
    ).toBeInTheDocument();
  });

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<BookingDialog {...defaultProps} onClose={onClose} />);

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('keeps keyboard focus inside the dialog', async () => {
    const user = userEvent.setup();
    render(<BookingDialog {...defaultProps} />);

    await user.tab({ shift: true });
    expect(
      screen.getByRole('button', { name: 'Confirm Reservation' })
    ).toHaveFocus();

    await user.tab();
    expect(
      screen.getByRole('button', { name: 'Close booking dialog' })
    ).toHaveFocus();
  });

  it('locks page scrolling and restores focus after closing', () => {
    const originalOverflow = document.body.style.overflow;
    const { rerender } = render(
      <>
        <button type="button">Open booking</button>
        <BookingDialog {...defaultProps} isOpen={false} />
      </>
    );
    const trigger = screen.getByRole('button', { name: 'Open booking' });
    trigger.focus();

    rerender(
      <>
        <button type="button">Open booking</button>
        <BookingDialog {...defaultProps} isOpen />
      </>
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <>
        <button type="button">Open booking</button>
        <BookingDialog {...defaultProps} isOpen={false} />
      </>
    );
    expect(document.body.style.overflow).toBe(originalOverflow);
    expect(trigger).toHaveFocus();
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
    expect(screen.getByText('€50 × 3 days')).toBeInTheDocument();
    expect(screen.queryByText('€50 × 3 3 days')).not.toBeInTheDocument();
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

  it('shows the booking error returned by the API', async () => {
    const user = userEvent.setup();
    render(
      <BookingDialog
        {...defaultProps}
        bookingError="You already have an active reservation for the selected dates"
      />
    );
    expect(
      screen.getByText(
        'You already have an active reservation for the selected dates'
      )
    ).toBeInTheDocument();
  });

  it('does not show booking error when there is no error message', async () => {
    const user = userEvent.setup();
    render(<BookingDialog {...defaultProps} bookingError="" />);
    expect(
      screen.queryByText(
        'You already have an active reservation for the selected dates'
      )
    ).not.toBeInTheDocument();
  });

  it('disables confirmation and shows progress while booking', () => {
    render(<BookingDialog {...defaultProps} isBooking />);

    expect(screen.getByRole('button', { name: 'Reserving…' })).toBeDisabled();
  });
});
