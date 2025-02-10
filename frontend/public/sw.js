self.addEventListener('push', (event) => {
    const data = event.data.json();
  
    const options = {
      body: data.body,
      icon: './logo.png',    // You can add an icon in the public folder
      badge: './logo.png',  // Add a badge icon if needed
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  