import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ServiceWorkerRegistrar from './ServiceWorkerRegistration';

const mockServiceWorker = vi.fn();
const mockCacheDelete = vi.fn();
const mockCacheKeys = vi.fn();
const mockGetRegistrations = vi.fn();

Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: mockServiceWorker.mockResolvedValue({
      scope: '/',
    }),
    getRegistrations: mockGetRegistrations,
  },
  writable: true,
  configurable: true,
});

Object.defineProperty(window, 'caches', {
  value: {
    delete: mockCacheDelete,
    keys: mockCacheKeys,
  },
  writable: true,
  configurable: true,
});

describe('ServiceWorkerRegistrar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServiceWorker.mockResolvedValue({ scope: '/' });
    mockCacheDelete.mockResolvedValue(true);
    mockCacheKeys.mockResolvedValue([]);
    mockGetRegistrations.mockResolvedValue([]);
    (
      navigator as unknown as { serviceWorker: ServiceWorkerContainer }
    ).serviceWorker = {
      register: mockServiceWorker,
      getRegistrations: mockGetRegistrations,
    } as unknown as ServiceWorkerContainer;
    (
      window as unknown as {
        caches: {
          delete: typeof mockCacheDelete;
          keys: typeof mockCacheKeys;
        };
      }
    ).caches = {
      delete: mockCacheDelete,
      keys: mockCacheKeys,
    };
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('renders no visible UI', () => {
    const { container } = render(<ServiceWorkerRegistrar />);

    expect(container.innerHTML).toBe('');
  });

  it('registers service worker with correct URL and scope', async () => {
    render(<ServiceWorkerRegistrar />);

    await vi.waitFor(() => {
      expect(mockServiceWorker).toHaveBeenCalledWith('/sw.js');
    });
  });

  it('removes the legacy cache that could contain private responses', async () => {
    render(<ServiceWorkerRegistrar />);

    await vi.waitFor(() => {
      expect(mockCacheDelete).toHaveBeenCalledWith('offlineCache');
    });
  });

  it('removes stale workers and caches instead of registering in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const unregister = vi.fn().mockResolvedValue(true);
    mockGetRegistrations.mockResolvedValue([{ unregister }]);
    mockCacheKeys.mockResolvedValue(['static-resources', 'workbox-precache']);

    render(<ServiceWorkerRegistrar />);

    await vi.waitFor(() => {
      expect(unregister).toHaveBeenCalledOnce();
      expect(mockCacheDelete).toHaveBeenCalledWith('static-resources');
      expect(mockCacheDelete).toHaveBeenCalledWith('workbox-precache');
    });
    expect(mockServiceWorker).not.toHaveBeenCalled();
  });

  it('still registers when the Cache API is unavailable', async () => {
    delete (window as unknown as { caches?: CacheStorage }).caches;

    render(<ServiceWorkerRegistrar />);

    await vi.waitFor(() => {
      expect(mockServiceWorker).toHaveBeenCalledWith('/sw.js');
    });
    expect(mockCacheDelete).not.toHaveBeenCalled();
  });

  it('does not register when serviceWorker is unavailable', () => {
    const originalSW = (navigator as any).serviceWorker;

    delete (navigator as any).serviceWorker;

    render(<ServiceWorkerRegistrar />);

    expect(mockServiceWorker).not.toHaveBeenCalled();

    (navigator as any).serviceWorker = originalSW;
  });

  it('registers only once on mount', async () => {
    const { rerender } = render(<ServiceWorkerRegistrar />);

    await vi.waitFor(() => {
      expect(mockServiceWorker).toHaveBeenCalledTimes(1);
    });

    const originalSW = (navigator as any).serviceWorker;

    (navigator as any).serviceWorker = {
      register: vi.fn().mockResolvedValue({ scope: '/' }),
    };

    rerender(<ServiceWorkerRegistrar />);

    expect(mockServiceWorker).toHaveBeenCalledTimes(1);

    (navigator as any).serviceWorker = originalSW;
  });
});
