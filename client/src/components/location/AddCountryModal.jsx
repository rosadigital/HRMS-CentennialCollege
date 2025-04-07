import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const AddCountryModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    country_id: '',
    country_name: '',
    region_id: ''
  });

  const [errors, setErrors] = useState({});
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/regions`);
        
        if (response.data.success) {
          setRegions(response.data.regions || []);
        }
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };
    
    if (isOpen) {
      fetchRegions();
    }
  }, [isOpen]);

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
    
    if (!formData.country_id) newErrors.country_id = 'Country ID is required (2 letter code)';
    else if (formData.country_id.length !== 2) newErrors.country_id = 'Country ID must be a 2 letter code';
    
    if (!formData.country_name) newErrors.country_name = 'Country name is required';
    if (!formData.region_id) newErrors.region_id = 'Region is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/countries`,
        formData
      );

      if (response.data.success) {
        onSuccess(response.data.country);
        onClose();
  
        // Reset form
        setFormData({
          country_id: '',
          country_name: '',
          region_id: ''
        });
      }
    } catch (error) {
      console.error('Error creating country:', error);
  
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
          <h2 className="text-xl font-bold">Add New Country</h2>
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

          {/* Country Information */}
          <div className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Country ID (2-letter code)*</label>
              <input
                type="text"
                name="country_id"
                value={formData.country_id}
                onChange={handleChange}
                maxLength={2}
                placeholder="e.g. US, CA, BR"
                className={`w-full p-2 border rounded ${
                  errors.country_id ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.country_id && (
                <p className="text-red-500 text-xs mt-1">{errors.country_id}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Country Name*</label>
              <input
                type="text"
                name="country_name"
                value={formData.country_name}
                onChange={handleChange}
                placeholder="e.g. United States, Canada, Brazil"
                className={`w-full p-2 border rounded ${
                  errors.country_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.country_name && (
                <p className="text-red-500 text-xs mt-1">{errors.country_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Region*</label>
              <select
                name="region_id"
                value={formData.region_id}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  errors.region_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Region</option>
                {regions
                  .sort((a, b) => a.region_name.localeCompare(b.region_name))
                  .map((region) => (
                    <option key={region.region_id} value={region.region_id}>
                      {region.region_name}
                    </option>
                  ))}
              </select>
              {errors.region_id && (
                <p className="text-red-500 text-xs mt-1">{errors.region_id}</p>
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
              {loading ? 'Adding...' : 'Add Country'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCountryModal; 