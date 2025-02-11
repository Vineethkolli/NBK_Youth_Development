self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/logo.png',
    badge: '/logo.png',
    data: {
      url: '/notifications' // URL to open when notification is clicked
    },
    actions: [
      {
        action: 'open',
        title: 'Open'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Open the app and navigate to notifications page
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If a window client is available, navigate to the notifications page
        for (const client of clientList) {
          if ('focus' in client) {
            client.focus();
            if (client.navigate) {
              return client.navigate('/notifications');
            }
            return;
          }
        }
        // If no window client is available, open a new one
        if (clients.openWindow) {
          return clients.openWindow('/notifications');
        }
      })
  );
});