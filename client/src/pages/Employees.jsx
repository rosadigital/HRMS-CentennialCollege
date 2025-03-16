import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Search, Filter, ChevronDown, Eye, Edit, Trash2, Grid, List, Plus, X } from 'lucide-react';
import { employeeService, departmentService, hrLocation } from '../services/api';
import AddEmployeeModal from '../components/employees/AddEmployeeModal';
import ViewEmployeeModal from '../components/employees/ViewEmployeeModal';
import EditEmployeeModal from '../components/employees/EditEmployeeModal';
import DeleteEmployeeModal from '../components/employees/DeleteEmployeeModal';

const Employees = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  
  // State for modal management
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  // Pagination state
  const itemsPerPage = 10;
  const [totalCount, setTotalCount] = useState(0);
  
  // Fetch employees and departments on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [empResponse, deptResponse, locResponse] = await Promise.all([
          employeeService.getAll(),
          departmentService.getAll(),
          hrLocation.getAll(),
        ]);



        if (empResponse.data.success) {
          setEmployees(empResponse.data.employees || []);
          setTotalCount(empResponse.data.employees?.length || 0);
        }
        

        // Departments
        if (deptResponse.data.success) {
          setDepartments(deptResponse.data.departments || []);
        } else {
          setDepartments([]);
        }


        if (locResponse.data.success) {
          setLocations(locResponse.data.locations || []);
        } else {
          setLocations([]);
        }


      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load employees. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle search and filtering
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm 
      ? `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
      
    const matchesDepartment = selectedDepartment 
      ? employee.department_id.toString() === selectedDepartment 
      : true;
      
    const matchesLocation = selectedLocation
      ? employee.location === selectedLocation
      : true;
      
    return matchesSearch && matchesDepartment && matchesLocation;
  });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  
  // Modal handlers
  const handleAddEmployee = (newEmployee) => {
    setEmployees([newEmployee, ...employees]);
    setTotalCount(prevCount => prevCount + 1);
    setSuccessMessage('Employee added successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setViewModalOpen(true);
  };
  
  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  };
  
  const handleDeleteEmployee = (employee) => {
    setSelectedEmployee(employee);
    setDeleteModalOpen(true);
  };
  
  const handleUpdateSuccess = (updatedEmployee) => {
    setEmployees(employees.map(emp => 
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    ));
    setSuccessMessage('Employee updated successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const handleDeleteSuccess = (deletedEmployeeId) => {
    setEmployees(employees.filter(emp => emp.id !== deletedEmployeeId));
    setTotalCount(prevCount => prevCount - 1);
    setSuccessMessage('Employee deleted successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          onClick={() => setAddModalOpen(true)}
        >
          <Plus size={18} />
          <span>Add Employee</span>
        </button>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 flex justify-between items-center">
          <p>{successMessage}</p>
          <button 
            className="text-green-500"
            onClick={() => setSuccessMessage('')}
          >
            <X size={18} />
          </button>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex justify-between items-center">
          <p>{error}</p>
          <button 
            className="text-red-500"
            onClick={() => setError(null)}
          >
            <X size={18} />
          </button>
        </div>
      )}
      
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <select 
                className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-md w-full md:w-auto"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.department_id} value={dept.department_id}>{dept.department_name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <select 
                className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-md w-full md:w-auto"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map(loc => (
                  <option key={loc.location_id} value={loc.location_id}>{loc.country_name}, {loc.city}</option>
                ))}

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
          <h2 className="font-medium">All Employees ({totalCount})</h2>
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
        
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No employees found matching your criteria.</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-sm font-medium text-gray-500">
              <div className="col-span-4">EMPLOYEE</div>
              <div className="col-span-3">DEPARTMENT</div>
              <div className="col-span-2">LOCATION</div>
              <div className="col-span-1">STATUS</div>
              <div className="col-span-2 text-right">ACTIONS</div>
            </div>
            
            {/* Table Content */}
            {currentEmployees.map((employee) => (
              <div key={employee.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
                    {employee.image_url ? (
                      <img src={employee.image_url} alt={employee.first_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-green-600 font-semibold">
                        {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{employee.first_name} {employee.last_name}</p>
                    <p className="text-sm text-gray-500">{employee.email}</p>
                  </div>
                </div>
                <div className="col-span-3">
                  <p>{employee.department_name || 'Not Assigned'}</p>
                  <p className="text-sm text-gray-500">{employee.job_title || 'Not Assigned'}</p>
                </div>
                <div className="col-span-2">{employee.location || 'Not Specified'}</div>
                <div className="col-span-1">
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                    Active
                  </span>
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => handleViewEmployee(employee)}
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => handleEditEmployee(employee)}
                    title="Edit Employee"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => handleDeleteEmployee(employee)}
                    title="Delete Employee"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 text-sm">
                <p className="text-gray-500">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEmployees.length)} of {filteredEmployees.length} entries
                </p>
                <div className="flex gap-2">
                  <button 
                    className={`px-3 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages).keys()].map(number => (
                    <button
                      key={number + 1}
                      className={`px-3 py-1 rounded-md ${currentPage === number + 1 ? 'bg-green-500 text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                      onClick={() => setCurrentPage(number + 1)}
                    >
                      {number + 1}
                    </button>
                  ))}
                  
                  <button 
                    className={`px-3 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Modals */}
      <AddEmployeeModal 
        isOpen={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        onSuccess={handleAddEmployee}
        departments={departments}
      />
      
      <ViewEmployeeModal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        employeeId={selectedEmployee?.id} 
        onEdit={(employee) => {
          setViewModalOpen(false);
          handleEditEmployee(employee);
        }} 
      />
      
      <EditEmployeeModal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        employee={selectedEmployee} 
        onSuccess={handleUpdateSuccess} 
      />
      
      <DeleteEmployeeModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        employee={selectedEmployee} 
        onSuccess={handleDeleteSuccess} 
      />
    </DashboardLayout>
  );
};

export default Employees; 