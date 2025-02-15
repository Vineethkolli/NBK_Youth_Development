import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, AlertTriangle, Settings, Laptop2Icon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '../utils/config';
import PaymentDetails from '../components/developer/PaymentDetails';

function DeveloperOptions() {
  const { user } = useAuth();
  const [confirmAction, setConfirmAction] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  // state for expected back date/time (in ISO format)
  const [expectedBackAt, setExpectedBackAt] = useState('');

  useEffect(() => {
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/maintenance/status`);
      setMaintenanceMode(data.isEnabled);
      if (data.expectedBackAt) {
        const date = new Date(data.expectedBackAt);
        // Convert the UTC date to local time by subtracting the timezone offset
        const tzOffset = date.getTimezoneOffset() * 60000;
        const localISOTime = new Date(date.getTime() - tzOffset)
          .toISOString()
          .slice(0, 16);
        setExpectedBackAt(localISOTime);
      }
    } catch (error) {
      console.error('Failed to fetch maintenance status:', error);
    }
  };

  const toggleMaintenanceMode = async () => {
    try {
      // When enabling, send the expectedBackAt value. When disabling, clear it.
      await axios.post(`${API_URL}/api/maintenance/toggle`, {
        isEnabled: !maintenanceMode,
        expectedBackAt: !maintenanceMode ? expectedBackAt : null,
      });
      setMaintenanceMode(!maintenanceMode);
      toast.success(`Maintenance mode ${!maintenanceMode ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to toggle maintenance mode');
    }
  };

  if (user?.role !== 'developer') {
    return <div>Access denied</div>;
  }

  const handleClearData = async (type) => {
    if (confirmAction !== type) {
      setConfirmAction(type);
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/developer/clear/${type}`);
      toast.success(`${type} data cleared successfully`);
      setConfirmAction('');
    } catch (error) {
      toast.error(`Failed to clear ${type} data`);
    }
  };

  return (
    <div className="max-w-1xl mx-auto space-y-6">
      {/* Maintenance Mode Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Maintenance Mode
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 mb-2">
              When enabled, all users except the default developer will see the maintenance page.
            </p>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                maintenanceMode ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}
            >
              <Laptop2Icon className="h-4 w-4 mr-2" />
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  maintenanceMode ? 'bg-red-500' : 'bg-green-500'
                }`}
              />
              {maintenanceMode ? 'Offline' : 'Online'}
            </div>
            {/* Show datetime input when maintenance is disabled */}
            {!maintenanceMode && (
              <div className="mt-4">
                <label htmlFor="expectedBackAt" className="block text-sm font-medium text-gray-700">
                  Expected Service Return Time:
                </label>
                <input
                  id="expectedBackAt"
                  type="datetime-local"
                  value={expectedBackAt}
                  onChange={(e) => setExpectedBackAt(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
          <button
            onClick={toggleMaintenanceMode}
            className={`px-4 py-2 rounded-md ${
              maintenanceMode
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            } text-white`}
          >
            {maintenanceMode ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>

      {/* Payment Details Section */}
      <PaymentDetails />

      {/* Clear Data Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Clear Data</h2>
        <div className="space-y-4">
          {/* Clear Users */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Clear Users Data</h3>
              <p className="text-sm text-gray-500">
                Delete all user accounts except the developer account
              </p>
            </div>
            {confirmAction === 'users' ? (
              <div className="flex items-center space-x-2">
                <span className="text-red-600">Are you sure?</span>
                <button
                  onClick={() => handleClearData('users')}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmAction('')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleClearData('users')}
                className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Clear Users
              </button>
            )}
          </div>

          {/* Clear Income */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Clear Income Data</h3>
              <p className="text-sm text-gray-500">Delete all income records</p>
            </div>
            {confirmAction === 'income' ? (
              <div className="flex items-center space-x-2">
                <span className="text-red-600">Are you sure?</span>
                <button
                  onClick={() => handleClearData('income')}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmAction('')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleClearData('income')}
                className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Clear Income
              </button>
            )}
          </div>

          {/* Clear Expense */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Clear Expense Data</h3>
              <p className="text-sm text-gray-500">Delete all expense records</p>
            </div>
            {confirmAction === 'expense' ? (
              <div className="flex items-center space-x-2">
                <span className="text-red-600">Are you sure?</span>
                <button
                  onClick={() => handleClearData('expense')}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmAction('')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleClearData('expense')}
                className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Clear Expense
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 p-4 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
            <div>
              <h3 className="text-yellow-800 font-medium">Warning</h3>
              <p className="text-sm text-yellow-700">
                These actions are irreversible. Please make sure you have backed up any important data
                before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeveloperOptions;
