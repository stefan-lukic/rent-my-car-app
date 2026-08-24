import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileCarCard from './MobileCarCard';
import { runCarCardSharedTests } from '@/test-utils/shared-tests/car-card';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props || {};
    return React.createElement('img', { src, alt, width, height, ...rest });
  },
}));

const mockCar = {
  _id: 'car-1',
  make: 'BMW',
  carModel: 'X5',
  pricePerDay: 80,
  city: 'Belgrade',
  carLocation: 'New Belgrade',
  images: ['/car1.jpg', '/car2.jpg', '/car3.jpg'],
  status: 'available',
} as any;

describe('MobileCarCard', () => {
  runCarCardSharedTests<string>({
    Component: MobileCarCard,
    mockCar,
    editButtonMatcher: /Edit/,
    deleteButtonMatcher: /Delete/,
    onDeleteClickExpectedArg: 'car-1',
  });

  it('navigates to next image when right arrow is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MobileCarCard car={mockCar} onUpdate={vi.fn()} onDeleteClick={vi.fn()} />
    );

    const rightArrow = screen.getByRole('button', {
      name: 'Next car image',
    });
    await user.click(rightArrow);

    expect(screen.getByRole('img', { name: 'BMW X5' })).toHaveAttribute(
      'src',
      '/car2.jpg'
    );
  });

  it('navigates to previous image when left arrow is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MobileCarCard car={mockCar} onUpdate={vi.fn()} onDeleteClick={vi.fn()} />
    );

    const rightArrow = screen.getByRole('button', {
      name: 'Next car image',
    });
    await user.click(rightArrow);

    const leftArrow = screen.getByRole('button', {
      name: 'Previous car image',
    });
    await user.click(leftArrow);

    expect(screen.getByRole('img', { name: 'BMW X5' })).toHaveAttribute(
      'src',
      '/car1.jpg'
    );
  });

  it('disables left arrow on first image', async () => {
    const user = userEvent.setup();
    render(
      <MobileCarCard car={mockCar} onUpdate={vi.fn()} onDeleteClick={vi.fn()} />
    );

    const leftArrow = screen.getByRole('button', {
      name: 'Previous car image',
    });
    expect(leftArrow).toBeDisabled();
  });

  it('disables right arrow on last image', async () => {
    const user = userEvent.setup();
    render(
      <MobileCarCard car={mockCar} onUpdate={vi.fn()} onDeleteClick={vi.fn()} />
    );

    const rightArrow = screen.getByRole('button', {
      name: 'Next car image',
    });
    await user.click(rightArrow);
    await user.click(rightArrow);
    await user.click(rightArrow);

    expect(rightArrow).toBeDisabled();
  });
});
