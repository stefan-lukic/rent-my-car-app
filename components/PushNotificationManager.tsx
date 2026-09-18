'use client';

import { subscribeUser, unsubscribeUser } from '@/app/actions';
import { useState, useEffect } from 'react';
import l from '@/helper/en';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function sendTestNotification() {
    if (subscription) {
      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription),
        });

        if (response.ok) {
          setMessage('');
        } else {
          console.error('Failed to send notification');
        }
      } catch (error) {
        console.error('Error sending notification', error);
      }
    }
  }

  if (!isSupported) {
    return (
      <p className="rounded-xl border border-border bg-surface-0 p-4 text-sm text-body-muted">
        {l.pushNotifications.notSupported}
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface-0 p-5 shadow-sm">
      {subscription ? (
        <div className="space-y-4">
          <p className="text-sm font-medium text-body">
            {l.pushNotifications.subscribed}
          </p>
          <Button variant="secondary" onClick={unsubscribeFromPush}>
            {l.pushNotifications.unsubscribe}
          </Button>
          <Input
            type="text"
            placeholder={l.pushNotifications.enterNotificationMsg}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={sendTestNotification}>
            {l.pushNotifications.sendTest}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-body-muted">
            {l.pushNotifications.notSubscribed}
          </p>
          <Button onClick={subscribeToPush}>
            {l.pushNotifications.subscribe}
          </Button>
        </div>
      )}
    </div>
  );
}

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  if (isStandalone) {
    return null;
  }

  return (
    <div>
      {isIOS && isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-app-title"
            className="w-full max-w-sm rounded-2xl border border-border bg-surface-0 p-6 shadow-xl"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2
                id="install-app-title"
                className="font-heading text-xl font-bold text-ink"
              >
                RentMyCar
              </h2>

              <button
                type="button"
                onClick={() => setIsPopupOpen(false)}
                aria-label="Close install instructions"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-body-subtle transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>

            <p className="mb-6 text-sm leading-6 text-body-muted">
              {l.pushNotifications.iosInstall}
            </p>
            <Button className="w-full" onClick={() => null}>
              {l.pushNotifications.getAppStore}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
