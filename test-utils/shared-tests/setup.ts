import { vi } from 'vitest';

export const setupGlobalMocks = () => {
  vi.stubGlobal('fetch', vi.fn());
  vi.stubGlobal('alert', vi.fn());
  vi.stubGlobal('crypto', {
    randomUUID: vi.fn(() => 'generated-image-id'),
  });
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn(() => 'blob:profile-image'),
  });
};
