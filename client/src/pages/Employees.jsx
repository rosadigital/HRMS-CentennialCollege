import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';

const Employees = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
        <p className="text-gray-600">Manage your organization's employees</p>
      </div>
      
      <div className="card">
        <p>Employee management interface coming soon...</p>
      </div>
    </DashboardLayout>
  );
};

export default Employees; 