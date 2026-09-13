import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CarSearchResults from './CarSearchResults';
import { createMockCar } from '@/test-utils/fixtures/car';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props || {};
    return React.createElement('img', { src, alt, width, height, ...rest });
  },
}));

const mockCar = createMockCar();

describe('CarSearchResults', () => {
  const defaultProps = {
    car: mockCar,
    onBookNow: vi.fn(),
    onViewDetails: vi.fn(),
  };

  it('renders car make and model', async () => {
    const user = userEvent.setup();
    render(<CarSearchResults {...defaultProps} />);
    expect(screen.getByText('MERCEDES')).toBeInTheDocument();
    expect(screen.getByText('C-Class')).toBeInTheDocument();
  });

  it('renders price per day', async () => {
    const user = userEvent.setup();
    render(<CarSearchResults {...defaultProps} />);
    expect(screen.getByText('€50')).toBeInTheDocument();
    expect(screen.getByText('/ day')).toBeInTheDocument();
  });

  it('renders the city without exposing the precise pickup location', async () => {
    const user = userEvent.setup();
    render(<CarSearchResults {...defaultProps} />);
    expect(screen.getByText('Belgrade')).toBeInTheDocument();
    expect(screen.queryByText(/Center/)).not.toBeInTheDocument();
  });

  it('renders car type, engine and consumption tags', async () => {
    const user = userEvent.setup();
    render(<CarSearchResults {...defaultProps} />);
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('Petrol')).toBeInTheDocument();
    expect(screen.getByText('6.5 l/100km')).toBeInTheDocument();
    expect(screen.getByText('5 seats')).toBeInTheDocument();
  });

  it('calls onViewDetails when Details button is clicked', async () => {
    const user = userEvent.setup();
    const onViewDetails = vi.fn();
    render(
      <CarSearchResults {...defaultProps} onViewDetails={onViewDetails} />
    );
    await user.click(screen.getByText('Details'));
    expect(onViewDetails).toHaveBeenCalled();
  });

  it('calls onBookNow when Book Now button is clicked', async () => {
    const user = userEvent.setup();
    const onBookNow = vi.fn();
    render(<CarSearchResults {...defaultProps} onBookNow={onBookNow} />);
    await user.click(screen.getByText('Book Now'));
    expect(onBookNow).toHaveBeenCalled();
  });

  it('navigates to next image when next button is clicked', async () => {
    const user = userEvent.setup();
    render(<CarSearchResults {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    const nextButton = buttons.find((btn) => !btn.classList.contains('hidden'));
    if (nextButton) {
      await user.click(nextButton);
    }
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', '/car2.jpg');
  });

  it('shows placeholder when car has no images', async () => {
    const user = userEvent.setup();
    const carWithoutImages = { ...mockCar, images: [] };
    render(<CarSearchResults {...defaultProps} car={carWithoutImages} />);
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', '/placeholder-car.svg');
  });

  it('hides navigation arrows when only one image', async () => {
    const user = userEvent.setup();
    const carWithOneImage = { ...mockCar, images: ['/car1.jpg'] };
    render(<CarSearchResults {...defaultProps} car={carWithOneImage} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2);
  });

  it('renders capitalized car type and engine values', async () => {
    const user = userEvent.setup();
    render(<CarSearchResults {...defaultProps} />);
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('Petrol')).toBeInTheDocument();
  });
});
