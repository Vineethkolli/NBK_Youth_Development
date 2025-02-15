import React from 'react';
import { AlertTriangle, Wrench, Settings, RefreshCcw } from 'lucide-react';

function MaintenancePage() {
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

      </div>
    </div>
  );
}

export default MaintenancePage;
