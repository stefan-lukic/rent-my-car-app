import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProfileInteractiveSection from './ProfileInteractiveSection';
import l from '@/helper/en';
import type { ICar } from '@/lib/model/car/Car';
import { CarMake } from '@/lib/model/car/CarMake';
import { createNextNavigationMock } from '@/test-utils/mocks/next-navigation';
import { createMockCar } from '@/test-utils/fixtures/car';
import { createMockRental } from '@/test-utils/fixtures/rental';
import { RentalStatus } from '@/types/RentalWithCar';
createNextNavigationMock();

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('./CarCard', () => ({
  __esModule: true,
  default: ({ car, onUpdate, onDeleteClick }: any) => (
    <div data-testid="car-card" data-car-id={car._id}>
      <button onClick={() => onUpdate(car)}>Update</button>
      <button onClick={() => onDeleteClick(car)}>Delete</button>
    </div>
  ),
}));

vi.mock('./RentalCard', () => ({
  __esModule: true,
  default: ({ rental }: any) => (
    <div data-testid="rental-card" data-rental-id={rental._id}>
      Rental Card
    </div>
  ),
}));

vi.mock('./UpdateCarModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, onUpdate }: any) =>
    isOpen ? (
      <div data-testid="update-modal">
        <button onClick={() => onUpdate({ _id: '1', make: 'BMW' })}>
          Save
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock('./DeleteCarModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, onDelete }: any) =>
    isOpen ? (
      <div data-testid="delete-modal">
        <button onClick={() => onDelete('1')}>Confirm</button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

const mockCar = createMockCar({
  _id: 'car-1',
  make: CarMake.BMW,
  carModel: 'X5',
  pricePerDay: 80,
});
const mockRental = createMockRental({ car: mockCar });

describe('ProfileInteractiveSection', () => {
  const defaultProps = {
    cars: [mockCar],
    rentals: [mockRental],
    currentDate: '2024-07-25',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders cars and rentals tabs', async () => {
    const user = userEvent.setup();
    render(<ProfileInteractiveSection {...defaultProps} />);

    expect(screen.getByText(l.profile.myCarsCount(1))).toBeInTheDocument();
    expect(screen.getByText(l.profile.myRentalsCount(1))).toBeInTheDocument();
  });

  it('shows cars tab as active by default', async () => {
    const user = userEvent.setup();
    render(<ProfileInteractiveSection {...defaultProps} />);

    const carCards = screen.getAllByTestId('car-card');

    expect(carCards.length).toBe(1);
  });

  it('switches to rentals tab when My Rentals is clicked', async () => {
    const user = userEvent.setup();
    render(<ProfileInteractiveSection {...defaultProps} />);

    await user.click(screen.getByText(l.profile.myRentalsCount(1)));

    const rentalCards = screen.getAllByTestId('rental-card');

    expect(rentalCards.length).toBe(1);
  });

  it('keeps an owner-cancelled reservation in client history', async () => {
    const user = userEvent.setup();
    const cancelledRental = createMockRental({
      status: RentalStatus.Cancelled,
      renter: 'owner-1',
      cancelledBy: 'owner-1',
    });
    render(
      <ProfileInteractiveSection
        {...defaultProps}
        rentals={[cancelledRental]}
      />
    );

    await user.click(screen.getByRole('tab', { name: /My Rentals/i }));
    await user.click(screen.getByRole('tab', { name: /Cancelled/i }));

    expect(screen.getByTestId('rental-card')).toHaveAttribute(
      'data-rental-id',
      cancelledRental._id
    );
  });

  it('shows empty message when no cars are listed', async () => {
    const user = userEvent.setup();
    render(
      <ProfileInteractiveSection
        cars={[]}
        rentals={[]}
        currentDate={defaultProps.currentDate}
      />
    );

    expect(screen.getByText(l.profile.noCarsListed)).toBeInTheDocument();
  });

  it('shows empty message when no rentals exist', async () => {
    const user = userEvent.setup();
    render(
      <ProfileInteractiveSection
        cars={[]}
        rentals={[]}
        currentDate={defaultProps.currentDate}
      />
    );

    expect(screen.getByText(l.profile.myRentalsCount(0))).toBeInTheDocument();

    await user.click(screen.getByText(l.profile.myRentalsCount(0)));

    expect(screen.getByText(l.profile.noRentalsYet)).toBeInTheDocument();
  });

  it('paginates cars correctly (3 per page)', async () => {
    const user = userEvent.setup();
    const manyCars: ICar[] = Array.from({ length: 5 }, (_, i) =>
      createMockCar({ _id: `car-${i}` })
    );

    render(
      <ProfileInteractiveSection
        cars={manyCars}
        rentals={[]}
        currentDate={defaultProps.currentDate}
      />
    );

    const carCards = screen.getAllByTestId('car-card');

    expect(carCards.length).toBe(3);

    const pageButtons = screen
      .getAllByRole('button')
      .filter((btn) => !isNaN(Number(btn.textContent)));

    await user.click(pageButtons[1]);

    const updatedCards = screen.getAllByTestId('car-card');

    expect(updatedCards.length).toBe(2);
  });

  it('opens UpdateCarModal when Update is clicked on a car card', async () => {
    const user = userEvent.setup();
    render(<ProfileInteractiveSection {...defaultProps} />);

    const updateButtons = screen.getAllByRole('button', { name: 'Update' });

    await user.click(updateButtons[0]);

    expect(screen.getByTestId('update-modal')).toBeInTheDocument();
  });

  it('opens DeleteCarModal when Delete is clicked on a car card', async () => {
    const user = userEvent.setup();
    render(<ProfileInteractiveSection {...defaultProps} />);

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });

    await user.click(deleteButtons[0]);

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
  });

  it('closes UpdateCarModal after saving', async () => {
    const user = userEvent.setup();
    render(<ProfileInteractiveSection {...defaultProps} />);

    await user.click(screen.getAllByRole('button', { name: 'Update' })[0]);

    expect(screen.getByTestId('update-modal')).toBeInTheDocument();

    await user.click(screen.getByText('Save'));

    expect(screen.queryByTestId('update-modal')).not.toBeInTheDocument();
  });

  it('navigates to add car page when Add New Car is clicked', async () => {
    const user = userEvent.setup();
    render(<ProfileInteractiveSection {...defaultProps} />);

    await user.click(screen.getByText(l.cars.addNewCarBtn));

    expect(mockPush).toHaveBeenCalledWith('/cars/add-car');
  });

  it('navigates to car search when Browse Cars is clicked', async () => {
    const user = userEvent.setup();
    render(<ProfileInteractiveSection {...defaultProps} />);

    await user.click(
      screen.getByRole('tab', {
        name: l.profile.myRentalsCount(defaultProps.rentals.length),
      })
    );
    await user.click(screen.getByRole('button', { name: 'Browse Cars' }));

    expect(mockPush).toHaveBeenCalledWith('/#car-search');
  });

  it('shows pagination buttons when there are multiple pages', async () => {
    const user = userEvent.setup();
    const manyCars: ICar[] = Array.from({ length: 5 }, (_, i) =>
      createMockCar({ _id: `car-${i}` })
    );

    render(
      <ProfileInteractiveSection
        cars={manyCars}
        rentals={[]}
        currentDate={defaultProps.currentDate}
      />
    );

    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
  });
});
