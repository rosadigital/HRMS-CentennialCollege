import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { employeeService, departmentService, jobService, hrLocation } from '../../services/api';

const EditEmployeeModal = ({ isOpen, onClose, employee, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department_id: '',
    job_id: '',
    hire_date: '',
    salary: '',
    bonus: '',  // corresponds to COMMISSION_PCT in the DB
  });
  
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptResponse, jobResponse, locResponse] = await Promise.all([
          departmentService.getAll(),
          jobService.getAll(),
          hrLocation.getAll(),
        ]);
        
        // Departments
        if (deptResponse.data.success) {
          setDepartments(deptResponse.data.departments || []);
        } else {
          setDepartments([]);
        }

        // Jobs
        if (jobResponse.data.success) {
          setJobs(jobResponse.data.jobs || []);
        } else {
          setJobs([]);
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
  
  useEffect(() => {
    if (employee) {
      // Format hire_date for date input (YYYY-MM-DD)
      let formattedHireDate = '';
      if (employee.hire_date) {
        const date = new Date(employee.hire_date);
        formattedHireDate = date.toISOString().split('T')[0];
      }
      
      setFormData({
        first_name: employee.first_name,
        last_name: employee.last_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department_id: employee.department_id || '',
        job_id: employee.job_id,
        hire_date: formattedHireDate,
        salary: employee.salary ? employee.salary.toString() : '',
        commission_pct: employee.bonus || '',
      });
    }
  }, [employee]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user edits it
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
    if (!formData.hire_date) newErrors.hire_date = 'Hire date is required';
    
    if (formData.salary) {
      const salary = Number(formData.salary);
      if (isNaN(salary) || salary <= 0) {
        newErrors.salary = 'Salary must be a positive number';
      }
      
      // Check salary range for the selected department
      const selectedDept = departments.find(d => d.id === parseInt(formData.department_id));
      if (selectedDept && selectedDept.salary_range) {
        const { min, max } = selectedDept.salary_range;
        if (salary < min || salary > max) {
          newErrors.salary = `Salary must be within department range ($${min.toLocaleString()} - $${max.toLocaleString()})`;
        }
      }
    } else {
      newErrors.salary = 'Salary is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Convert values to appropriate types
      const employeeData = {
        ...formData,
        department_id: parseInt(formData.department_id),
        // job_id: parseInt(formData.job_id),
        salary: parseFloat(formData.salary),
      };
      const response = await employeeService.update(employee.employee_id, employeeData);
      
      if (response.data.success) {
        onSuccess(response.data.employee);
        onClose();
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response.data.message) {
          // Handle specific error message
          if (error.response.data.message.includes('Email')) {
            setErrors({ email: error.response.data.message });
          } else if (error.response.data.message.includes('Salary')) {
            setErrors({ salary: error.response.data.message });
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
          <h2 className="text-xl font-bold">Edit Employee Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {/* Error Alert */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
              {errors.general}
            </div>
          )}
          
          {/* Validation Errors */}
          {Object.values(errors).some(error => error) && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
              <div className="font-medium">Please fix the following errors:</div>
              <ul className="mt-2 list-disc list-inside pl-2">
                {Object.entries(errors).map(([key, value]) => (
                  key !== 'general' && value ? (
                    <li key={key} className="text-sm">{value}</li>
                  ) : null
                ))}
              </ul>
            </div>
          )}
          
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
                  {[...departments]
                    .sort((a, b) =>
                      a.department_name.toLowerCase().localeCompare(
                        b.department_name.toLowerCase()
                      )
                    )
                    .map((dept) => (
                      <option key={dept.department_id} value={dept.department_id}>
                        {dept.department_name}
                      </option>
                  ))}
                </select>
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
                  {[...jobs]
                    .sort((a, b) =>
                      a.job_title.toLowerCase().localeCompare(b.job_title.toLowerCase())
                    )
                    .map((job) => (
                      <option key={job.job_id} value={job.job_id}>
                        {job.job_title}
                      </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <select
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Location</option>
                  {[...locations]
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
              </div>


              <div>
                <label className="block text-sm font-medium mb-1">Hire Date</label>
                <input
                  type="date"
                  name="hire_date"
                  value={formData.hire_date}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.hire_date ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Salary</label>
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

              {/* Commission (Bonus) */}
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal; 