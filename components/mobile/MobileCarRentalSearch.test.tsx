import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MobileCarRentalSearch from './MobileCarRentalSearch';
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

vi.mock('../BookNowDialog', () => ({
  __esModule: true,
  default: ({ isOpen }: any) =>
    isOpen ? <div data-testid="booking-dialog">Booking Dialog</div> : null,
}));

vi.mock('./MobileCarDetailsDrawer', () => ({
  __esModule: true,
  default: ({ isOpen }: any) =>
    isOpen ? <div data-testid="details-drawer">Details Drawer</div> : null,
}));

vi.mock('./MobileCarSearchResults', () => ({
  __esModule: true,
  default: ({ car, onBookNow, onViewDetails }: any) => (
    <div data-testid="car-result">
      <span>
        {car.make} {car.carModel}
      </span>
      <button onClick={onBookNow}>Book</button>
      <button onClick={onViewDetails}>Details</button>
    </div>
  ),
}));

vi.mock('../UI/CustomDatePicker', () => ({
  __esModule: true,
  default: ({ label, name, control }: any) => (
    <div>
      <label>{label}</label>
      <input
        data-testid={`datepicker-${name}`}
        onChange={(e) => control?._fields?.[name]?.onChange?.(e.target.value)}
      />
    </div>
  ),
}));

const mockCar = {
  _id: 'car-1',
  make: 'BMW',
  carModel: 'X5',
  pricePerDay: 80,
  city: 'Belgrade',
  images: ['/car1.jpg'],
};

const mockFilters = {
  minPrice: '',
  maxPrice: '',
  make: '',
  carType: '',
  engine: '',
  minSeats: '',
};

describe('MobileCarRentalSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useCarSearchForm.mockReturnValue({
      form: {
        register: vi.fn(() => ({})),
        control: {
          _fields: {},
        },
        watch: vi.fn(),
        getValues: vi.fn(),
        setValue: vi.fn(),
      },
      results: {
        data: [mockCar],
        total: 1,
        totalPages: 1,
        currentPage: 1,
        loading: false,
      },
      selectedCar: null,
      renter: null,
      daysSelected: 0,
      hasSearched: true,
      searchError: '',
      onSearch: vi.fn(),
      onPageChange: vi.fn(),
      openDetails: vi.fn(),
      confirmBooking: vi.fn(),
      setSelectedCar: vi.fn(),
    });

    mocks.useBookingFlow.mockReturnValue({
      modals: { booking: false, details: false },
      bookingFailed: false,
      isUnauthorized: false,
      handleBooking: vi.fn(),
      openBooking: vi.fn(),
      closeBooking: vi.fn(),
      closeDetails: vi.fn(),
      setModals: vi.fn(),
    });
  });

  it('renders search form with location, dates and search button', () => {
    render(<MobileCarRentalSearch filters={mockFilters} />);

    expect(screen.getByText(l.search.location)).toBeInTheDocument();
    expect(screen.getByText(l.search.pickUp)).toBeInTheDocument();
    expect(screen.getByText(l.search.returnDate)).toBeInTheDocument();
    expect(screen.getByText(l.common.searchCars)).toBeInTheDocument();
  });

  it('renders car results', () => {
    render(<MobileCarRentalSearch filters={mockFilters} />);

    expect(screen.getByText('BMW X5')).toBeInTheDocument();
  });

  it('calls onSearch when search button is clicked', () => {
    const onSearch = vi.fn();
    mocks.useCarSearchForm.mockReturnValue({
      ...mocks.useCarSearchForm(),
      onSearch,
    });

    render(<MobileCarRentalSearch filters={mockFilters} />);

    const searchButton = screen.getByText(l.common.searchCars);
    fireEvent.submit(searchButton.closest('form') as HTMLFormElement);

    expect(onSearch).toHaveBeenCalled();
  });

  it('shows Load More button when more pages exist', () => {
    mocks.useCarSearchForm.mockReturnValue({
      ...mocks.useCarSearchForm(),
      results: {
        data: [mockCar],
        total: 1,
        totalPages: 2,
        currentPage: 1,
        loading: false,
      },
    });

    render(<MobileCarRentalSearch filters={mockFilters} />);

    expect(screen.getByText(l.common.loadMore)).toBeInTheDocument();
  });

  it('shows all cars loaded message on last page', () => {
    mocks.useCarSearchForm.mockReturnValue({
      ...mocks.useCarSearchForm(),
      results: {
        data: [mockCar],
        total: 1,
        totalPages: 1,
        currentPage: 1,
        loading: false,
      },
    });

    render(<MobileCarRentalSearch filters={mockFilters} />);

    expect(screen.getByText(l.common.allCarsLoaded)).toBeInTheDocument();
  });

  it('shows no cars found message when results are empty', () => {
    mocks.useCarSearchForm.mockReturnValue({
      ...mocks.useCarSearchForm(),
      results: {
        data: [],
        total: 0,
        totalPages: 0,
        currentPage: 0,
        loading: false,
      },
    });

    render(<MobileCarRentalSearch filters={mockFilters} />);

    expect(screen.getByText(l.search.noCarsFound)).toBeInTheDocument();
  });

  it('shows result skeletons instead of an empty state while loading', () => {
    mocks.useCarSearchForm.mockReturnValue({
      ...mocks.useCarSearchForm(),
      results: {
        data: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
        loading: true,
      },
    });

    render(<MobileCarRentalSearch filters={mockFilters} />);

    expect(screen.getByTestId('car-results-skeleton')).toBeInTheDocument();
    expect(screen.queryByText(l.search.noCarsFound)).not.toBeInTheDocument();
  });

  it('shows days selected info when dates are selected', () => {
    mocks.useCarSearchForm.mockReturnValue({
      ...mocks.useCarSearchForm(),
      daysSelected: 3,
    });

    render(<MobileCarRentalSearch filters={mockFilters} />);

    expect(screen.getByText(/3/)).toBeInTheDocument();
  });

  it('calls openBooking when Book Now is clicked', async () => {
    const user = userEvent.setup();
    const openBooking = vi.fn();
    mocks.useBookingFlow.mockReturnValue({
      ...mocks.useBookingFlow(),
      openBooking,
    });

    render(<MobileCarRentalSearch filters={mockFilters} />);

    const bookButtons = screen.getAllByText('Book');
    await user.click(bookButtons[0]);

    expect(openBooking).toHaveBeenCalledWith(mockCar);
  });

  it('calls openDetails and updates modals when Details is clicked', async () => {
    const user = userEvent.setup();
    const openDetails = vi.fn();
    const setModals = vi.fn();

    mocks.useCarSearchForm.mockReturnValue({
      ...mocks.useCarSearchForm(),
      openDetails,
    });

    mocks.useBookingFlow.mockReturnValue({
      ...mocks.useBookingFlow(),
      setModals,
    });

    render(<MobileCarRentalSearch filters={mockFilters} />);

    const detailsButtons = screen.getAllByText('Details');
    await user.click(detailsButtons[0]);

    expect(openDetails).toHaveBeenCalledWith(mockCar);
    expect(setModals).toHaveBeenCalledWith({ booking: false, details: true });
  });
});
