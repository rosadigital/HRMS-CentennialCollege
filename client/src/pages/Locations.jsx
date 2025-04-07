import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Search, Filter, ChevronDown, Eye, Edit, Trash2, Grid, Download, List, Plus, X } from 'lucide-react';
import { hrLocation, departmentService } from '../services/api';
import AddLocationModal from '../components/location/AddLocationModal';
import ViewLocationModal from '../components/location/ViewLocationModal';
import EditLocationModal from '../components/location/EditLocationModal';
import DeleteLocationModal from '../components/location/DeleteLocationModal';

const Locations = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  
  // State for modal management
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Pagination state
  const itemsPerPage = 10;
  const [totalCount, setTotalCount] = useState(0);
  
  // Fetch locations on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [locResponse, deptResponse] = await Promise.all([
          hrLocation.getAll(),
          departmentService.getAll(),
        ]);

        // Locations
        if (locResponse.data.success) {
          setLocations(locResponse.data.locations || []);
          setTotalCount(locResponse.data.locations?.length || 0);
        } else {
          setLocations([]);
        }

        // Departments (for reference)
        if (deptResponse.data.success) {
          setDepartments(deptResponse.data.departments || []);
        } else {
          setDepartments([]);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load locations. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle search and filtering
  const filteredLocations = locations.filter(location => {
    const matchesSearch = searchTerm 
      ? `${location.city} ${location.country_name} ${location.street_address} ${location.state_province}`.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
            
    return matchesSearch;
  });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLocations = filteredLocations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  
  // Modal handlers
  const handleAddLocation = (newLocation) => {
    setLocations([newLocation, ...locations]);
    setTotalCount(prevCount => prevCount + 1);
    setSuccessMessage('Location added successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const handleViewLocation = (location) => {
    setSelectedLocation(location);
    setViewModalOpen(true);
  };
  
  const handleEditLocation = (location) => {
    setSelectedLocation(location);
    setEditModalOpen(true);
  };
  
  const handleDeleteLocation = (location) => {
    setSelectedLocation(location);
    setDeleteModalOpen(true);
  };
  
  const handleUpdateSuccess = (updatedLocation) => {
    setLocations(locations.map(loc => 
      loc.location_id === updatedLocation.location_id ? updatedLocation : loc
    ));
    setSuccessMessage('Location updated successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const handleDeleteSuccess = (deletedLocationId) => {
    setLocations(locations.filter(loc => loc.location_id !== deletedLocationId));
    setTotalCount(prevCount => prevCount - 1);
    setSuccessMessage('Location deleted successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Location Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          onClick={() => setAddModalOpen(true)}
        >
          <Plus size={18} />
          <span>Add Location</span>
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
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
        </div>
      </div>
      
      {/* Locations List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-medium">All Locations ({totalCount})</h2>
          <div className="flex gap-2">
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-sm font-medium text-gray-500">
          <div className="col-span-3">CITY & STATE</div>
          <div className="col-span-3">ADDRESS</div>
          <div className="col-span-2">COUNTRY</div>
          <div className="col-span-2">POSTAL CODE</div>
          <div className="col-span-2 text-right">ACTIONS</div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
          </div>
        ) : filteredLocations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No locations found matching your criteria.</p>
          </div>
        ) : (
          <>
            {/* Table Content */}
            {currentLocations.map((location) => (
              <div key={location.location_id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center">
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-semibold">
                      {location.city ? location.city.charAt(0) : 'L'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{location.city || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{location.state_province || 'N/A'}</p>
                  </div>
                </div>

                <div className="col-span-3">
                  <p>{location.street_address || 'N/A'}</p>
                </div>

                <div className="col-span-2">
                  <p>{location.country_name || 'N/A'}</p>
                </div>

                <div className="col-span-2">
                  <p>{location.postal_code || 'N/A'}</p>
                </div>

                <div className="col-span-2 flex justify-end gap-2">
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => handleViewLocation(location)}
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => handleEditLocation(location)}
                    title="Edit Location"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => handleDeleteLocation(location)}
                    title="Delete Location"
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
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLocations.length)} of {filteredLocations.length} entries
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
      <AddLocationModal 
        isOpen={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        onSuccess={handleAddLocation}
      />
      
      <ViewLocationModal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        locationId={selectedLocation?.location_id} 
        onEdit={(location) => {
          setViewModalOpen(false);
          handleEditLocation(location);
        }} 
      />
      
      <EditLocationModal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        location={selectedLocation} 
        onSuccess={handleUpdateSuccess} 
      />
      
      <DeleteLocationModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        location={selectedLocation} 
        onSuccess={handleDeleteSuccess} 
      />
    </DashboardLayout>
  );
};

export default Locations; 