import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { hrLocation } from '../../services/api';
import axios from 'axios';
import AddCountryModal from './AddCountryModal';
import AddRegionModal from './AddRegionModal';

const EditLocationModal = ({ isOpen, onClose, location, onSuccess }) => {
  const [formData, setFormData] = useState({
    location_id: '',
    city: '',
    street_address: '',
    postal_code: '',
    state_province: '',
    country_id: ''
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [countriesByRegion, setCountriesByRegion] = useState({});
  
  // State for nested modals
  const [addCountryModalOpen, setAddCountryModalOpen] = useState(false);
  const [addRegionModalOpen, setAddRegionModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      // Get countries and regions
      const [countriesResponse, regionsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/countries`),
        axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/regions`)
      ]);

      if (countriesResponse.data.success) {
        const countriesData = countriesResponse.data.countries || [];
        setCountries(countriesData);
        
        // Group countries by region
        const groupedCountries = {};
        countriesData.forEach(country => {
          if (!groupedCountries[country.region_id]) {
            groupedCountries[country.region_id] = [];
          }
          groupedCountries[country.region_id].push(country);
        });
        setCountriesByRegion(groupedCountries);
        
        // If location has country_id, find its region
        if (location && location.country_id) {
          const country = countriesData.find(c => c.country_id === location.country_id);
          if (country && country.region_id) {
            setSelectedRegion(country.region_id);
          }
        }
      }

      if (regionsResponse.data.success) {
        setRegions(regionsResponse.data.regions || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, location]);
  
  // Set form data when location changes
  useEffect(() => {
    if (location) {
      setFormData({
        location_id: location.location_id || '',
        city: location.city || '',
        street_address: location.street_address || '',
        postal_code: location.postal_code || '',
        state_province: location.state_province || '',
        country_id: location.country_id || ''
      });
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegionChange = (e) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    setFormData(prev => ({ ...prev, country_id: '' })); // Reset country when region changes
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.country_id) newErrors.country_id = 'Country is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await hrLocation.update(location.location_id, formData);

      if (response.data.success) {
        onSuccess(response.data.location);
        onClose();
      }
    } catch (error) {
      console.error('Error updating location:', error);
  
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

  const handleAddCountrySuccess = (newCountry) => {
    // Update countries list
    setCountries(prev => [newCountry, ...prev]);
    
    // Update countriesByRegion
    setCountriesByRegion(prev => {
      const updated = { ...prev };
      if (!updated[newCountry.region_id]) {
        updated[newCountry.region_id] = [];
      }
      updated[newCountry.region_id] = [newCountry, ...updated[newCountry.region_id]];
      return updated;
    });
    
    // Select the new country
    setFormData(prev => ({ ...prev, country_id: newCountry.country_id }));
    setSelectedRegion(newCountry.region_id);
  };

  const handleAddRegionSuccess = (newRegion) => {
    // Update regions list
    setRegions(prev => [newRegion, ...prev]);
    
    // Select the new region
    setSelectedRegion(newRegion.region_id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Edit Location</h2>
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

          {/* Location Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Location Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City */}
              <div>
                <label className="block text-sm font-medium mb-1">City*</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              {/* State/Province */}
              <div>
                <label className="block text-sm font-medium mb-1">State/Province</label>
                <input
                  type="text"
                  name="state_province"
                  value={formData.state_province}
                  onChange={handleChange}
                  className="w-full p-2 border rounded border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Street Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  name="street_address"
                  value={formData.street_address}
                  onChange={handleChange}
                  className="w-full p-2 border rounded border-gray-300"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm font-medium mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className="w-full p-2 border rounded border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Region and Country */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Region & Country</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Region */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium">Region</label>
                  <button
                    type="button"
                    onClick={() => setAddRegionModalOpen(true)}
                    className="text-green-500 text-sm flex items-center hover:text-green-600"
                  >
                    <Plus size={16} className="mr-1" />
                    <span>Add Region</span>
                  </button>
                </div>
                <select
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  className="w-full p-2 border rounded border-gray-300"
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
              </div>

              {/* Country */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium">Country*</label>
                  <button
                    type="button"
                    onClick={() => setAddCountryModalOpen(true)}
                    className="text-green-500 text-sm flex items-center hover:text-green-600"
                  >
                    <Plus size={16} className="mr-1" />
                    <span>Add Country</span>
                  </button>
                </div>
                <select
                  name="country_id"
                  value={formData.country_id}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${
                    errors.country_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Country</option>
                  {selectedRegion && countriesByRegion[selectedRegion] ? 
                    countriesByRegion[selectedRegion]
                      .sort((a, b) => a.country_name.localeCompare(b.country_name))
                      .map((country) => (
                        <option key={country.country_id} value={country.country_id}>
                          {country.country_name}
                        </option>
                      ))
                    : 
                    countries
                      .sort((a, b) => a.country_name.localeCompare(b.country_name))
                      .map((country) => (
                        <option key={country.country_id} value={country.country_id}>
                          {country.country_name}
                        </option>
                      ))
                  }
                </select>
                {errors.country_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.country_id}</p>
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Nested Modals */}
      <AddCountryModal 
        isOpen={addCountryModalOpen}
        onClose={() => setAddCountryModalOpen(false)}
        onSuccess={handleAddCountrySuccess}
      />
      
      <AddRegionModal 
        isOpen={addRegionModalOpen}
        onClose={() => setAddRegionModalOpen(false)}
        onSuccess={handleAddRegionSuccess}
      />
    </div>
  );
};

export default EditLocationModal; 