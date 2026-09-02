import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ServiceWorkerRegistrar from './ServiceWorkerRegistration';

const mockServiceWorker = vi.fn();
const mockCacheDelete = vi.fn();

Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: mockServiceWorker.mockResolvedValue({
      scope: '/',
    }),
  },
  writable: true,
  configurable: true,
});

Object.defineProperty(window, 'caches', {
  value: {
    delete: mockCacheDelete,
  },
  writable: true,
  configurable: true,
});

describe('ServiceWorkerRegistrar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServiceWorker.mockResolvedValue({ scope: '/' });
    mockCacheDelete.mockResolvedValue(true);
    (
      window as unknown as { caches: { delete: typeof mockCacheDelete } }
    ).caches = {
      delete: mockCacheDelete,
    };
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
