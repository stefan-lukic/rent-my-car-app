'use client';

import { subscribeUser, unsubscribeUser } from '@/app/actions';
import { useState, useEffect } from 'react';
import l from '@/helper/en';

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
    return <p>{l.pushNotifications.notSupported}</p>;
  }

  return (
    <div>
      {subscription ? (
        <>
          <p>{l.pushNotifications.subscribed}</p>
          <button onClick={unsubscribeFromPush}>{l.pushNotifications.unsubscribe}</button>
          <input
            type="text"
            placeholder={l.pushNotifications.enterNotificationMsg}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendTestNotification}>{l.pushNotifications.sendTest}</button>
        </>
      ) : (
        <>
          <p>{l.pushNotifications.notSubscribed}</p>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={subscribeToPush}
          >
            {l.pushNotifications.subscribe}
          </button>
        </>
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
    return null; // Don't show install button if already installed
  }

  return (
    <div>
      {isIOS && isPopupOpen && (
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="relative flex justify-end">
                <button onClick={() => setIsPopupOpen(false)}>✖</button>
              </div>

              <p>{l.pushNotifications.iosInstall}</p>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={() => null}
              >
                {l.pushNotifications.getAppStore}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
