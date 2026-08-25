import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import type { ICar } from '@/lib/model/car/Car';

export interface CarCardSharedConfig<TDeleteArg = ICar> {
  Component: ComponentType<{
    car: ICar;
    onUpdate: (car: ICar) => void;
    onDeleteClick: (arg: TDeleteArg) => void;
  }>;
  mockCar: ICar;
  editButtonMatcher: string | RegExp;
  deleteButtonMatcher: string | RegExp;
  onDeleteClickExpectedArg: TDeleteArg;
}

export const runCarCardSharedTests = <TDeleteArg = ICar,>(
  config: CarCardSharedConfig<TDeleteArg>
) => {
  const {
    Component,
    mockCar,
    editButtonMatcher,
    deleteButtonMatcher,
    onDeleteClickExpectedArg,
  } = config;

  const defaultProps = {
    car: mockCar,
    onUpdate: vi.fn(),
    onDeleteClick: vi.fn(),
  };

  it('renders car make and model', async () => {
    const user = userEvent.setup();
    render(<Component {...defaultProps} />);
    expect(screen.getByText(new RegExp(`${mockCar.make}`))).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`${mockCar.carModel}`))
    ).toBeInTheDocument();
  });

  it('renders price per day', async () => {
    const user = userEvent.setup();
    render(<Component {...defaultProps} />);
    expect(
      screen.getByText(new RegExp(`${mockCar.pricePerDay}`))
    ).toBeInTheDocument();
    expect(screen.getByText(/\/ day/)).toBeInTheDocument();
  });

  it('renders city', async () => {
    const user = userEvent.setup();
    render(<Component {...defaultProps} />);
    expect(screen.getByText(`${mockCar.city}`)).toBeInTheDocument();
  });

  it('renders status badge for available', async () => {
    const user = userEvent.setup();
    render(<Component {...defaultProps} />);
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('renders status badge for rented', async () => {
    const user = userEvent.setup();
    const rentedCar = { ...mockCar, status: 'rented' };
    render(<Component {...defaultProps} car={rentedCar} />);
    expect(screen.getByText('Booked')).toBeInTheDocument();
  });

  it('renders status badge for inactive', async () => {
    const user = userEvent.setup();
    const inactiveCar = { ...mockCar, status: 'inactive' };
    render(<Component {...defaultProps} car={inactiveCar} />);
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('defaults to Available when status is missing', async () => {
    const user = userEvent.setup();
    const noStatusCar = { ...mockCar, status: undefined };
    render(<Component {...defaultProps} car={noStatusCar} />);
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('emits selected car when edit action is triggered', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<Component {...defaultProps} onUpdate={onUpdate} />);
    await user.click(screen.getByText(editButtonMatcher));
    expect(onUpdate).toHaveBeenCalledWith(mockCar);
  });

  it('emits car identifier when delete action is triggered', async () => {
    const user = userEvent.setup();
    const onDeleteClick = vi.fn();
    render(<Component {...defaultProps} onDeleteClick={onDeleteClick} />);
    await user.click(screen.getByText(deleteButtonMatcher));
    expect(onDeleteClick).toHaveBeenCalledWith(onDeleteClickExpectedArg);
  });

  it('shows placeholder image when car has no images', async () => {
    const user = userEvent.setup();
    const carWithoutImages = { ...mockCar, images: [] };
    render(<Component {...defaultProps} car={carWithoutImages} />);
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', '/placeholder-car.svg');
  });
};
