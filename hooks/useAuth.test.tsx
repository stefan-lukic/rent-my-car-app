import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from './useAuth';

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

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading state while the session is loading', () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'loading',
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeUndefined();
  });

  it('returns authenticated user data', () => {
    mocks.useSession.mockReturnValue({
      data: {
        user: {
          name: 'Marko Markovic',
        },
      },
      status: 'authenticated',
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({
      name: 'Marko Markovic',
    });
  });

  it('calls signIn with credential data', async () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    mocks.signIn.mockResolvedValue({
      ok: true,
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('marko@example.com', 'sigurna-lozinka');
    });

    expect(mocks.signIn).toHaveBeenCalledWith('credentials', {
      redirect: false,
      email: 'marko@example.com',
      password: 'sigurna-lozinka',
    });
  });

  it('throws signIn error to the caller', async () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    mocks.signIn.mockResolvedValue({
      ok: false,
      error: 'Invalid credentials',
    });

    const { result } = renderHook(() => useAuth());

    await expect(
      result.current.login('marko@example.com', 'wrong-password')
    ).rejects.toThrow('Invalid credentials');
  });

  it('calls signOut without redirecting', () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(mocks.signOut).toHaveBeenCalledWith({
      redirect: false,
    });
  });
});
