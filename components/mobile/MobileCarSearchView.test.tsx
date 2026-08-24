import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MobileCarSearchView from './MobileCarSearchView';

vi.mock('./MobileCarFilters', () => ({
  __esModule: true,
  default: ({ filters, setFilters }: any) => (
    <div data-testid="mobile-car-filters">
      Filters: {JSON.stringify(filters)}
      <button onClick={() => setFilters({ ...filters, make: 'BMW' })}>
        Set Make
      </button>
    </div>
  ),
}));

vi.mock('./MobileCarRentalSearch', () => ({
  __esModule: true,
  default: ({ filters }: any) => (
    <div data-testid="mobile-car-rental-search">
      Search: {JSON.stringify(filters)}
    </div>
  ),
}));

describe('MobileCarSearchView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders MobileCarFilters and MobileCarRentalSearch', async () => {
    const user = userEvent.setup();
    render(<MobileCarSearchView />);

    expect(screen.getByTestId('mobile-car-filters')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-car-rental-search')).toBeInTheDocument();
  });

  it('passes initial filters to child components', async () => {
    const user = userEvent.setup();
    render(<MobileCarSearchView />);

    const filtersText = screen.getByText(/Filters:/);
    expect(filtersText).toHaveTextContent('"minPrice":""');
    expect(filtersText).toHaveTextContent('"maxPrice":""');
    expect(filtersText).toHaveTextContent('"make":""');
  });

  it('updates filters when setFilters is called', async () => {
    const user = userEvent.setup();
    render(<MobileCarSearchView />);

    const setMakeButton = screen.getByText('Set Make');
    await user.click(setMakeButton);

    const filtersText = screen.getByText(/Filters:/);
    expect(filtersText).toHaveTextContent('"make":"BMW"');
  });

  it('shows full container with correct structure', async () => {
    const user = userEvent.setup();
    const { container } = render(<MobileCarSearchView />);

    const mainContainer = container.querySelector('.h-full');
    expect(mainContainer).toBeTruthy();
  });
});
