self.addEventListener('push', (event) => {
  console.log('SW: Push event received:', event);

  let payload = {};
  if (event.data) {
    try {
      payload = event.data.json();
      console.log('SW: Push payload:', payload);
    } catch (error) {
      console.error('SW: Error parsing push data:', error);
    }
  } else {
    console.warn('SW: No data payload received');
  }

  // Use a fallback title and message if none are provided
  const title = payload.title || 'New Notification';
  const options = {
    body: payload.body || 'You have received a new notification!',
    // Use absolute paths to ensure the assets load properly
    icon: '/logo.png',    // Make sure logo.png exists in your public folder
    badge: '/logo.png',
    vibrate: [200, 100, 200],
    // Require user interaction so that the notification remains visible until acted upon
    requireInteraction: true,
    data: {
      // You can pass a URL or other data to use in notification click handling
      url: payload.url || '/',
    },
    // Optional actions if you want to provide buttons on the notification
    actions: [
      {
        action: 'open_url',
        title: 'Open App'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('SW: Notification click event:', event);
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus the window if it's already open, or open a new one.
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
