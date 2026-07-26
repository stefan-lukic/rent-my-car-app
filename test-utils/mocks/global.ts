import { vi } from 'vitest';

export const createFetchMock = () => {
  vi.stubGlobal('fetch', vi.fn());
};

export const createAlertMock = () => {
  vi.stubGlobal('alert', vi.fn());
};

export const createCryptoMock = () => {
  vi.stubGlobal(
    'crypto',
    {
      randomUUID: vi.fn(() => 'generated-image-id'),
    }
  );
};

export const createURLMock = () => {
  vi.stubGlobal(
    'URL',
    {
      createObjectURL: vi.fn(() => 'blob:profile-image'),
    }
  );
};