import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CarRentalSearch from './CarRentalSearch';
import l from '@/helper/en';

const mocks = vi.hoisted(() => ({
  useCarSearchForm: vi.fn(),
  useBookingFlow: vi.fn(),
}));

vi.mock('@/hooks/useCarSearch', () => ({
  useCarSearchForm: mocks.useCarSearchForm,
}));

vi.mock('@/hooks/useBookingFlow', () => ({
  useBookingFlow: mocks.useBookingFlow,
}));

vi.mock('./UI/CustomDatePicker', () => ({
  default: () => null,
}));

vi.mock('./CarDetailsDrawer', () => ({
  default: () => null,
}));

vi.mock('./BookNowDialog', () => ({
  default: () => null,
}));

const filters = {
  minPrice: '',
  maxPrice: '',
  make: '',
  carType: '',
  engine: '',
  minSeats: '',
};

describe('CarRentalSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useCarSearchForm.mockReturnValue({
      form: {
        register: vi.fn(() => ({})),
        control: {},
        getValues: vi.fn(),
      },
      results: {
        data: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
        loading: false,
      },
      selectedCar: null,
      startDate: null,
      hasSearched: false,
      searchError: '',
      onSearch: vi.fn(),
      confirmBooking: vi.fn(),
      setSelectedCar: vi.fn(),
    });
    mocks.useBookingFlow.mockReturnValue({
      modals: { booking: false, details: false },
      bookingSuccess: '',
    });
  });

  it('shows a booking confirmation and link to the rentals page', () => {
    const dismissBookingSuccess = vi.fn();
    mocks.useBookingFlow.mockReturnValue({
      modals: { booking: false, details: false },
      bookingSuccess: 'BMW X5 is reserved.',
      dismissBookingSuccess,
    });

    render(<CarRentalSearch filters={filters} />);

    expect(screen.getByRole('status')).toHaveTextContent('BMW X5 is reserved.');
    expect(
      screen.getByRole('link', { name: l.carDetailsPage.viewMyRentals })
    ).toHaveAttribute('href', '/profile/my-profile');

    fireEvent.click(
      screen.getByRole('button', { name: 'Dismiss booking confirmation' })
    );
    expect(dismissBookingSuccess).toHaveBeenCalledOnce();
  });

  it('does not show a confirmation before booking', () => {
    render(<CarRentalSearch filters={filters} />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
