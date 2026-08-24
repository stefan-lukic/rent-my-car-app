import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileCarSearchResults from './MobileCarSearchResults';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props || {};
    return React.createElement('img', { src, alt, width, height, ...rest });
  },
}));

const mockCar = {
  _id: '1',
  make: 'Mercedes',
  carModel: 'C-Class',
  pricePerDay: 50,
  carType: 'Sedan',
  city: 'Belgrade',
  carLocation: 'Center',
  images: ['/car1.jpg', '/car2.jpg'],
  engine: 'Petrol',
  power: '150',
  averageConsumption: '6.5',
  milage: 50000,
  firstRegistration: new Date('2020-01-01'),
  description: 'Nice car',
  renter: 'user123',
  status: 'available',
} as any;

describe('MobileCarSearchResults', () => {
  const defaultProps = {
    car: mockCar,
    onBookNow: vi.fn(),
    onViewDetails: vi.fn(),
  };

  it('renders car make and model', () => {
    render(<MobileCarSearchResults {...defaultProps} />);
    expect(screen.getByText('Mercedes')).toBeInTheDocument();
    expect(screen.getByText('C-Class')).toBeInTheDocument();
  });

  it('renders price per day', () => {
    render(<MobileCarSearchResults {...defaultProps} />);
    expect(screen.getByText('€50')).toBeInTheDocument();
    expect(screen.getByText('/ DAY')).toBeInTheDocument();
  });

  it('renders car type, engine and consumption', () => {
    render(<MobileCarSearchResults {...defaultProps} />);
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('Petrol')).toBeInTheDocument();
    expect(screen.getByText('6.5 l/100km')).toBeInTheDocument();
  });

  it('calls onViewDetails when Specs button is clicked', async () => {
    const user = userEvent.setup();
    const onViewDetails = vi.fn();
    render(
      <MobileCarSearchResults {...defaultProps} onViewDetails={onViewDetails} />
    );
    await user.click(screen.getByText('Specs'));
    expect(onViewDetails).toHaveBeenCalledTimes(1);
  });

  it('calls onBookNow when Book Now button is clicked', async () => {
    const user = userEvent.setup();
    const onBookNow = vi.fn();
    render(<MobileCarSearchResults {...defaultProps} onBookNow={onBookNow} />);
    await user.click(screen.getByText('Book Now'));
    expect(onBookNow).toHaveBeenCalledTimes(1);
  });

  it('shows year from firstRegistration', () => {
    render(<MobileCarSearchResults {...defaultProps} />);
    expect(screen.getByText('(2020)')).toBeInTheDocument();
  });

  it('does not show a rating when rating data is unavailable', () => {
    render(<MobileCarSearchResults {...defaultProps} />);
    expect(screen.queryByText('4.80')).not.toBeInTheDocument();
    expect(screen.queryByText('(12)')).not.toBeInTheDocument();
  });

  it('shows city badge', () => {
    render(<MobileCarSearchResults {...defaultProps} />);
    expect(screen.getByText('Belgrade')).toBeInTheDocument();
  });
});
