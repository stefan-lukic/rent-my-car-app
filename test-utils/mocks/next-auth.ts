import { vi } from 'vitest';

export const createNextAuthMock = () => {
  const mocks = vi.hoisted(() => ({
    useSession: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  }));

  vi.mock('next-auth/react', () => ({
    useSession: mocks.useSession,
    signIn: mocks.signIn,
    signOut: mocks.signOut,
  }));

  return mocks;
};