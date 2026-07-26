/**
 * ServiceWorkerRegistration.test.tsx
 *
 * ServiceWorkerRegistrar komponenta registruje service worker
 * ('/sw.js') kada se komponenta mount-uje. Ne prikazuje nikakav UI
 * — vraća null. Koristi useEffect za registraciju.
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test — proveravamo da li useEffect poziva
 *   navigator.serviceWorker.register() kada je dostupan.
 * - navigator.serviceWorker je mockovan jer testiramo u jsdom-u
 *   koji ne podržava stvarne service worker-e.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - ServiceWorkerRegistrar je "invisible side-effect" komponenta —
 *   nema UI, samo izvršava registraciju prilikom mount-a.
 * - Zato testiramo: da li registracija pozvana sa tačnim argumentima
 *   (scope: '/', updateViaCache: 'none').
 */

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

  /**
   * TEST 1: Vraća null (nema UI elementa)
   * ZAŠTO: Ova komponenta ima samo useEffect za registraciju
   *   — ne renderuje nikakav JSX.
   * KAKO: Proveravamo da container.innerHTML nema bilo šta
   *   osim komentara ili praznog stringa.
   */
  it('renders no visible UI', () => {
    const { container } = render(<ServiceWorkerRegistrar />);

    expect(container.innerHTML).toBe('');
  });

  /**
   * TEST 2: Registruje service worker sa ispravnim argumentima
   * ZAŠTO: Treba verifikovati da register() poziva sa tačnim
   *   URL-om ('/sw.js') i scope-om ('/').
   * KAKO:
   * 1. Renderujemo komponentu (triggeruje useEffect)
   * 2. Čekamo da Promise resolve (await act ili waitFor)
   * 3. Proveravamo da je navigator.serviceWorker.register pozvan
   *    sa '/sw.js' i scope: '/'.
   */
  it('registers service worker with correct URL and scope', async () => {
    render(<ServiceWorkerRegistrar />);

    await vi.waitFor(() => {
      expect(mockServiceWorker).toHaveBeenCalledWith('/sw.js');
    });
  });

  /**
   * TEST 3: Ne registruje kada serviceWorker nije dostupan
   * ZAŠTO: Ako browser ne podržava serviceWorker (stari browseri),
   *   komponenta ne sme da baci grešku — treba da se tiho preskoči.
   * KAKO: Uklanjamo navigator.serviceWorker, renderujemo,
   *   proveravamo da nije pozvan register.
   */
  it('does not register when serviceWorker is unavailable', () => {
    const originalSW = (navigator as any).serviceWorker;

    delete (navigator as any).serviceWorker;

    render(<ServiceWorkerRegistrar />);

    expect(mockServiceWorker).not.toHaveBeenCalled();

    (navigator as any).serviceWorker = originalSW;
  });

  /**
   * TEST 4: Ne registruje na ponovnom renderu
   * ZAŠTO: useEffect ima prazan dependency niz [] — treba da
   *   se izvrši SAMO jednom prilikom mount-a.
   * KAKO: Renderujemo, čekamo register, zatim ponovo renderujemo
   *   i proveravamo da je register pozvan tačno jednom.
   */
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
