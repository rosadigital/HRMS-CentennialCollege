import React, { useState } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { employeeService } from '../../services/api';

const DeleteEmployeeModal = ({ isOpen, onClose, employee, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleDelete = async () => {
    if (!employee) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await employeeService.delete(employee.employee_id);
      
      if (response.data.success) {
        onSuccess(employee.employee_id);
        onClose();
      } else {
        setError('Failed to delete employee. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while trying to delete the employee. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen || !employee) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2 text-red-500">
            <Trash2 size={20} />
            <h2 className="text-xl font-bold">Delete Employee</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
              {employee.image_url ? (
                <img 
                  src={employee.image_url} 
                  alt={`${employee.first_name} ${employee.last_name}`}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600 text-xl font-bold">
                  {employee.first_name?.[0]}{employee.last_name?.[0]}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{employee.first_name} {employee.last_name}</h3>
              <p className="text-gray-600">{employee.job_title} - {employee.department_name}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-gray-700">
              Are you sure you want to delete this employee? This action cannot be undone and will permanently remove the employee from the system.
            </p>
            
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md flex items-start gap-2">
              <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                Deleting this employee will also remove their access to all company systems and resources.
              </p>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1"
          >
            {loading ? 'Deleting...' : 'Delete Employee'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEmployeeModal; 