// sw.js in your src directory

// Precache manifest will be injected here by VitePWA
self.__WB_MANIFEST;

// Your push notification listener
self.addEventListener('push', (event) => {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: './logo.png', // Ensure path is correct relative to service worker
    badge: './logo.png',
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/notifications')
  );
});
