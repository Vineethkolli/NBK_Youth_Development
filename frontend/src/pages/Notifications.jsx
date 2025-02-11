import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/config';
import { urlBase64ToUint8Array } from '../utils/vapidKeys';
import { Bell, BellOff } from 'lucide-react';

function Notifications() {
  const [subscription, setSubscription] = useState(null);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registerServiceWorker)
        .catch((error) => console.error('Service Worker Error', error));
    }
    getSubscription();
    fetchNotificationHistory();
  }, []);

  const registerServiceWorker = async (registration) => {
    console.log('Service Worker registered:', registration);
  };

  const fetchNotificationHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications/history`);
      setNotificationHistory(response.data);
    } catch (error) {
      console.error('Error fetching notification history:', error);
    }
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
      alert('Failed to enable notifications: ' + error.message);
    }
  };

  const subscribeUser = async () => {
    try {
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
    } catch (error) {
      console.error('Subscription error:', error);
      throw error;
    }
  };

  const getSubscription = async () => {
    const registration = await navigator.serviceWorker.ready;
    const existingSubscription = await registration.pushManager.getSubscription();
    setSubscription(existingSubscription);
  };

  const sendNotification = async (e) => {
    e.preventDefault();
    if (!title || !body) {
      alert('Please enter both title and message');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/notifications/notify`, { title, body });
      setTitle('');
      setBody('');
      fetchNotificationHistory();
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Notification Permission Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <Bell className="mr-2" />
            Notification Settings
          </h2>
          {!subscription ? (
            <button
              onClick={askPermission}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Bell className="mr-2 h-5 w-5" />
              Enable Notifications
            </button>
          ) : (
            <div className="flex items-center text-green-600">
              <Bell className="mr-2 h-5 w-5" />
              Notifications Enabled
            </div>
          )}
        </div>
      </div>

      {/* Send Notification Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Send Notification</h2>
        <form onSubmit={sendNotification} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Sending...' : 'Send Notification'}
          </button>
        </form>
      </div>

      {/* Notification History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Notification History</h2>
        <div className="space-y-4">
          {notificationHistory.map((notification, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-lg">{notification.title}</h3>
              <p className="text-gray-600 mt-1">{notification.body}</p>
              <p className="text-sm text-gray-500 mt-2">
                Sent at: {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
          {notificationHistory.length === 0 && (
            <p className="text-center text-gray-500">No notifications sent yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;