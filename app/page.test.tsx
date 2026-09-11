import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  useMediaQuery: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: mocks.useSearchParams,
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: mocks.useAuth,
}));

vi.mock('@/hooks/useMediaQuery', () => ({
  default: mocks.useMediaQuery,
}));

vi.mock('@/components/UI/Header', () => ({
  default: () => <div>Header</div>,
}));

vi.mock('@/components/HowItWorksModal', () => ({
  default: () => null,
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

vi.mock('@/components/UI/LoadingSkeletons', () => ({
  HomePageSkeleton: () => <div data-testid="home-skeleton">Loading</div>,
}));

import Home from './page';

describe('Home responsive search view', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useAuth.mockReturnValue({ loading: false });
    mocks.useSearchParams.mockReturnValue(new URLSearchParams());
  });

  it('waits for viewport detection before mounting a search form', () => {
    mocks.useMediaQuery.mockReturnValue(null);

    render(<Home />);

    expect(screen.getByTestId('home-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-search')).not.toBeInTheDocument();
    expect(screen.queryByTestId('desktop-search')).not.toBeInTheDocument();
  });

  it('mounts only the mobile search on a mobile viewport', () => {
    mocks.useMediaQuery.mockReturnValue(true);

    render(<Home />);

    expect(screen.getByTestId('mobile-search')).toBeInTheDocument();
    expect(screen.queryByTestId('desktop-search')).not.toBeInTheDocument();
  });

  it('mounts only the desktop search on a desktop viewport', () => {
    mocks.useMediaQuery.mockReturnValue(false);

    render(<Home />);

    expect(screen.getByTestId('desktop-search')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-search')).not.toBeInTheDocument();
  });
});
