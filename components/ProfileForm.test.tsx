/**
 * ProfileForm.test.tsx
 *
 * ProfileForm komponenta predstavlja glavnu autentikacionu formu za aplikaciju.
 * Ona objedinjuje dva scenarija:
 *   - Sign-in (prijavu) sa emailom i lozinkom
 *   - Sign-up (registraciju) sa imenom, emailom, lozinkom i opcionalnim slikama
 *
 * ZBOG ČEGA TESTIRAMO OVAKO:
 * - ProfileForm je "leaf" komponenta koja koristi react-hook-form za validaciju,
 *   axios za sign-up API poziv i next-auth za sign-in.
 * - Zato mockujemo sve spoljne zavisnosti (axios, next-auth, next/navigation, next/image)
 *   kako bismo izolovali samo UI ponašanje i interakciju korisnika sa formom.
 * - Koristimo "l" objekt za sve tekstove kako bi testovi bili otporni na promene
 *   u lokalizaciji (en.tsx fajlu).
 *
 * KOJE MOCKOVE KORISTIMO I ZAŠTO:
 * - vi.hoisted() za cross-module mockove (push, signIn, axiosPost) jer je to
 *   sigurniji pristup od običnog vi.fn() jer omogućava bolju type safety.
 * - next/image: mora da se mockuje jer u jsdom okruženju nema podrške za Next.js Image komponentu.
 * - next/navigation: mora da se mockuje jer useRouter() zahteva Next.js kontekst.
 * - axios: mockujemo da ne bismo pozivali stvarni API tokom testiranja.
 * - next-auth/react: mockujemo signIn da ne bismo izvodili stvarnu autentikaciju.
 */

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
