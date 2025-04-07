import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Search, Eye } from 'lucide-react';
import { jobHistoryService, employeeService } from '../services/api';

const Jobs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobHistories, setJobHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const itemsPerPage = 10;
  const [totalCount, setTotalCount] = useState(0);
  
  // Fetch job histories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await jobHistoryService.getAll();
        
        if (response.data.success) {
          setJobHistories(response.data.job_histories || []);
          setTotalCount(response.data.job_histories?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching job history data:', error);
        setError('Failed to load job history data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle search
  const filteredJobHistories = jobHistories.filter(history => {
    const employeeName = history.employee_name || '';
    const jobTitle = history.job_title || '';
    const departmentName = history.department_name || '';
    
    return searchTerm 
      ? employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        departmentName.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
  });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHistories = filteredJobHistories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobHistories.length / itemsPerPage);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Job History</h1>
        <p className="text-gray-600">View employee job history records</p>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by employee, job title, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
        </div>
      </div>
      
      {/* Job History Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-medium">All Job History Records ({totalCount})</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
          </div>
        ) : filteredJobHistories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No job history records found.</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-sm font-medium text-gray-500">
              <div className="col-span-3">EMPLOYEE</div>
              <div className="col-span-3">JOB TITLE</div>
              <div className="col-span-2">DEPARTMENT</div>
              <div className="col-span-2">START DATE</div>
              <div className="col-span-2">END DATE</div>
            </div>
            
            {/* Table Content */}
            {currentHistories.map((history, index) => (
              <div key={`${history.employee_id}-${history.start_date}-${index}`} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center">
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-semibold">
                      {history.employee_name ? history.employee_name.split(' ').map(n => n.charAt(0)).join('') : 'NA'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{history.employee_name || 'Not Available'}</p>
                  </div>
                </div>
                <div className="col-span-3">
                  <p>{history.job_title || 'Not Available'}</p>
                </div>
                <div className="col-span-2">
                  <p>{history.department_name || 'Not Available'}</p>
                </div>
                <div className="col-span-2">
                  <p>{formatDate(history.start_date)}</p>
                </div>
                <div className="col-span-2">
                  <p>{formatDate(history.end_date)}</p>
                </div>
              </div>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 text-sm">
                <p className="text-gray-500">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredJobHistories.length)} of {filteredJobHistories.length} entries
                </p>
                <div className="flex gap-2">
                  <button 
                    className={`px-3 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages).keys()].map(number => (
                    <button
                      key={number + 1}
                      className={`px-3 py-1 rounded-md ${currentPage === number + 1 ? 'bg-green-500 text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                      onClick={() => setCurrentPage(number + 1)}
                    >
                      {number + 1}
                    </button>
                  ))}
                  
                  <button 
                    className={`px-3 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Jobs; 