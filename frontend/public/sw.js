self.addEventListener('push', (event) => {
  if (!event.data) {
      console.log('Push event but no data');
      return;
  }
  
  const data = event.data.json();

  const options = {
      body: data.body || "New notification",
      icon: './logo.png',
      badge: './logo.png'
  };

  event.waitUntil(
      self.registration.showNotification(data.title || "Notification", options)
  );
});
