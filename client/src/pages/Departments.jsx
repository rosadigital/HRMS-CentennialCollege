import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Search, ChevronDown, Eye, Edit, Trash2, Plus, Download, Filter } from 'lucide-react';

const Departments = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for departments
  const departments = [
    {
      id: 1,
      name: 'Engineering',
      subDepartment: 'Software Development',
      manager: {
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      location: 'New York',
      employees: 45,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Marketing',
      subDepartment: 'Digital Marketing',
      manager: {
        name: 'Michael Chen',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      location: 'London',
      employees: 28,
      status: 'Active'
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Department Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
          <Plus size={18} />
          <span>Add Department</span>
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search departments..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <select className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-md w-full md:w-auto">
                <option>All Locations</option>
                <option>New York</option>
                <option>London</option>
                <option>San Francisco</option>
                <option>Toronto</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Departments List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-medium">Department Overview</h2>
          <div className="flex gap-2">
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Filter size={20} />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Download size={20} />
            </button>
          </div>
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-sm font-medium text-gray-500">
          <div className="col-span-3">DEPARTMENT</div>
          <div className="col-span-3">MANAGER</div>
          <div className="col-span-2">LOCATION</div>
          <div className="col-span-1">EMPLOYEES</div>
          <div className="col-span-1">STATUS</div>
          <div className="col-span-2 text-right">ACTIONS</div>
        </div>
        
        {/* Table Content */}
        {departments.map((department) => (
          <div key={department.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center">
            <div className="col-span-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded flex items-center justify-center">
                  {department.name === 'Engineering' ? (
                    <span className="material-icons text-sm">🖥️</span>
                  ) : (
                    <span className="material-icons text-sm">📊</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{department.name}</p>
                  <p className="text-sm text-gray-500">{department.subDepartment}</p>
                </div>
              </div>
            </div>
            <div className="col-span-3">
              <div className="flex items-center gap-3">
                <img src={department.manager.avatar} alt={department.manager.name} className="w-8 h-8 rounded-full" />
                <span>{department.manager.name}</span>
              </div>
            </div>
            <div className="col-span-2">{department.location}</div>
            <div className="col-span-1">{department.employees}</div>
            <div className="col-span-1">
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                {department.status}
              </span>
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <button className="text-gray-400 hover:text-gray-600">
                <Eye size={18} />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <Edit size={18} />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        
        {/* Pagination */}
        <div className="flex justify-between items-center p-4 text-sm">
          <p className="text-gray-500">Showing 1 to 10 of 24 entries</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-green-500 text-white rounded-md">
              1
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Departments; 