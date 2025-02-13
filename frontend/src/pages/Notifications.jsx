import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '../utils/config';
import { urlBase64ToUint8Array } from '../utils/vapidKeys';
import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';
import NotificationForm from '../components/notifications/NotificationForm';

function Notifications() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registerServiceWorker)
        .catch((error) => console.error('Service Worker Error:', error));
    }
    getSubscription();
  }, []);

  const registerServiceWorker = async (registration) => {
    console.log('Service Worker registered:', registration);
  };

  const askPermission = async () => {
    try {
      const permissionResult = await Notification.requestPermission();
      if (permissionResult !== 'granted') {
        throw new Error('Permission denied');
      }
      await subscribeUser();
    } catch (error) {
      console.error('Permission error:', error);
      toast.error('Failed to enable notifications: ' + error.message);
    }
  };

  const subscribeUser = async () => {
    try {
      if (!user?.registerId) {
        toast.error('User is not logged in or registerId is missing');
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const response = await axios.get(`${API_URL}/api/notifications/publicKey`);
      const publicVapidKey = response.data.publicKey;
      const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      await axios.post(`${API_URL}/api/notifications/subscribe`, {
        registerId: user.registerId,
        subscription,
      });

      setSubscription(subscription);
      toast.success('Notifications enabled successfully');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to subscribe for notifications');
    }
  };

  const getSubscription = async () => {
    const registration = await navigator.serviceWorker.ready;
    const existingSubscription = await registration.pushManager.getSubscription();
    setSubscription(existingSubscription);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <Bell className="mr-2" /> Notification Settings
          </h2>
          {!subscription ? (
            <button
              onClick={askPermission}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Bell className="mr-2 h-5 w-5" /> Enable Notifications
            </button>
          ) : (
            <div className="flex items-center text-green-600">
              <Bell className="mr-2 h-5 w-5" /> Notifications Enabled
            </div>
          )}
        </div>
      </div>
      <NotificationForm />
    </div>
  );
}

export default Notifications;
