import { vi } from 'vitest';

export const createDeviceDetectionMock = () => {
  vi.mock('@/utils/deviceDetectionCSR', () => ({
    isMobileCSR: () => false,
  }));
};