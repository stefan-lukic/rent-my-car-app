import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { render, screen } from '@testing-library/react';
import MobileProfileForm from './MobileProfileForm';
import { runProfileFormSharedTests } from '@/test-utils/shared-tests/profile-form';
import l from '@/helper/en';

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

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props || {};
    return React.createElement('img', { src, alt, width, height, ...rest });
  },
}));

vi.mock('@/lib/utils', () => ({
  authFormSchema: (type: string) =>
    z
      .object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        password: z.string().optional(),
        confirmPassword: z.string().optional(),
        phoneNumber: z.string().optional(),
      })
      .refine(
        (data) => type === 'sign-in' || data.password === data.confirmPassword,
        { path: ['confirmPassword'], message: 'Passwords do not match' }
      ),
  cn: (...args: any[]) => args.join(' '),
}));

describe('MobileProfileForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  runProfileFormSharedTests({
    Component: MobileProfileForm,
    mocks,
  });

  it('shows Google sign-up as coming soon and disabled', () => {
    render(<MobileProfileForm type="sign-up" callbackUrl="/" />);

    expect(
      screen.getByRole('button', {
        name: /sign up with google coming soon/i,
      })
    ).toBeDisabled();
    expect(
      screen.getByLabelText(l.common.profilePhotoOptional)
    ).not.toBeRequired();
  });
});
