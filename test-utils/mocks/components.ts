import { vi } from 'vitest';

export const createUseAddCar = () => {
  const mocks = vi.hoisted(() => ({
    useAddCar: vi.fn(),
  }));

  vi.mock('@/hooks/useAddCar', () => ({
    useAddCar: () => mocks.useAddCar(),
  }));

  return mocks;
};
