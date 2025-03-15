import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Search, Filter, ChevronDown, Eye, Edit, Trash2, Grid, List, Plus } from 'lucide-react';

const Employees = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for employees
  const employees = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      department: 'Engineering',
      position: 'Senior Developer',
      location: 'New York',
      status: 'Active',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    }
    // More employees would be fetched from API in a real app
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
          <Plus size={18} />
          <span>Add Employee</span>
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
              placeholder="Search employees..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <select className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-md w-full md:w-auto">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Marketing</option>
                <option>Human Resources</option>
                <option>Finance</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <select className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-md w-full md:w-auto">
                <option>All Locations</option>
                <option>New York</option>
                <option>San Francisco</option>
                <option>London</option>
                <option>Toronto</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md">
              <Filter size={16} />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Employees List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-medium">All Employees (2,451)</h2>
          <div className="flex gap-2">
            <button 
              className={`p-1 ${viewMode === 'grid' ? 'text-green-500 bg-green-50' : 'text-gray-400'} rounded`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={20} />
            </button>
            <button 
              className={`p-1 ${viewMode === 'list' ? 'text-green-500 bg-green-50' : 'text-gray-400'} rounded`}
              onClick={() => setViewMode('list')}
            >
              <List size={20} />
            </button>
          </div>
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-sm font-medium text-gray-500">
          <div className="col-span-4">EMPLOYEE</div>
          <div className="col-span-3">DEPARTMENT</div>
          <div className="col-span-2">LOCATION</div>
          <div className="col-span-1">STATUS</div>
          <div className="col-span-2 text-right">ACTIONS</div>
        </div>
        
        {/* Table Content */}
        {employees.map((employee) => (
          <div key={employee.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center">
            <div className="col-span-4 flex items-center gap-3">
              <img src={employee.avatar} alt={employee.name} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-medium">{employee.name}</p>
                <p className="text-sm text-gray-500">{employee.email}</p>
              </div>
            </div>
            <div className="col-span-3">
              <p>{employee.department}</p>
              <p className="text-sm text-gray-500">{employee.position}</p>
            </div>
            <div className="col-span-2">{employee.location}</div>
            <div className="col-span-1">
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                {employee.status}
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
          <p className="text-gray-500">Showing 1 to 10 of 2,451 entries</p>
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

export default Employees; 