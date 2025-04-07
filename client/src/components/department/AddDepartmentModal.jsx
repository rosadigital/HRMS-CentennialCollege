import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { employeeService, departmentService, hrLocation } from '../../services/api';

const AddDepartmentModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    department_title: '',
    manager_id: '',
    location_id: '',
  });

  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empResponse, deptResponse, locResponse] = await Promise.all([
          employeeService.getAll(),
          departmentService.getAll(),
          hrLocation.getAll(),
        ]);

        if (empResponse.data.success) {
          setEmployees(empResponse.data.employees || []);
        } else {
          setEmployees([]);
        }

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
      }
    };
    
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.department_title) newErrors.department_title = 'Department title is required';
    if (!formData.manager_id) newErrors.manager_id = 'Manager is required';
    if (!formData.location_id) newErrors.location_id = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    try {
        const maxDepartmentId = departments.reduce((max, dept) => {
          return dept.department_id > max ? dept.department_id : max;
        }, 0);
        const newDepartmentId = maxDepartmentId + 10;

      const departmentData = {
        department_name: formData.department_title,
        department_id: newDepartmentId,
        manager_id: formData.manager_id ? parseInt(formData.manager_id, 10) : null,
        location_id: formData.location_id ? parseInt(formData.location_id, 10) : null,
      };

      const response = await departmentService.create(departmentData);

      if (response.data.success) {
        onSuccess(response.data.department);
        onClose();
  
        setFormData({
          department_title: '',
          manager_id: '',
          location_id: '',
        });
      }
    } catch (error) {
      console.error('Error creating department:', error);
  
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response.data.message) {
          setErrors({ general: error.response.data.message });
        }
      } else {
        setErrors({ general: 'An error occurred. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Add New Department</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {/* General Error Message */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
              {errors.general}
            </div>
          )}

          {/* Department Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Department Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Department Name</label>
                <input
                  type="text"
                  name="department_title"
                  value={formData.department_title}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${
                    errors.department_title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.department_title && (
                  <p className="text-red-500 text-xs mt-1">{errors.department_title}</p>
                )}
              </div>
            </div>
          </div>

          {/* Department Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Department Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Manager */}
              <div>
                <label className="block text-sm font-medium mb-1">Manager</label>
                <select
                  name="manager_id"
                  value={formData.manager_id}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${
                    errors.manager_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Manager</option>
                  {employees
                    // .sort((a, b) =>
                    //   `${a.first_name} ${a.last_name}`.toLowerCase().localeCompare(
                    //     `${b.first_name} ${b.last_name}`.toLowerCase()
                    //   )
                    // )
                    .map((emp) => (
                      <option key={emp.employee_id} value={emp.employee_id}>
                        {emp.first_name} {emp.last_name}
                      </option>
                    ))}
                </select>
                {errors.manager_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.manager_id}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <select
                  name="location_id"
                  value={formData.location_id}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Location</option>
                  {locations
                    .sort((a, b) => {
                      const aStr = `${a.country_name}, ${a.city}`.toLowerCase();
                      const bStr = `${b.country_name}, ${b.city}`.toLowerCase();
                      return aStr.localeCompare(bStr);
                    })
                    .map((loc) => (
                      <option key={loc.location_id} value={loc.location_id}>
                        {loc.country_name}, {loc.city}
                      </option>
                    ))}
                </select>
                {errors.location_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.location_id}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
            >
              {loading ? 'Adding...' : 'Add Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartmentModal;
