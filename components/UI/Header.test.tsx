import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Header from './Header';
import l from '@/helper/en';

const mocks = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockUseAuth: vi.fn(),
  mockSignIn: vi.fn(),
  mockSignOut: vi.fn(),
  mockUseSession: vi.fn(),
  mockUsePathname: vi.fn(),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props || {};
    return React.createElement('img', { src, alt, width, height, ...rest });
  },
}));

vi.mock('next/navigation', () => ({
  usePathname: mocks.mockUsePathname,
  useRouter: () => ({ push: mocks.mockPush }),
}));

vi.mock('next-auth/react', () => ({
  useSession: mocks.mockUseSession,
  signIn: mocks.mockSignIn,
  signOut: mocks.mockSignOut,
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: mocks.mockUseAuth,
}));

vi.mock('../LogoutButton', () => ({
  __esModule: true,
  default: () => <button data-testid="logout-btn">Log out</button>,
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
    });
    mocks.mockUsePathname.mockReturnValue('/');
    mocks.mockPush.mockClear();
  });

  it('returns null on sign-in page', async () => {
    const user = userEvent.setup();
    mocks.mockUsePathname.mockReturnValue('/sign-in');

    const { container } = render(<Header />);

    expect(container.innerHTML).toBe('');
  });

  it('returns null on sign-up page', async () => {
    const user = userEvent.setup();
    mocks.mockUsePathname.mockReturnValue('/sign-up');

    const { container } = render(<Header />);

    expect(container.innerHTML).toBe('');
  });

  it('renders brand logo on catalog page for unauthenticated user', async () => {
    const user = userEvent.setup();
    mocks.mockUsePathname.mockReturnValue('/');
    mocks.mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
    });

    render(<Header />);

    expect(screen.getAllByText(/RentMy/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Car/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders desktop navigation links', async () => {
    const user = userEvent.setup();
    mocks.mockUsePathname.mockReturnValue('/');
    mocks.mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
    });

    render(<Header />);

    expect(screen.getByText(l.navigation.catalog)).toBeInTheDocument();
    expect(screen.getByText(l.navigation.howItWorksNav)).toBeInTheDocument();
    expect(screen.getByText(l.navigation.myProfileRentals)).toBeInTheDocument();
  });

  it('shows Sign In and Sign Up for unauthenticated users', async () => {
    const user = userEvent.setup();
    mocks.mockUsePathname.mockReturnValue('/');
    mocks.mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
    });

    render(<Header />);

    expect(
      screen.getAllByText(l.navigation.signIn).length
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText(l.common.getStarted).length
    ).toBeGreaterThanOrEqual(1);
  });

  it('shows Logout button and avatar for authenticated users', async () => {
    const user = userEvent.setup();
    mocks.mockUsePathname.mockReturnValue('/');
    mocks.mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { name: 'Marko Markovic', email: 'marko@example.com' },
    });

    render(<Header />);

    expect(screen.getAllByTestId('logout-btn').length).toBeGreaterThanOrEqual(
      1
    );
    expect(screen.getAllByText('M').length).toBeGreaterThanOrEqual(1);
  });

  it('shows profile initial fallback when user name is missing', async () => {
    const user = userEvent.setup();
    mocks.mockUsePathname.mockReturnValue('/');
    mocks.mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { name: null, email: 'marko@example.com' },
    });

    render(<Header />);

    expect(
      screen.getAllByText(l.common.profileInitial).length
    ).toBeGreaterThanOrEqual(1);
  });

  it('calls onHowItWorksClick when How It Works button is clicked', async () => {
    const user = userEvent.setup();
    const onHowItWorksClick = vi.fn();

    mocks.mockUsePathname.mockReturnValue('/');
    mocks.mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
    });

    render(<Header onHowItWorksClick={onHowItWorksClick} />);

    await user.click(screen.getByText(l.navigation.howItWorksNav));

    expect(onHowItWorksClick).toHaveBeenCalledTimes(1);
  });
});
