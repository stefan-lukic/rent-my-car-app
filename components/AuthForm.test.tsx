import React from 'react';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AuthForm from './AuthForm';
import l from '@/helper/en';

const mocks = vi.hoisted(() => ({
  useSession: vi.fn(),
}));

vi.mock('next-auth/react', () => ({
  useSession: mocks.useSession,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => ({ get: () => '/' }),
}));

vi.mock('@/utils/deviceDetectionCSR', () => ({
  isMobileCSR: () => false,
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders an accessible skeleton while session is loading', () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<AuthForm type="sign-in" />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveAccessibleName(l.common.loading);
  });

  it('renders nothing when user is already authenticated', () => {
    mocks.useSession.mockReturnValue({
      data: { user: { name: 'Marko' } },
      status: 'authenticated',
    });

    const { container } = render(<AuthForm type="sign-in" />);
    expect(container.innerHTML).toBe('');
  });

  it('renders sign-in form for unauthenticated user', () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AuthForm type="sign-in" />);

    expect(screen.getByText(l.auth.logInToRentMyCar)).toBeInTheDocument();
    expect(screen.getByText(l.auth.enterDetails)).toBeInTheDocument();
  });

  it('renders sign-up form for unauthenticated user', () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AuthForm type="sign-up" />);

    expect(screen.getByText(l.auth.createAnAccount)).toBeInTheDocument();
    expect(screen.getByText(l.auth.startJourney)).toBeInTheDocument();
  });

  it('shows sign-in footer on sign-in form', () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AuthForm type="sign-in" />);

    expect(screen.getByText(l.auth.dontHaveAccount)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: l.common.signUp })).toHaveAttribute(
      'href',
      '/sign-up'
    );
  });

  it('shows sign-up footer on sign-up form', () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AuthForm type="sign-up" />);

    expect(screen.getByText(l.auth.alreadyHaveAccount)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: l.common.logIn })).toHaveAttribute(
      'href',
      '/sign-in'
    );
  });

  it('renders ProfileForm with email and password fields', () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AuthForm type="sign-in" />);

    expect(screen.getByPlaceholderText(l.common.email)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(l.common.password)).toBeInTheDocument();
  });

  it('renders Google sign-up button on sign-up form', () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AuthForm type="sign-up" />);

    expect(
      screen.getByText(l.common.signUpWithGoogle).closest('button')
    ).toBeInTheDocument();
  });
});
