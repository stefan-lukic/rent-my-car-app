import { vi } from 'vitest';
import { z } from 'zod';

export const createLibUtilsMock = () => {
  vi.mock('@/lib/utils', () => ({
    authFormSchema: () =>
      z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        password: z.string().optional(),
      }),
    cn: (...args: any[]) => args.join(' '),
  }));
};