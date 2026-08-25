import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ServiceWorkerRegistrar from './ServiceWorkerRegistration';

const mockServiceWorker = vi.fn();

Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: mockServiceWorker.mockResolvedValue({
      scope: '/',
    }),
  },
  writable: true,
  configurable: true,
});

describe('ServiceWorkerRegistrar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServiceWorker.mockResolvedValue({ scope: '/' });
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
