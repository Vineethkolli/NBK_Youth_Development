// src/custom-sw.js
import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

// Claim clients immediately after activation
self.skipWaiting();
clientsClaim();

// Precache assets
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', (event) => {
  try {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/logo.png',
      badge: '/logo.png',
      vibrate: [200, 100, 200],
      data: { url: '/notifications' },
      actions: [{ action: 'open', title: 'Open' }],
      requireInteraction: true,
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('Push notification error:', error);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
