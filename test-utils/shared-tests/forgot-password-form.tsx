import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import l from '@/helper/en';

export interface ForgotPasswordFormSharedConfig {
  Component: ComponentType<{}>;
  handleSubmit: ReturnType<typeof vi.fn>;
  useForgotPasswordMock: ReturnType<typeof vi.fn>;
}

export const runForgotPasswordFormSharedTests = (
  config: ForgotPasswordFormSharedConfig
) => {
  const { Component, handleSubmit, useForgotPasswordMock } = config;

  it('renders heading, email input, submit button and back link', async () => {
    const user = userEvent.setup();
    useForgotPasswordMock.mockReturnValue({
      register: vi.fn(() => ({})),
      handleSubmit,
      errors: {},
      isSubmitting: false,
      successMessage: '',
    });

    render(<Component />);

    expect(
      screen.getByRole('heading', {
        name: l.auth.forgotPasswordHeading,
      })
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText(l.auth.enterEmail)).toHaveAttribute(
      'type',
      'email'
    );

    expect(
      screen.getByRole('button', {
        name: l.auth.sendResetLink,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', {
        name: l.common.backToLogin,
      })
    ).toHaveAttribute('href', '/sign-in');
  });

  it('shows validation error from the hook', async () => {
    const user = userEvent.setup();
    useForgotPasswordMock.mockReturnValue({
      register: vi.fn(() => ({})),
      handleSubmit,
      errors: {
        email: { message: l.auth.emailRequired },
      },
      isSubmitting: false,
      successMessage: '',
    });

    render(<Component />);

    expect(screen.getByText(l.auth.emailRequired)).toBeInTheDocument();
  });

  it('shows server error from the hook', async () => {
    const user = userEvent.setup();
    useForgotPasswordMock.mockReturnValue({
      register: vi.fn(() => ({})),
      handleSubmit,
      errors: {
        root: { message: l.auth.somethingWrong },
      },
      isSubmitting: false,
      successMessage: '',
    });

    render(<Component />);

    expect(screen.getByText(l.auth.somethingWrong)).toBeInTheDocument();
  });

  it('shows success message after reset link is sent', async () => {
    const user = userEvent.setup();
    useForgotPasswordMock.mockReturnValue({
      register: vi.fn(() => ({})),
      handleSubmit,
      errors: {},
      isSubmitting: false,
      successMessage: l.auth.passwordResetSuccess,
    });

    render(<Component />);

    expect(screen.getByText(l.auth.passwordResetSuccess)).toBeInTheDocument();
  });

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    useForgotPasswordMock.mockReturnValue({
      register: vi.fn(() => ({})),
      handleSubmit,
      errors: {},
      isSubmitting: true,
      successMessage: '',
    });

    render(<Component />);

    const button = screen.getByRole('button', {
      name: l.common.sending,
    });

    expect(button).toBeDisabled();
  });

  it('invokes form submit handler when submit button is clicked', async () => {
    const user = userEvent.setup();
    useForgotPasswordMock.mockReturnValue({
      register: vi.fn(() => ({})),
      handleSubmit,
      errors: {},
      isSubmitting: false,
      successMessage: '',
    });

    render(<Component />);

    await user.click(
      screen.getByRole('button', {
        name: l.auth.sendResetLink,
      })
    );

    expect(handleSubmit).toHaveBeenCalled();
  });
};
