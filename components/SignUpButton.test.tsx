import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignUpButton from './SignUpButton';
import l from '@/helper/en';

const mocks = vi.hoisted(() => ({
  mockUseSession: vi.fn(),
}));

vi.mock('next-auth/react', () => ({
  useSession: mocks.mockUseSession,
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe('SignUpButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sign up button for unauthenticated users', () => {
    mocks.mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<SignUpButton />);

    expect(screen.getByText(l.common.signUpNow)).toBeInTheDocument();
  });

  it('links to the sign up page', () => {
    mocks.mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<SignUpButton />);

    const link = screen.getByRole('link', { name: l.common.signUpNow });

    expect(link).toHaveAttribute('href', '/sign-up');
  });

  it('returns null when user is authenticated', () => {
    mocks.mockUseSession.mockReturnValue({
      data: { user: { name: 'Marko', email: 'marko@example.com' } },
      status: 'authenticated',
    });

    const { container } = render(<SignUpButton />);

    expect(container.innerHTML).toBe('');
  });

  it('renders sign up button while session is loading', () => {
    mocks.mockUseSession.mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<SignUpButton />);

    expect(screen.getByText(l.common.signUpNow)).toBeInTheDocument();
  });
});
