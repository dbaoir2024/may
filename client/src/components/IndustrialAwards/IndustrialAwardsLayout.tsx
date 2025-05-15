import React from 'react';
import { Outlet } from 'react-router-dom';

const IndustrialAwardsLayout: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Industrial Awards Registry</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and view all registered industrial awards
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default IndustrialAwardsLayout;