import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PushNotificationManager } from './PushNotificationManager';
import l from '@/helper/en';

Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: vi
      .fn()
      .mockResolvedValue({ pushManager: { getSubscription: vi.fn() } }),
    ready: Promise.resolve({ pushManager: { getSubscription: vi.fn() } }),
  },
  writable: true,
  configurable: true,
});

describe('PushNotificationManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * TEST 1: Prikazuje notSupported poruku u jsdom okruženju
   * ZAŠTO: U jsdom-u `window.PushManager` ne postoji, pa komponenta
   *   ispravno prikazuje notSupported poruku.
   * KAKO: Renderujemo komponentu i proveravamo prisustvo poruke.
   */
  it('shows not supported message when Push API is unavailable', () => {
    render(<PushNotificationManager />);

    expect(
      screen.getByText(l.pushNotifications.notSupported)
    ).toBeInTheDocument();
  });

  /**
   * TEST 2: Ne prikazuje subscribe UI u jsdom okruženju
   * ZAŠTO: Kada Push API nije dostupan, subscribe dugme ne sme
   *   biti prikazano.
   * KAKO: Proveravamo da subscribe poruka nije u DOM-u.
   */
  it('does not show subscribe UI when Push API is unavailable', () => {
    render(<PushNotificationManager />);

    expect(
      screen.queryByText(l.pushNotifications.notSubscribed)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(l.pushNotifications.subscribe)
    ).not.toBeInTheDocument();
  });

  /**
   * TEST 3: Ne prikazuje subscribed UI u jsdom okruženju
   * ZAŠTO: Isti razlog kao TEST 2 — bez Push API-a nema
   *   subscribe state-a.
   * KAKO: Proveravamo da subscribed poruka nije u DOM-u.
   */
  it('does not show subscribed UI when Push API is unavailable', () => {
    render(<PushNotificationManager />);

    expect(
      screen.queryByText(l.pushNotifications.subscribed)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(l.pushNotifications.unsubscribe)
    ).not.toBeInTheDocument();
  });
});
