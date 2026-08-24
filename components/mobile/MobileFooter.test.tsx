import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MobileFooter from './MobileFooter';
import l from '@/helper/en';

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: mocks.useAuth,
}));

vi.mock('../LogoutButton', () => ({
  __esModule: true,
  default: () => <div data-testid="logout-button">Log out</div>,
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('MobileFooter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render anything when user is not authenticated and loading', () => {
    mocks.useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true,
    });

    const { container } = render(<MobileFooter />);
    expect(container.querySelector('.fixed')).toBeFalsy();
  });

  it('renders footer with profile and logout for authenticated user', () => {
    mocks.useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
    });

    render(<MobileFooter />);

    expect(screen.getByText(l.navigation.home)).toBeInTheDocument();
    expect(screen.getByText(l.navigation.profile)).toBeInTheDocument();
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
  });

  it('does not render anything when user is not authenticated and not loading', () => {
    mocks.useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });

    const { container } = render(<MobileFooter />);
    expect(container.querySelector('.fixed')).toBeFalsy();
  });

  it('does not render footer while auth state is loading', () => {
    mocks.useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true,
    });

    const { container } = render(<MobileFooter />);
    expect(container.querySelector('.fixed')).toBeFalsy();
  });
});
