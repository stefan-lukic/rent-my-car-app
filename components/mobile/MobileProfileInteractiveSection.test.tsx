import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MobileProfileInteractiveSection from './MobileProfileInteractiveSection';
import l from '@/helper/en';

vi.mock('../UpdateCarModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="update-modal">
        <button onClick={onClose}>Close Update</button>
      </div>
    ) : null,
}));

vi.mock('../DeleteCarModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, onDelete }: any) =>
    isOpen ? (
      <div data-testid="delete-modal">
        <button onClick={onClose}>Close Delete</button>
        <button onClick={() => onDelete('car-1')}>Confirm Delete</button>
      </div>
    ) : null,
}));

vi.mock('./MobileCarCard', () => ({
  __esModule: true,
  default: ({ car, onUpdate, onDeleteClick }: any) => (
    <div data-testid="mobile-car-card">
      <span>
        {car.make} {car.carModel}
      </span>
      <button onClick={() => onUpdate(car)}>Edit</button>
      <button onClick={() => onDeleteClick(car._id)}>Delete</button>
    </div>
  ),
}));

vi.mock('./MobileRentalCard', () => ({
  __esModule: true,
  default: ({ rental }: any) => (
    <div data-testid="mobile-rental-card">
      <span>
        {rental.car.make} {rental.car.carModel}
      </span>
    </div>
  ),
}));

const mockCars = [
  {
    _id: 'car-1',
    make: 'BMW',
    carModel: 'X5',
    images: ['/car1.jpg'],
    status: 'available',
  },
  {
    _id: 'car-2',
    make: 'Mercedes',
    carModel: 'C-Class',
    images: ['/car2.jpg'],
    status: 'rented',
  },
] as any;

const mockRentals = [
  {
    _id: 'rental-1',
    car: {
      _id: 'car-1',
      make: 'BMW',
      carModel: 'X5',
      images: ['/car1.jpg'],
    },
    rentalPeriod: {
      startDate: '2026-08-01T00:00:00.000Z',
      endDate: '2026-08-05T00:00:00.000Z',
    },
    totalCost: 320,
  },
] as any;

describe('MobileProfileInteractiveSection', () => {
  const defaultProps = {
    cars: mockCars,
    rentals: mockRentals,
    activeTab: 'cars',
    currentDate: '2026-07-25',
  };

  it('renders list of cars when activeTab is cars', async () => {
    const user = userEvent.setup();
    render(<MobileProfileInteractiveSection {...defaultProps} />);

    expect(screen.getByText('BMW X5')).toBeInTheDocument();
    expect(screen.getByText('Mercedes C-Class')).toBeInTheDocument();
  });

  it('renders list of rentals when activeTab is rentals', async () => {
    const user = userEvent.setup();
    render(
      <MobileProfileInteractiveSection {...defaultProps} activeTab="rentals" />
    );

    expect(screen.getByText('BMW X5')).toBeInTheDocument();
  });

  it('keeps an owner-cancelled reservation in mobile history', async () => {
    const user = userEvent.setup();
    render(
      <MobileProfileInteractiveSection
        {...defaultProps}
        activeTab="rentals"
        rentals={[{ ...mockRentals[0], status: 'cancelled' }]}
      />
    );

    await user.click(screen.getByRole('tab', { name: /Cancelled/i }));

    expect(screen.getByTestId('mobile-rental-card')).toHaveTextContent(
      'BMW X5'
    );
  });

  it('shows empty message when no cars are listed', async () => {
    const user = userEvent.setup();
    render(<MobileProfileInteractiveSection {...defaultProps} cars={[]} />);

    expect(screen.getByText(l.profile.noCarsListed)).toBeInTheDocument();
  });

  it('shows empty message when no rentals yet', async () => {
    const user = userEvent.setup();
    render(
      <MobileProfileInteractiveSection
        {...defaultProps}
        rentals={[]}
        activeTab="rentals"
      />
    );

    expect(screen.getByText(l.profile.noRentalsYet)).toBeInTheDocument();
  });

  it('opens UpdateCarModal when Edit is clicked', async () => {
    const user = userEvent.setup();
    render(<MobileProfileInteractiveSection {...defaultProps} />);

    const editButtons = screen.getAllByText('Edit');
    await user.click(editButtons[0]);

    expect(screen.getByTestId('update-modal')).toBeInTheDocument();
  });

  it('opens DeleteCarModal when Delete is clicked', async () => {
    const user = userEvent.setup();
    render(<MobileProfileInteractiveSection {...defaultProps} />);

    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
  });

  it('removes car from list when delete is confirmed', async () => {
    const user = userEvent.setup();
    render(<MobileProfileInteractiveSection {...defaultProps} />);

    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);

    const confirmDelete = screen.getByText('Confirm Delete');
    await user.click(confirmDelete);

    expect(screen.queryByText('BMW X5')).not.toBeInTheDocument();
    expect(screen.getByText('Mercedes C-Class')).toBeInTheDocument();
  });

  it('closes UpdateCarModal when close is clicked', async () => {
    const user = userEvent.setup();
    render(<MobileProfileInteractiveSection {...defaultProps} />);

    const editButtons = screen.getAllByText('Edit');
    await user.click(editButtons[0]);

    const closeButton = screen.getByText('Close Update');
    await user.click(closeButton);

    expect(screen.queryByTestId('update-modal')).not.toBeInTheDocument();
  });
});
