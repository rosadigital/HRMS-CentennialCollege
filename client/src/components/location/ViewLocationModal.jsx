import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, MapPin, Edit } from 'lucide-react';
import { hrLocation } from '../../services/api';
import axios from 'axios';

const ViewLocationModal = ({ isOpen, onClose, locationId, onEdit }) => {
  const [location, setLocation] = useState(null);
  const [country, setCountry] = useState(null);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!locationId) return;
      
      setLoading(true);
      try {
        const response = await hrLocation.getById(locationId);
        
        if (response.data.success) {
          setLocation(response.data.location);
          
          // Fetch country and region information if we have country_id
          if (response.data.location.country_id) {
            try {
              const countryResponse = await axios.get(
                `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/countries/${response.data.location.country_id}`
              );
              
              if (countryResponse.data.success) {
                setCountry(countryResponse.data.country);
                
                // If country has region_id, fetch region
                if (countryResponse.data.country.region_id) {
                  const regionResponse = await axios.get(
                    `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/regions/${countryResponse.data.country.region_id}`
                  );
                  
                  if (regionResponse.data.success) {
                    setRegion(regionResponse.data.region);
                  }
                }
              }
            } catch (error) {
              console.error('Error fetching related data:', error);
            }
          }
        } else {
          setError('Failed to load location details');
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        setError('Error loading location details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && locationId) {
      fetchLocation();
    }
  }, [isOpen, locationId]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Location Details</h2>
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
          ) : location ? (
            <div>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-3">
                    <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600 text-2xl font-bold">
                      {location.city ? location.city.charAt(0) : 'L'}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">{location.city || 'Unknown City'}</h3>
                  <p className="text-gray-600">{location.country_name || 'Unknown Country'}</p>
                </div>
                
                <div className="md:w-2/3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Location Information</h3>
                    <button 
                      onClick={() => onEdit(location)}
                      className="text-green-500 flex items-center gap-1 hover:text-green-600"
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">City</p>
                      <p className="font-medium">{location.city || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">State/Province</p>
                      <p className="font-medium">{location.state_province || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Country</p>
                      <p className="font-medium">{country?.country_name || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Region</p>
                      <p className="font-medium">{region?.region_name || 'Not specified'}</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mb-4">Address Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Street Address</p>
                      <p className="font-medium">{location.street_address || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Postal Code</p>
                      <p className="font-medium">{location.postal_code || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3 mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={18} />
                  <span>{`${location.city || ''} ${location.state_province ? ', ' + location.state_province : ''} ${location.country_name ? ', ' + location.country_name : ''}`}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No location data found
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

export default ViewLocationModal; 