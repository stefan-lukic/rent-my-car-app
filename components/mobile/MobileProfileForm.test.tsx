/**
 * MobileProfileForm.test.tsx
 *
 * MobileProfileForm komponenta je mobilna verzija autentikacione forme.
 * Objedinjuje sign-in i sign-up flow, koristi react-hook-form za validaciju,
 * axios za sign-up API poziv i next-auth za sign-in.
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test — testiraju se UI elementi i njihova interakcija.
 * - Svi spoljni moduli su mockovani: axios, next-auth, next/navigation,
 *   next/image, react-hook-form (zodResolver).
 * - Stvarni API pozivi i validacija se testiraju u zasebnim testovima
 *   (ProfileForm.test.tsx, useForgotPassword.test.tsx, itd.).
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - MobileProfileForm je "leaf" komponenta sa sopstvenom form logicom.
 * - Zato mockujemo sve spoljne zavisnosti kako bismo izolovali UI.
 * - Koristimo l objekat za sve tekstove (otpornost na promene lokalizacije).
 */

import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import MobileProfileForm from './MobileProfileForm';
import { runProfileFormSharedTests } from '@/test-utils/shared-tests/profile-form';

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
  authFormSchema: () =>
    z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().optional(),
    }),
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
});
