self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data.title || 'Notification';
  const options = {
    body: data.body || 'You have a new message!',
    icon: './logo.png',    // Ensure this file exists in the public folder
    badge: './logo.png',   // Badge icon for mobile notifications
    vibrate: [100, 50, 100],  // Vibration pattern for mobile devices
    data: {
      url: data.url || '/',  // URL to navigate when notification is clicked
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
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
