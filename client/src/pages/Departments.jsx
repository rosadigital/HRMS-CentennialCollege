import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Search, Filter, ChevronDown, Eye, Edit, Trash2, Grid, Download, List, Plus, X } from 'lucide-react';
import { employeeService, departmentService, hrLocation } from '../services/api';
import AddDepartmentModal from '../components/department/AddDepartmentModal';
import ViewDepartmentModal from '../components/department/ViewDepartmentModal';
import EditDepartmentModal from '../components/department/EditDepartmentModal';
import DeleteDepartmentModal from '../components/department/DeleteDepartmentModal';


const Departments = () => {
  // const [currentPage, setCurrentPage] = useState(1);

  // // Mock data for departments
  // const departments = [
  //   {
  //     id: 1,
  //     name: 'Engineering',
  //     subDepartment: 'Software Development',
  //     manager: {
  //       name: 'Sarah Johnson',
  //       avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  //     },
  //     location: 'New York',
  //     employees: 45,
  //     status: 'Active'
  //   },
  //   {
  //     id: 2,
  //     name: 'Marketing',
  //     subDepartment: 'Digital Marketing',
  //     manager: {
  //       name: 'Michael Chen',
  //       avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  //     },
  //     location: 'London',
  //     employees: 28,
  //     status: 'Active'
  //   }
  // ];

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
        }
        

        // Departments
        if (deptResponse.data.success) {
          console.log(deptResponse.data.departments);
          setDepartments(deptResponse.data.departments || []);
          setTotalCount(deptResponse.data.departments?.length || 0);
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
        setError('Failed to load departments. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle search and filtering
  const filteredDepartments = departments.filter(department => {
    const matchesSearch = searchTerm 
      ? `${department.department_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
            
    return matchesSearch;
  });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDepartments = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  
  // Modal handlers
  const handleAddDepartment = (newDepartment) => {
    setDepartments([newDepartment, ...departments]);
    setTotalCount(prevCount => prevCount + 1);
    setSuccessMessage('Department added successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const handleViewDepartment = (department) => {
    setSelectedDepartment(department);
    setViewModalOpen(true);
  };
  
  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setEditModalOpen(true);
  };
  
  const handleDeleteDepartment = (department) => {
    setSelectedDepartment(department);
    setDeleteModalOpen(true);
  };
  
  const handleUpdateSuccess = (updatedDepartment) => {
    setDepartments(departments.map(dep => 
      dep.id === updatedDepartment.department_id ? updatedDepartment : dep
    ));
    setSuccessMessage('Department updated successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const handleDeleteSuccess = (deletedDepartmentId) => {
    setDepartments(departments.filter(dep => dep.department_id !== deletedDepartmentId));
    setTotalCount(prevCount => prevCount - 1);
    setSuccessMessage('Department deleted successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };


  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Department Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          onClick={() => setAddModalOpen(true)}
        >
          <Plus size={18} />
          <span>Add Department</span>
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
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          
          {/* <div className="flex flex-col md:flex-row gap-3">
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
          </div> */}
        </div>
      </div>
      
      {/* Departments List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-medium">All Department  ({totalCount})</h2>
          <div className="flex gap-2">
            {/* <button className="p-1 text-gray-400 hover:text-gray-600">
              <Filter size={20} />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Download size={20} />
            </button> */}
            {/* <button 
              className={`p-1 ${viewMode === 'grid' ? 'text-green-500 bg-green-50' : 'text-gray-400'} rounded`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={20} />
            </button> */}
            {/* <button 
              className={`p-1 ${viewMode === 'list' ? 'text-green-500 bg-green-50' : 'text-gray-400'} rounded`}
              onClick={() => setViewMode('list')}
            >
              <List size={20} />
            </button> */}
          </div>
        </div>
        
        {/* {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No departments found matching your criteria.</p>
          </div>
        ) : (
          <> */}



        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-sm font-medium text-gray-500">
        <div className="col-span-4">DEPARTMENT</div>
          <div className="col-span-3">MANAGER</div>
          <div className="col-span-2">LOCATION</div>
          {/* <div className="col-span-1">EMPLOYEES</div> */}
          <div className="col-span-1">STATUS</div>
          {/* <div className="col-span-2 text-right">ACTIONS</div> */}
        </div>
        
            {/* Table Content */}
            {currentDepartments.map((department) => (
              <div key={department.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
                    {department.image_url ? (
                      <img src={department.image_url} alt={department.department_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-green-600 font-semibold">
                        {department.department_name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{department.department_name}</p>
                    {/* <p className="text-sm text-gray-500">{department.email || 'Not Assigned'}</p> */}
                  </div>
                </div>

                <div className="col-span-3">
                  <p>{department.manager_first_name || 'Not Assigned'}</p>
                  <p className="text-sm text-gray-500">{department.manager_id || 'Manager Not Assigned'}</p>
                </div>

                <div className="col-span-3">
                  <p>{department.location_city || 'Not Assigned'}</p>
                  <p className="text-sm text-gray-500">{department.location_country || 'Manager Not Assigned'}</p>
                </div>


                <div className="col-span-1">
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                    Active
                  </span>
                </div>

                <div className="col-span-2 flex justify-end gap-2">
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => handleViewDepartment(department)}
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => handleEditDepartment(department)}
                    title="Edit Department"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => handleDeleteDepartment(department)}
                    title="Delete Department"
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
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredDepartments.length)} of {filteredDepartments.length} entries
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
      </div>
      <AddDepartmentModal 
        isOpen={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        onSuccess={handleAddDepartment}
        departments={departments}
      />
      
      <ViewDepartmentModal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        departmentId={selectedDepartment?.department_id} 
        onEdit={(department) => {
          setViewModalOpen(false);
          handleEditDepartment(department);
        }} 
      />
      
      <EditDepartmentModal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        department={selectedDepartment} 
        onSuccess={handleUpdateSuccess} 
      />
      
      <DeleteDepartmentModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        department={selectedDepartment} 
        onSuccess={handleDeleteSuccess} 
      />



    </DashboardLayout>
  );
};

export default Departments; 

//  Add department
// Manager location employyes data

// {departments.map((department) => (
//   <div key={department.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center">
//     <div className="col-span-3">
//       <div className="flex items-center gap-3">
//         <div className="w-8 h-8 bg-green-100 text-green-600 rounded flex items-center justify-center">
//           {department.name === 'Engineering' ? (
//             <span className="material-icons text-sm">🖥️</span>
//           ) : (
//             <span className="material-icons text-sm">📊</span>
//           )}
//         </div>
//         <div>
//           <p className="font-medium">{department.name}</p>
//           <p className="text-sm text-gray-500">{department.subDepartment}</p>
//         </div>
//       </div>
//     </div>
//     <div className="col-span-3">
//       <div className="flex items-center gap-3">
//         <img src={department.manager.avatar} alt={department.manager.name} className="w-8 h-8 rounded-full" />
//         <span>{department.manager.name}</span>
//       </div>
//     </div>
//     <div className="col-span-2">{department.location}</div>
//     <div className="col-span-1">{department.employees}</div>
//     <div className="col-span-1">
//       <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
//         {department.status}
//       </span>
//     </div>
//     <div className="col-span-2 flex justify-end gap-2">
//       <button className="text-gray-400 hover:text-gray-600">
//         <Eye size={18} />
//       </button>
//       <button className="text-gray-400 hover:text-gray-600">
//         <Edit size={18} />
//       </button>
//       <button className="text-gray-400 hover:text-gray-600">
//         <Trash2 size={18} />
//       </button>
//     </div>
//   </div>
// ))}