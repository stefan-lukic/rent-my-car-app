import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CarDetailsDrawer from './CarDetailsDrawer';
import { createNextImageMock } from '@/test-utils/mocks/next-image';
import { createMockCar } from '@/test-utils/fixtures/car';
import { createMockRenter } from '@/test-utils/fixtures/renter';
import { runCarDetailsDrawerSharedTests } from '@/test-utils/shared-tests/car-details-drawer';

createNextImageMock();

const mockCar = createMockCar();
const mockRenter = createMockRenter();

describe('CarDetailsDrawer', () => {
  const defaultProps = {
    car: mockCar,
    renter: mockRenter,
    isOpen: true,
    onClose: vi.fn(),
    onBookNow: vi.fn(),
  };

  it('renders car details when open', async () => {
    render(<CarDetailsDrawer {...defaultProps} />);
    expect(screen.getByText('Car Details')).toBeInTheDocument();
    expect(screen.getByText('MERCEDES C-Class')).toBeInTheDocument();
  });

  it('displays car price per day', async () => {
    render(<CarDetailsDrawer {...defaultProps} />);
    expect(screen.getByText('€50')).toBeInTheDocument();
    expect(screen.getByText('/ day')).toBeInTheDocument();
  });

  it('renders car specifications', async () => {
    render(<CarDetailsDrawer {...defaultProps} />);
    expect(screen.getByText('PETROL')).toBeInTheDocument();
    expect(screen.getByText('150 HP')).toBeInTheDocument();
    expect(screen.getByText('Seats')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('SEDAN')).toBeInTheDocument();
    expect(screen.getByText(/Belgrade/)).toBeInTheDocument();
    expect(screen.getByText('6.5')).toBeInTheDocument();
    expect(screen.getByText('50000 km')).toBeInTheDocument();
  });

  it('renders car description when provided', async () => {
    render(<CarDetailsDrawer {...defaultProps} />);
    expect(screen.getByText('Nice car')).toBeInTheDocument();
  });

  it('does not render description when missing', async () => {
    const carWithoutDesc = createMockCar({ description: '' });
    render(<CarDetailsDrawer {...defaultProps} car={carWithoutDesc} />);
    expect(screen.queryByText('Nice car')).not.toBeInTheDocument();
  });

  it('shows renter info when renter is provided', async () => {
    render(<CarDetailsDrawer {...defaultProps} />);
    expect(screen.getByText('Marko Markovic')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('does not show renter card when renter is missing', async () => {
    render(<CarDetailsDrawer {...defaultProps} renter={null} />);
    expect(screen.queryByText('Marko Markovic')).not.toBeInTheDocument();
  });

  runCarDetailsDrawerSharedTests({
    Component: CarDetailsDrawer,
    mockCar,
    mockRenter,
  });
});
