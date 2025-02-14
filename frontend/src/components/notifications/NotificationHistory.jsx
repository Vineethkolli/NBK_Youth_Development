import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Linkify from 'react-linkify';
import { API_URL } from '../../utils/config';
import { useAuth } from '../../context/AuthContext';

const NotificationHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    if (!user?.registerId) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/notifications/history`, {
        params: { registerId: user.registerId },
      });
      setHistory(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch notification history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  if (!user) {
    return <div>Please log in to see your notification history.</div>;
  }

  // Custom link component to render links as "Open Link" buttons
  const linkDecorator = (href, text, key) => (
    <button
      key={key}
      onClick={() => window.open(href, '_blank')}
      style={{
        color: 'white',
        backgroundColor: '#1D4ED8', // Tailwind CSS 'indigo-700' color
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        textDecoration: 'none',
      }}
    >
      Open Link
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-4">
      <h2 className="text-lg font-semibold mb-4">Notification History</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : history.length === 0 ? (
        <div>No notifications found.</div>
      ) : (
        <div className="space-y-4">
          {history.map((notif) => (
            <div
              key={notif._id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-medium text-lg">{notif.title}</h4>
              <p className="text-gray-600 mt-1">
                <Linkify componentDecorator={linkDecorator}>
                  {notif.body}
                </Linkify>
              </p>
              <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
                <span>{new Date(notif.createdAt).toLocaleString()}</span>
                <span className="text-indigo-600">Sent by: {notif.sentBy}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationHistory;
