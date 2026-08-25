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

  it('shows not supported message when Push API is unavailable', () => {
    render(<PushNotificationManager />);

    expect(
      screen.getByText(l.pushNotifications.notSupported)
    ).toBeInTheDocument();
  });

  it('does not show subscribe UI when Push API is unavailable', () => {
    render(<PushNotificationManager />);

    expect(
      screen.queryByText(l.pushNotifications.notSubscribed)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(l.pushNotifications.subscribe)
    ).not.toBeInTheDocument();
  });

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
