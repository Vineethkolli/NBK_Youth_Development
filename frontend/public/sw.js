self.addEventListener('push', (event) => {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: './logo.png',    // You can add an icon in the public folder
    badge: './logo.png',   // Add a badge icon if needed
    vibrate: [200, 100, 200], // Optional: Add vibration pattern
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {action: 'explore', title: 'Go to the site',
        icon: './checkmark.png'},
      {action: 'close', title: 'Close the notification',
        icon: './xmark.png'},
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'close') {
      // Handle 'close' action if needed
  } else {
      clients.openWindow('/');
  }
});
