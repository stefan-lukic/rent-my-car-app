import { expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import type { ICar } from '@/lib/model/car/Car';
import type { IRenter } from '@/lib/model/User';
import type { CarDetailsDrawerProps } from '@/components/CarDetailsDrawer';

export interface CarDetailsDrawerSharedConfig {
  Component: ComponentType<CarDetailsDrawerProps>;
  mockCar: ICar;
  mockRenter: IRenter;
}

export const runCarDetailsDrawerSharedTests = (
  config: CarDetailsDrawerSharedConfig
) => {
  const { Component, mockCar, mockRenter } = config;

  const defaultProps: CarDetailsDrawerProps = {
    car: mockCar,
    renter: mockRenter,
    isOpen: true,
    onClose: vi.fn(),
    onBookNow: vi.fn(),
  };

  it('renders nothing when closed', async () => {
    render(<Component {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Car Details')).not.toBeInTheDocument();
  });

  it('renders nothing when car is missing', async () => {
    render(<Component {...defaultProps} car={null} />);
    expect(screen.queryByText('Car Details')).not.toBeInTheDocument();
  });

  it('requests close when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Component {...defaultProps} onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Close car details' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('requests booking when Book Now button is clicked', async () => {
    const user = userEvent.setup();
    const onBookNow = vi.fn();
    render(<Component {...defaultProps} onBookNow={onBookNow} />);
    await user.click(screen.getByText('Book Now'));
    expect(onBookNow).toHaveBeenCalled();
  });

  it('opens How It Works modal when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Component {...defaultProps} />);
    await user.click(screen.getByText('How it works'));
    expect(screen.getByText('How RentMyCar Works')).toBeInTheDocument();
  });
};
