import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/config';
import { urlBase64ToUint8Array } from '../utils/vapidKeys';
import NotificationForm from '../components/notifications/NotificationForm';

function Notifications() {
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registerServiceWorker)
        .catch((error) => console.error('Service Worker Error', error));
    }
    getSubscription();
  }, []);

  const registerServiceWorker = async (registration) => {
    console.log('Service Worker registered:', registration);
  };

  const askPermission = async () => {
    const permissionResult = await Notification.requestPermission();
    if (permissionResult !== 'granted') {
      alert('Permission denied');
    } else {
      subscribeUser();
    }
  };

  const subscribeUser = async () => {
    const registration = await navigator.serviceWorker.ready;
    const response = await axios.get(`${API_URL}/api/notifications/publicKey`);
    const publicVapidKey = response.data.publicKey;
    const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });

    await axios.post(`${API_URL}/api/notifications/subscribe`, subscription);
    setSubscription(subscription);
  };

  const getSubscription = async () => {
    const registration = await navigator.serviceWorker.ready;
    const existingSubscription = await registration.pushManager.getSubscription();
    setSubscription(existingSubscription);
  };

  return (
    <div>
      {!subscription ? (
        <button onClick={askPermission}>Enable Notifications</button>
      ) : (
        <p>Notifications are enabled.</p>
      )}
      <NotificationForm />
    </div>
  );
}

export default Notifications;
