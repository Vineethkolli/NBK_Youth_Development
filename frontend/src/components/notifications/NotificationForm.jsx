import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/config';

function NotificationForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const sendNotification = async (e) => {
    e.preventDefault();

    if (title && body) {
      const payload = { title, body };
      await axios.post(`${API_URL}/api/notifications/notify`, payload);
      alert('Notification sent!');
      setTitle('');
      setBody('');
    } else {
      alert('Please enter a title and message');
    }
  };

  return (
    <form onSubmit={sendNotification}>
      <h2>Send a Push Notification</h2>
      <div>
        <label>Title:</label><br />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <br />
      <div>
        <label>Message:</label><br />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        ></textarea>
      </div>
      <br />
      <button type="submit">Send Notification</button>
    </form>
  );
}

export default NotificationForm;
