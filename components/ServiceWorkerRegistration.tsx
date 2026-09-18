'use client';

import { useEffect } from 'react';

const LEGACY_PRIVATE_CACHE_NAME = 'offlineCache';

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // Development must not reuse production service-worker assets.
    if (process.env.NODE_ENV === 'development') {
      const unregisterWorkers = navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(
            registrations.map((registration) => registration.unregister())
          )
        );
      const clearCaches =
        'caches' in window
          ? window.caches
              .keys()
              .then((cacheNames) =>
                Promise.all(
                  cacheNames.map((cacheName) => window.caches.delete(cacheName))
                )
              )
          : Promise.resolve([]);

      Promise.all([unregisterWorkers, clearCaches]).catch((error) => {
        console.error('Development cache cleanup failed:', error);
      });
      return;
    }

    navigator.serviceWorker
      .register('/sw.js')
      .then(async (registration) => {
        if ('caches' in window) {
          await window.caches.delete(LEGACY_PRIVATE_CACHE_NAME);
        }

        console.log(
          'Service Worker registered with scope:',
          registration.scope
        );
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }, []);

  return null;
}
