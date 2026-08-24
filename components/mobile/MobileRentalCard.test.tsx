import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileRentalCard from './MobileRentalCard';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props || {};
    return React.createElement('img', { src, alt, width, height, ...rest });
  },
}));

const mockRental = {
  _id: 'rental-1',
  car: {
    _id: 'car-1',
    make: 'BMW',
    carModel: 'X5',
    pricePerDay: 80,
    city: 'Belgrade',
    carLocation: 'New Belgrade',
    images: ['/car1.jpg', '/car2.jpg'],
    status: 'rented',
  },
  rentalPeriod: {
    startDate: '2026-08-01T00:00:00.000Z',
    endDate: '2026-08-05T00:00:00.000Z',
  },
  totalCost: 320,
} as any;

describe('MobileRentalCard', () => {
  const defaultProps = {
    rental: mockRental,
    showStatus: true,
  };

  it('renders car make and model', async () => {
    const user = userEvent.setup();
    render(<MobileRentalCard {...defaultProps} />);
    expect(screen.getByText('BMW X5')).toBeInTheDocument();
  });

  it('renders price per day', async () => {
    const user = userEvent.setup();
    render(<MobileRentalCard {...defaultProps} />);
    expect(screen.getByText('€80 / day')).toBeInTheDocument();
  });

  it('renders car city', async () => {
    const user = userEvent.setup();
    render(<MobileRentalCard {...defaultProps} />);
    expect(screen.getByText('Belgrade')).toBeInTheDocument();
  });

  it('renders rental period dates', async () => {
    const user = userEvent.setup();
    render(<MobileRentalCard {...defaultProps} />);
    expect(screen.getByText(/1 Aug 2026/)).toBeInTheDocument();
    expect(screen.getByText(/5 Aug 2026/)).toBeInTheDocument();
  });

  it('renders total cost', async () => {
    const user = userEvent.setup();
    render(<MobileRentalCard {...defaultProps} />);
    expect(screen.getByText('€320')).toBeInTheDocument();
  });

  it('renders status badge when showStatus is true', async () => {
    const user = userEvent.setup();
    render(<MobileRentalCard {...defaultProps} />);
    expect(screen.getByText('Booked')).toBeInTheDocument();
  });

  it('does not render status badge when showStatus is false', async () => {
    const user = userEvent.setup();
    render(<MobileRentalCard {...defaultProps} showStatus={false} />);
    expect(screen.queryByText('Booked')).not.toBeInTheDocument();
  });

  it('renders navigation arrows when multiple images exist', async () => {
    const user = userEvent.setup();
    render(<MobileRentalCard {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: 'Previous rental car image' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Next rental car image' })
    ).toBeInTheDocument();
  });

  it('disables left arrow on first image', async () => {
    const user = userEvent.setup();
    render(<MobileRentalCard {...defaultProps} />);

    const leftArrow = screen.getByRole('button', {
      name: 'Previous rental car image',
    });
    expect(leftArrow).toBeDisabled();
  });

  it('clicking arrows updates internal image index state', async () => {
    const user = userEvent.setup();
    render(<MobileRentalCard {...defaultProps} />);

    const rightArrow = screen.getByRole('button', {
      name: 'Next rental car image',
    });
    await user.click(rightArrow);

    const rightArrowAgain = screen.getByRole('button', {
      name: 'Next rental car image',
    });
    await user.click(rightArrowAgain);

    const rightArrowFinal = screen.getByRole('button', {
      name: 'Next rental car image',
    });
    expect(rightArrowFinal).toBeDisabled();
  });

  it('disables right arrow on last image', async () => {
    const user = userEvent.setup();
    render(<MobileRentalCard {...defaultProps} />);

    const rightArrow = screen.getByRole('button', {
      name: 'Next rental car image',
    });
    await user.click(rightArrow);
    await user.click(rightArrow);

    expect(
      screen.getByRole('button', { name: 'Next rental car image' })
    ).toBeDisabled();
  });
});
