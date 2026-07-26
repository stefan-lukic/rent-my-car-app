import { vi } from 'vitest';

export const createAxiosMock = () => {
  const mocks = vi.hoisted(() => ({
    axiosPost: vi.fn(),
  }));

  vi.mock('axios', () => ({
    __esModule: true,
    default: {
      post: mocks.axiosPost,
    },
    isAxiosError: () => false,
  }));

  return mocks;
};