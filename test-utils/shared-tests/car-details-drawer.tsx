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

  it('keeps booking actions above mobile navigation and safe areas', () => {
    render(<Component {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    const actions = screen.getByText('Book Now').closest('footer');

    expect(dialog).toHaveClass('z-[70]');
    expect(actions).toHaveClass(
      'pb-[max(1rem,env(safe-area-inset-bottom))]',
      'sm:pb-4'
    );
  });

  it('links to the full car details page', () => {
    render(<Component {...defaultProps} />);
    expect(
      screen.getByRole('link', { name: 'View full details' })
    ).toHaveAttribute('href', `/cars/${mockCar._id}`);
  });

  it('keeps selected calendar dates in the full details link', () => {
    render(
      <Component
        {...defaultProps}
        startDate={new Date(2026, 8, 10)}
        endDate={new Date(2026, 8, 12)}
      />
    );

    const detailsLink = screen.getByRole('link', {
      name: 'View full details',
    });
    const detailsUrl = new URL(
      detailsLink.getAttribute('href') ?? '',
      'http://localhost'
    );

    expect(detailsUrl.searchParams.get('start')).toBe('2026-09-10');
    expect(detailsUrl.searchParams.get('end')).toBe('2026-09-12');
  });

  it('opens How It Works modal when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Component {...defaultProps} />);
    await user.click(screen.getByText('How it works'));
    expect(screen.getByText('How RentMyCar Works')).toBeInTheDocument();
  });
};
