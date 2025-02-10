self.addEventListener('push', (event) => {
  console.log('Push event received:', event);

  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    console.error('Error parsing push event data:', error);
  }

  const title = data.title || 'Notification';
  const options = {
    body: data.body || 'You have a new message!',
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/', // URL to open when notification is clicked
    },
    actions: [
      { action: 'open_url', title: 'Open App' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If an open window matches the URL, focus it; otherwise, open a new one.
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
