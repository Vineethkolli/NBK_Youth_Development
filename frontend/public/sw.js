
// Custom notification logic:
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Default Title';
  const body = data.body || 'Default message';

  // Check the message body for a link marker ("Open Link: <URL>")
  let url = null;
  const regex = /Open Link:\s*(https?:\/\/\S+)/;
  const match = body.match(regex);
  if (match) {
    url = match[1];
  }

  const options = {
    body,
    icon: '/logo.png',
    badge: '/notificationlogo.png',
    data: { url },
    // Add an action button if a URL is found
    actions: url ? [{ action: 'open_link', title: 'Open Link' }] : [],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url;

  if (event.action === 'open_link' && urlToOpen) {
    event.waitUntil(clients.openWindow(urlToOpen));
  } else {
    event.waitUntil(clients.openWindow('/notifications'));
  }
});
