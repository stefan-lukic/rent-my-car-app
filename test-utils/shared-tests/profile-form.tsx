import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import l from '@/helper/en';

export interface ProfileFormSharedConfig {
  Component: ComponentType<{ type: string; callbackUrl: string }>;
  mocks: {
    signIn: ReturnType<typeof vi.fn>;
    push: ReturnType<typeof vi.fn>;
    axiosPost: ReturnType<typeof vi.fn>;
  };
}

export const runProfileFormSharedTests = (config: ProfileFormSharedConfig) => {
  const { Component, mocks } = config;

  it('renders email and password fields for sign-in', async () => {
    const user = userEvent.setup();
    render(<Component type="sign-in" callbackUrl="/" />);
    const emailInput = screen.getByLabelText(l.common.email);
    const passwordInput = screen.getByLabelText(l.common.password);

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(emailInput.id).not.toBe(passwordInput.id);
  });

  it('lets the user show and hide the password', async () => {
    const user = userEvent.setup();
    render(<Component type="sign-in" callbackUrl="/" />);

    const passwordInput = screen.getByPlaceholderText(l.common.password);
    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('renders name field and file input for sign-up', async () => {
    const user = userEvent.setup();
    render(<Component type="sign-up" callbackUrl="/" />);
    expect(screen.getByLabelText(l.common.name)).toBeInTheDocument();
    expect(screen.getByLabelText(l.common.phoneNumber)).toBeInTheDocument();
    expect(screen.getByLabelText(l.cars.chooseFiles)).toBeInTheDocument();
    expect(screen.getByLabelText(l.auth.confirmPassword)).toHaveAttribute(
      'type',
      'password'
    );
  });

  it('lets the user show and hide the confirm password', async () => {
    const user = userEvent.setup();
    render(<Component type="sign-up" callbackUrl="/" />);

    const confirmPasswordInput = screen.getByPlaceholderText(
      l.auth.confirmPassword
    );

    await user.click(
      screen.getByRole('button', { name: 'Show confirm password' })
    );
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    await user.click(
      screen.getByRole('button', { name: 'Hide confirm password' })
    );
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('does not submit sign-up when passwords do not match', async () => {
    const user = userEvent.setup();
    render(<Component type="sign-up" callbackUrl="/" />);

    await user.type(screen.getByPlaceholderText(l.common.name), 'Marko');
    await user.type(
      screen.getByPlaceholderText(l.common.email),
      'marko@example.com'
    );
    await user.type(
      screen.getByPlaceholderText(l.common.phoneNumber),
      '+381601234567'
    );
    await user.type(
      screen.getByPlaceholderText(l.common.password),
      'sigurna-lozinka'
    );
    await user.type(
      screen.getByPlaceholderText(l.auth.confirmPassword),
      'druga-lozinka'
    );
    await user.click(
      screen.getByRole('button', { name: l.auth.createAccount })
    );

    expect(await screen.findByText(l.auth.passwordsDoNotMatch)).toBeVisible();
    expect(mocks.axiosPost).not.toHaveBeenCalled();
  });

  it('shows Create Account button for sign-up', async () => {
    const user = userEvent.setup();
    render(<Component type="sign-up" callbackUrl="/" />);
    expect(screen.getByText(l.auth.createAccount)).toBeInTheDocument();
  });

  it('shows Log in button for sign-in', async () => {
    const user = userEvent.setup();
    render(<Component type="sign-in" callbackUrl="/" />);
    expect(screen.getByText(l.common.logIn)).toBeInTheDocument();
  });

  it('shows Forgot Password link for sign-in', async () => {
    const user = userEvent.setup();
    render(<Component type="sign-in" callbackUrl="/" />);
    expect(screen.getByText(l.auth.forgotPassword)).toBeInTheDocument();
  });

  it('does not show Forgot Password link for sign-up', async () => {
    const user = userEvent.setup();
    render(<Component type="sign-up" callbackUrl="/" />);
    expect(screen.queryByText(l.auth.forgotPassword)).not.toBeInTheDocument();
  });

  it('signs in and redirects after successful credentials response', async () => {
    const user = userEvent.setup();
    mocks.signIn.mockResolvedValue({
      ok: true,
      error: null,
      status: 200,
      url: null,
    });

    render(<Component type="sign-in" callbackUrl="/profile/my-profile" />);

    await user.type(
      screen.getByPlaceholderText(l.common.email),
      'marko@example.com'
    );
    await user.type(
      screen.getByPlaceholderText(l.common.password),
      'sigurna-lozinka'
    );
    await user.click(screen.getByRole('button', { name: l.common.logIn }));

    await waitFor(() => {
      expect(mocks.signIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'marko@example.com',
        password: 'sigurna-lozinka',
      });
    });

    expect(mocks.push).toHaveBeenCalledWith('/profile/my-profile');
  });

  it('shows invalid credentials error when sign-in fails', async () => {
    const user = userEvent.setup();
    mocks.signIn.mockResolvedValue({
      ok: false,
      error: 'Invalid credentials',
      status: 401,
      url: null,
    });

    render(<Component type="sign-in" callbackUrl="/" />);

    await user.type(
      screen.getByPlaceholderText(l.common.email),
      'marko@example.com'
    );
    await user.type(
      screen.getByPlaceholderText(l.common.password),
      'sigurna-lozinka'
    );
    await user.click(screen.getByRole('button', { name: l.common.logIn }));

    expect(
      await screen.findByText(l.auth.invalidCredentials)
    ).toBeInTheDocument();
  });

  it('submits sign-up data and redirects to verification page', async () => {
    const user = userEvent.setup();
    mocks.axiosPost.mockResolvedValue({ status: 201 });

    render(<Component type="sign-up" callbackUrl="/" />);

    await user.type(
      screen.getByPlaceholderText(l.common.name),
      'Marko Markovic'
    );
    await user.type(
      screen.getByPlaceholderText(l.common.email),
      'marko@example.com'
    );
    await user.type(
      screen.getByPlaceholderText(l.common.password),
      'sigurna-lozinka'
    );
    await user.type(
      screen.getByPlaceholderText(l.auth.confirmPassword),
      'sigurna-lozinka'
    );
    await user.type(
      screen.getByPlaceholderText(l.common.phoneNumber),
      '+381601234567'
    );
    await user.click(
      screen.getByRole('button', { name: l.auth.createAccount })
    );

    await waitFor(() => {
      expect(mocks.axiosPost).toHaveBeenCalledOnce();
    });

    const submittedFormData = mocks.axiosPost.mock.calls[0][1] as FormData;
    expect(submittedFormData.get('password')).toBe('sigurna-lozinka');
    expect(submittedFormData.has('confirmPassword')).toBe(false);

    expect(mocks.push).toHaveBeenCalledWith(
      '/verify-email?status=verification-sent'
    );
  });
};
