// NotificationForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '../../utils/config';

function NotificationForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [target, setTarget] = useState('All'); // Default: Send to all users
  const [registerId, setRegisterId] = useState(''); // Only for "Specific User"
  const [addLink, setAddLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const sendNotification = async (e) => {
    e.preventDefault();
    if (!title || !body) {
      toast.error('Please enter both title and message');
      return;
    }
  
    if (addLink && !linkUrl) {
      toast.error('Please provide a valid URL');
      return;
    }
  
    setIsLoading(true);
    try {
      // Append the link to the message if the checkbox is ticked.
      const finalBody = addLink ? `${body}\n\nOpen Link: ${linkUrl}` : body;
  
      const requestData = {
        title,
        body: finalBody,
        target,
      };
  
      if (target === 'Specific User') {
        if (!registerId) {
          toast.error('Please enter Register ID for the specific user');
          setIsLoading(false);
          return;
        }
        requestData.registerId = registerId;
      }
  
      await axios.post(`${API_URL}/api/notifications/notify`, requestData);
  
      setTitle('');
      setBody('');
      setRegisterId('');
      setAddLink(false);
      setLinkUrl('');
      toast.success(`Notification sent successfully to ${target}`);
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Send Notification</h2>
      <form onSubmit={sendNotification} className="space-y-4">
        {/* Notification Title */}
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
  
        {/* Notification Message */}
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
  
        {/* Add Link Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="addLink"
            checked={addLink}
            onChange={(e) => setAddLink(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="addLink" className="text-sm text-gray-700">Add link</label>
        </div>
  
        {/* URL Input, only shown if Add Link is checked */}
        {addLink && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Link URL</label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required={addLink}
            />
          </div>
        )}
  
        {/* Target Audience Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Send to</label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="All">All</option>
            <option value="Youth_Category">Youth</option>
            <option value="Admins_Financiers_Developers">Admins, Financiers, Developers</option>
            <option value="Specific User">Specific User</option>
          </select>
        </div>
  
        {/* Input for Register ID (Only if 'Specific User' is selected) */}
        {target === 'Specific User' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Register ID</label>
            <input
              type="text"
              placeholder="Ex: R1"
              value={registerId}
              onChange={(e) => setRegisterId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        )}
  
        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Sending...' : 'Send Notification'}
        </button>
      </form>
    </div>
  );
}

export default NotificationForm;
