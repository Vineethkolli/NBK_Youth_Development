import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Wrench, Settings } from 'lucide-react';
import { API_URL } from '../../utils/config';

function MaintenanceMode() {
  const [maintenanceData, setMaintenanceData] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/maintenance/status`);
        setMaintenanceData(data);
      } catch (error) {
        console.error('Failed to fetch maintenance status:', error);
      }
    };

    fetchStatus();
  }, []);

  // Convert IST time (provided without timezone) to a Date object in local time.
  const convertISTtoLocal = (dateStr) => {
    // Check if dateStr already has a timezone offset.
    if (!/[\+\-]\d{2}:?\d{2}$/.test(dateStr)) {
      // Append the IST offset ("GMT+0530") if missing.
      dateStr += ' GMT+0530';
    }
    return new Date(dateStr);
  };

  // Format the date & time based on the user's local settings with AM/PM.
  const formatDateTime = (dateStr) => {
    const date = convertISTtoLocal(dateStr);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString(undefined, options);
  };

  const expectedBackMessage =
    maintenanceData && maintenanceData.expectedBackAt ? (
      <p className="text-black mt-8">
        Services are live in {formatDateTime(maintenanceData.expectedBackAt)}.
      </p>
    ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-2xl p-8 text-center transform transition-all duration-500 hover:scale-105">
        <div className="relative flex justify-center mb-6">
          <Settings className="h-24 w-24 text-yellow-500 animate-pulse" />
          <Wrench className="h-16 w-16 text-blue-500 absolute -bottom-4 -right-4 transform rotate-45 animate-bounce" />
          <AlertTriangle
            className="h-12 w-12 text-red-500 absolute -top-4 -left-4 transform -rotate-12 animate-spin"
            style={{ animationDuration: '3s' }}
          />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Scheduled Maintenance
        </h1>

        <p className="text-gray-700 mb-6">
          We're performing scheduled maintenance to enhance our services.
          Our system will be back online shortly. We appreciate your patience and understanding.
        </p>

        {expectedBackMessage}
      </div>
    </div>
  );
}

export default MaintenanceMode;
