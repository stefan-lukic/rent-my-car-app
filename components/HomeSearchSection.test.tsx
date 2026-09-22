import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  useMediaQuery: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: mocks.useSearchParams,
}));

vi.mock('@/hooks/useMediaQuery', () => ({
  default: mocks.useMediaQuery,
}));

vi.mock('@/components/CarFilters', () => ({
  default: () => <div>Desktop filters</div>,
}));

vi.mock('@/components/mobile/MobileCarFilters', () => ({
  default: () => <div>Mobile filters</div>,
}));

vi.mock('@/components/CarRentalSearch', () => ({
  default: () => <div data-testid="desktop-search">Desktop search</div>,
}));

vi.mock('@/components/mobile/MobileCarRentalSearch', () => ({
  default: () => <div data-testid="mobile-search">Mobile search</div>,
}));

import HomeSearchSection from './HomeSearchSection';

describe('HomeSearchSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useSearchParams.mockReturnValue(new URLSearchParams());
  });

  it('shows only a local placeholder while detecting the viewport', () => {
    mocks.useMediaQuery.mockReturnValue(null);

    const { container } = render(<HomeSearchSection />);

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-search')).not.toBeInTheDocument();
    expect(screen.queryByTestId('desktop-search')).not.toBeInTheDocument();
  });

  it('mounts only the mobile search on a mobile viewport', () => {
    mocks.useMediaQuery.mockReturnValue(true);

    render(<HomeSearchSection />);

    expect(screen.getByTestId('mobile-search')).toBeInTheDocument();
    expect(screen.queryByTestId('desktop-search')).not.toBeInTheDocument();
  });

  it('mounts only the desktop search on a desktop viewport', () => {
    mocks.useMediaQuery.mockReturnValue(false);

    render(<HomeSearchSection />);

    expect(screen.getByTestId('desktop-search')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-search')).not.toBeInTheDocument();
  });
});
