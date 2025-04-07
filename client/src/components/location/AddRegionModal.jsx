import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const AddRegionModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    region_name: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.region_name) newErrors.region_name = 'Region name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/regions`,
        formData
      );

      if (response.data.success) {
        onSuccess(response.data.region);
        onClose();
  
        // Reset form
        setFormData({
          region_name: ''
        });
      }
    } catch (error) {
      console.error('Error creating region:', error);
  
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Add New Region</h2>
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

          {/* Region Information */}
          <div className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Region Name*</label>
              <input
                type="text"
                name="region_name"
                value={formData.region_name}
                onChange={handleChange}
                placeholder="e.g. North America, Europe, Asia"
                className={`w-full p-2 border rounded ${
                  errors.region_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.region_name && (
                <p className="text-red-500 text-xs mt-1">{errors.region_name}</p>
              )}
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
              {loading ? 'Adding...' : 'Add Region'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRegionModal; 