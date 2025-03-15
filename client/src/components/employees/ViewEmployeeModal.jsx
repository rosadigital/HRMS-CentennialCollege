import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, MapPin, Edit } from 'lucide-react';
import { employeeService } from '../../services/api';

const ViewEmployeeModal = ({ isOpen, onClose, employeeId, onEdit }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!employeeId) return;
      
      setLoading(true);
      try {
        const response = await employeeService.getById(employeeId);
        if (response.data.success) {
          setEmployee(response.data.employee);
        } else {
          setError('Failed to load employee details');
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
        setError('Error loading employee details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && employeeId) {
      fetchEmployee();
    }
  }, [isOpen, employeeId]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Employee Details</h2>
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
          ) : employee ? (
            <div>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-3">
                    {employee.image_url ? (
                      <img src={employee.image_url} alt={`${employee.first_name} ${employee.last_name}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600 text-2xl font-bold">
                        {employee.first_name[0]}{employee.last_name[0]}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold">{employee.first_name} {employee.last_name}</h3>
                  <p className="text-gray-600">{employee.job_title}</p>
                </div>
                
                <div className="md:w-2/3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Personal Information</h3>
                    <button 
                      onClick={() => onEdit(employee)}
                      className="text-green-500 flex items-center gap-1 hover:text-green-600"
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Employee ID</p>
                      <p className="font-medium">{employee.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">{employee.date_of_birth || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium">{employee.gender || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Marital Status</p>
                      <p className="font-medium">{employee.marital_status || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-4">Employment Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium">{employee.department_name || 'Not assigned'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Job Title</p>
                      <p className="font-medium">{employee.job_title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Join Date</p>
                      <p className="font-medium">{new Date(employee.hire_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Employment Status</p>
                      <p className="font-medium">Full Time</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3 mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={18} />
                  <span>{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={18} />
                    <span>{employee.phone}</span>
                  </div>
                )}
                {employee.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} />
                    <span>{employee.location}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No employee data found
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

export default ViewEmployeeModal; 