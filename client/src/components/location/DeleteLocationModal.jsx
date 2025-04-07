import React, { useState } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { hrLocation } from '../../services/api';

const DeleteLocationModal = ({ isOpen, onClose, location, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleDelete = async () => {
    if (!location) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await hrLocation.delete(location.location_id);
      
      if (response.data.success) {
        onSuccess(location.location_id);
        onClose();
      } else {
        setError('Failed to delete location. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while trying to delete the location. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen || !location) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2 text-red-500">
            <Trash2 size={20} />
            <h2 className="text-xl font-bold">Delete Location</h2>
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
              <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600 text-xl font-bold">
                {location.city ? location.city.charAt(0) : 'L'}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{location.city || 'Unknown City'}</h3>
              <p className="text-gray-600">{location.country_name || 'Unknown Country'}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-gray-700">
              Are you sure you want to delete this location? This action cannot be undone and will permanently remove the location from the system.
            </p>
            
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md flex items-start gap-2">
              <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                Deleting this location may impact departments and employees associated with it.
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
            {loading ? 'Deleting...' : 'Delete Location'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteLocationModal; 