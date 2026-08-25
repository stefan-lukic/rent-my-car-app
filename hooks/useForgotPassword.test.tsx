import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import { useForgotPassword } from './useForgotPassword';
import l from '@/helper/en';

const mocks = vi.hoisted(() => ({
  axiosPost: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    post: mocks.axiosPost,
  },
}));

const ForgotPasswordHarness = () => {
  const { register, handleSubmit, errors, isSubmitting, successMessage } =
    useForgotPassword();

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        aria-label="Email"
        {...register('email', {
          required: l.auth.emailRequired,
        })}
      />

      {errors.email && <p>{errors.email.message}</p>}
      {errors.root && <p>{errors.root.message}</p>}
      {successMessage && <p>{successMessage}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending' : 'Send'}
      </button>
    </form>
  );
};

describe('useForgotPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows required email error when form is submitted empty', async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordHarness />);

    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByText(l.auth.emailRequired)).toBeInTheDocument();

    expect(mocks.axiosPost).not.toHaveBeenCalled();
  });

  it('sends email and exposes success message after successful request', async () => {
    const user = userEvent.setup();
    mocks.axiosPost.mockResolvedValue({
      status: 200,
    });

    render(<ForgotPasswordHarness />);

    await user.type(screen.getByLabelText('Email'), 'marko@example.com');

    await user.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(mocks.axiosPost).toHaveBeenCalledWith(
        '/api/auth/forgot-password',
        { email: 'marko@example.com' }
      );
    });

    expect(screen.getByText(l.auth.passwordResetSuccess)).toBeInTheDocument();
  });

  it('shows server message when request fails with server response', async () => {
    const user = userEvent.setup();
    mocks.axiosPost.mockRejectedValue({
      response: {
        data: {
          message: 'No account exists with this email.',
        },
      },
    });

    render(<ForgotPasswordHarness />);

    await user.type(screen.getByLabelText('Email'), 'missing@example.com');

    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(
      await screen.findByText('No account exists with this email.')
    ).toBeInTheDocument();
  });

  it('shows fallback error when request fails without server message', async () => {
    const user = userEvent.setup();
    mocks.axiosPost.mockRejectedValue(new Error('Network failure'));

    render(<ForgotPasswordHarness />);

    await user.type(screen.getByLabelText('Email'), 'marko@example.com');

    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByText(l.auth.somethingWrong)).toBeInTheDocument();
  });
});
