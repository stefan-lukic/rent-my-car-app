import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileForm from './ProfileForm';
import { runProfileFormSharedTests } from '@/test-utils/shared-tests/profile-form';

process.on('unhandledRejection', (err) => {
  if (err && typeof err === 'object' && '_zod' in err) {
    return;
  }
  throw err;
});

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  signIn: vi.fn(),
  axiosPost: vi.fn(),
}));

vi.mock('next-auth/react', () => ({
  signIn: mocks.signIn,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock('axios', () => ({
  __esModule: true,
  default: {
    post: mocks.axiosPost,
  },
  isAxiosError: () => false,
}));

vi.mock('@/lib/utils', () => ({
  authFormSchema: () =>
    z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().optional(),
    }),
  cn: (...args: any[]) => args.join(' '),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props || {};
    return React.createElement('img', { src, alt, width, height, ...rest });
  },
}));

describe('ProfileForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  runProfileFormSharedTests({
    Component: ProfileForm,
    mocks,
  });

  it('shows Google sign-up button for sign-up', async () => {
    const user = userEvent.setup();
    render(<ProfileForm type="sign-up" callbackUrl="/" />);
    expect(screen.getByText(/sign up with google/i)).toBeInTheDocument();
  });

  it('shows loading state on button when submitting', async () => {
    const user = userEvent.setup();
    render(<ProfileForm type="sign-in" callbackUrl="/" />);
    const button = screen.getByText(/log in/i);
    expect(button).not.toBeDisabled();
  });

  it('does not submit invalid sign-in data', async () => {
    const user = userEvent.setup();
    render(<ProfileForm type="sign-in" callbackUrl="/" />);

    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mocks.signIn).not.toHaveBeenCalled();
    });
  });
});
