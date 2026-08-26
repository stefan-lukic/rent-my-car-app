import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MobileFooter from './MobileFooter';
import l from '@/helper/en';

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: mocks.useAuth,
}));

vi.mock('next/navigation', () => ({
  usePathname: mocks.usePathname,
}));

describe('MobileFooter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.usePathname.mockReturnValue('/');
  });

  it('does not render while authentication is loading', () => {
    mocks.useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true,
    });

    const { container } = render(<MobileFooter />);
    expect(container).toBeEmptyDOMElement();
  });

  it('does not render for a signed-out user', () => {
    mocks.useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });

    const { container } = render(<MobileFooter />);

    expect(container).toBeEmptyDOMElement();
  });

  it('shows only real authenticated-user destinations', () => {
    mocks.useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
    });

    render(<MobileFooter />);

    expect(
      screen.getByRole('navigation', {
        name: l.navigation.mobileNavigation,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: l.navigation.explore })
    ).toHaveAttribute('href', '/#car-search');
    expect(
      screen.getByRole('link', { name: l.navigation.listCar })
    ).toHaveAttribute('href', '/cars/add-car');
    expect(
      screen.getByRole('link', { name: l.navigation.profile })
    ).toHaveAttribute('href', '/profile/my-profile');
    expect(screen.queryByText(l.common.logOut)).not.toBeInTheDocument();
  });

  it('marks the destination matching the current page as active', () => {
    mocks.useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
    });
    mocks.usePathname.mockReturnValue('/cars/add-car');

    render(<MobileFooter />);

    expect(
      screen.getByRole('link', { name: l.navigation.listCar })
    ).toHaveAttribute('aria-current', 'page');
    expect(
      screen.getByRole('link', { name: l.navigation.explore })
    ).not.toHaveAttribute('aria-current');
  });
});
