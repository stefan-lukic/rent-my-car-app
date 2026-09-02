'use client';

import { useEffect } from 'react';

const LEGACY_PRIVATE_CACHE_NAME = 'offlineCache';

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(async (registration) => {
          // Remove private responses stored by the previous broad runtime rule.
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
    }
  }, []);

  return null;
}
