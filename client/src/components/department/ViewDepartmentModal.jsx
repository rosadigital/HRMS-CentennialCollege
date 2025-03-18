import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, MapPin, Edit } from 'lucide-react';
import { departmentService } from '../../services/api';

const ViewDepartmentModal = ({ isOpen, onClose, departmentId, onEdit }) => {
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (!departmentId) return;
      
      setLoading(true);
      try {
        const response = await departmentService.getById(departmentId);
        if (response.data.success) {
          setDepartment(response.data.department);
        } else {
          setError('Failed to load department details');
        }
      } catch (error) {
        console.error('Error fetching department:', error);
        setError('Error loading department details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && departmentId) {
      fetchDepartment();
    }
  }, [isOpen, departmentId]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Department Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-red-500 text-center">
              {error}
            </div>
          ) : department ? (
            <div>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-3">
                    {department.image_url ? (
                      <img
                      src={department.image_url} 
                      alt={`${department.first_name} ${department.last_name}`}
                      className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600 text-2xl font-bold">
                      {department.department_name.charAt(0)}
                  </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold">{department.first_name} {department.last_name}</h3>
                  <p className="text-gray-600">{department.department_name}</p>
                </div>
                
                <div className="md:w-2/3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Department Information</h3>
                    <button 
                      onClick={() => onEdit(department)}
                      className="text-green-500 flex items-center gap-1 hover:text-green-600"
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Department Name</p>
                      <p className="font-medium">{department.department_name}</p>
                    </div>
                    <div>
                      {/* <p className="text-sm text-gray-500"></p> */}
                      {/* <p className="font-medium">{department.department_name  || 'Not specified'}</p> */}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">City</p>
                      <p className="font-medium">{department.location_city || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Country</p>
                      <p className="font-medium">{department.location_country || 'Not specified'}</p>
                    </div>
                  </div>                  
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3 mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={18} />
                  <span>{department.email}</span>
                </div>
                {department.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={18} />
                    <span>{department.phone}</span>
                  </div>
                )}
                {department.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} />
                    <span>{department.location}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No department data found
            </div>
          )}
        </div>

        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDepartmentModal; 