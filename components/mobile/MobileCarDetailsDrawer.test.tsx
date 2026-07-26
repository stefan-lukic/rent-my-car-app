import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileCarDetailsDrawer from './MobileCarDetailsDrawer';
import { runCarDetailsDrawerSharedTests } from '@/test-utils/shared-tests/car-details-drawer';

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

const mockRenter = {
  _id: 'user123',
  name: 'Marko Markovic',
  email: 'marko@example.com',
  contactInfo: '0612345678',
  rating: 4.8,
  images: ['/avatar.jpg'],
};

describe('MobileCarDetailsDrawer', () => {
  const defaultProps = {
    car: mockCar,
    renter: mockRenter,
    isOpen: true,
    onClose: vi.fn(),
    onBookNow: vi.fn(),
  };

  it('renders car details when open', async () => {
    const user = userEvent.setup();
    render(<MobileCarDetailsDrawer {...defaultProps} />);
    expect(screen.getByText('Car Details')).toBeInTheDocument();
    expect(screen.getByText('Mercedes')).toBeInTheDocument();
    expect(screen.getByText('C-Class')).toBeInTheDocument();
  });

  it('renders specifications', async () => {
    const user = userEvent.setup();
    render(<MobileCarDetailsDrawer {...defaultProps} />);
    expect(screen.getByText('Petrol')).toBeInTheDocument();
    expect(screen.getByText('150 HP')).toBeInTheDocument();
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('Belgrade')).toBeInTheDocument();
  });

  it('shows renter info when renter is provided', async () => {
    const user = userEvent.setup();
    render(<MobileCarDetailsDrawer {...defaultProps} />);
    expect(screen.getByText('Marko Markovic')).toBeInTheDocument();
  });

  it('shows no renter info when renter is null', async () => {
    const user = userEvent.setup();
    render(<MobileCarDetailsDrawer {...defaultProps} renter={null} />);
    expect(screen.getByText('No renter info available')).toBeInTheDocument();
  });

  runCarDetailsDrawerSharedTests({
    Component: MobileCarDetailsDrawer,
    mockCar,
    mockRenter,
  });
});
