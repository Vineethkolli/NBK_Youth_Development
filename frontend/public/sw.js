// sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting()); // Activate new SW immediately
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim()); // Take control of all clients
});

self.addEventListener('push', (event) => {
  try {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/logo.png', // Use absolute path
      badge: '/logo.png',
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  } catch (error) {
    console.error('Push notification error:', error);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https:nbkyouth.vercel.app') // Replace with your URL
  );
});