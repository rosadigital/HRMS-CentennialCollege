import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { employeeService, departmentService, jobService } from '../../services/api';

const AddEmployeeModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department_id: '',
    job_id: '',
    hire_date: '',
    salary: '',
    bonus: '',
  });
  
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptResponse, jobResponse] = await Promise.all([
          departmentService.getAll(),
          jobService.getAll()
        ]);
        
        setDepartments(deptResponse.data.departments || []);
        setJobs(jobResponse.data.jobs || []);
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
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.department_id) newErrors.department_id = 'Department is required';
    if (!formData.job_id) newErrors.job_id = 'Job title is required';
    if (!formData.hire_date) newErrors.hire_date = 'Start date is required';
    if (!formData.salary) {
      newErrors.salary = 'Base salary is required';
    } else if (isNaN(formData.salary) || Number(formData.salary) <= 0) {
      newErrors.salary = 'Salary must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Convert salary to number
      const employeeData = {
        ...formData,
        salary: Number(formData.salary),
        bonus: formData.bonus ? Number(formData.bonus) : null,
      };
      
      const response = await employeeService.create(employeeData);
      
      if (response.data.success) {
        onSuccess(response.data.employee);
        onClose();
        // Reset form
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          department_id: '',
          job_id: '',
          hire_date: '',
          salary: '',
          bonus: '',
        });
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      
      if (error.response && error.response.data) {
        // Handle server validation errors
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response.data.message) {
          // Handle specific error message like "Email already exists"
          if (error.response.data.message.includes('Email')) {
            setErrors({ email: error.response.data.message });
          } else {
            setErrors({ general: error.response.data.message });
          }
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
          <h2 className="text-xl font-bold">Add New Employee</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
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
          
          {/* Personal Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
          
          {/* Employment Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.department_id ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.department_id && <p className="text-red-500 text-xs mt-1">{errors.department_id}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Job Title</label>
                <select
                  name="job_id"
                  value={formData.job_id}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.job_id ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Job Title</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
                {errors.job_id && <p className="text-red-500 text-xs mt-1">{errors.job_id}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Location</option>
                  <option value="New York">New York</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="Toronto">Toronto</option>
                  <option value="London">London</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  name="hire_date"
                  value={formData.hire_date}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.hire_date ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.hire_date && <p className="text-red-500 text-xs mt-1">{errors.hire_date}</p>}
              </div>
            </div>
          </div>
          
          {/* Salary Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Salary Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Base Salary</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className={`w-full p-2 pl-8 border rounded ${errors.salary ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Bonus (%)</label>
                <input
                  type="text"
                  name="bonus"
                  value={formData.bonus}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
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
              {loading ? 'Adding...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal; 