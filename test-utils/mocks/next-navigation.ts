import { vi } from 'vitest';

export const createNextNavigationMock = () => {
  const mocks = vi.hoisted(() => ({
    push: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
    mockUsePathname: vi.fn(),
    mockUseSearchParams: vi.fn(),
  }));

  vi.mock('next/navigation', () => ({
    useRouter: () => ({
      push: mocks.push,
      back: mocks.back,
      refresh: mocks.refresh,
    }),
    usePathname: mocks.mockUsePathname,
    useSearchParams: () => ({ get: mocks.mockUseSearchParams }),
  }));

  return mocks;
};
