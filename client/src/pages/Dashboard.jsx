import React, { useState, useEffect } from 'react';
import { ArrowUp, TrendingUp, Users, Briefcase } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { employeeService, departmentService, jobService } from '../services/api';

const Dashboard = () => {
  // States for dashboard data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState({
    totalEmployees: 0,
    newHires: 0,
    turnoverRate: 0,
    openPositions: 0
  });
  const [departmentData, setDepartmentData] = useState([]);
  const [recentHires, setRecentHires] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch employees, departments, and jobs in parallel
        const [employeesResponse, departmentsResponse, jobsResponse] = await Promise.all([
          employeeService.getAll(),
          departmentService.getAll(),
          jobService.getAll()
        ]);

        // Process employees data
        if (employeesResponse.data.success) {
          const employees = employeesResponse.data.employees || [];
          
          // Calculate total employees
          const totalEmployees = employees.length;
          
          // Calculate new hires (employees hired in current year)
          const currentYear = new Date().getFullYear();
          const newHires = employees.filter(emp => {
            if (!emp.hire_date) return false;
            const hireYear = new Date(emp.hire_date).getFullYear();
            return hireYear === currentYear;
          }).length;
          
          // Get recent hires (last 3)
          const sortedEmployees = [...employees].sort((a, b) => {
            if (!a.hire_date) return 1;
            if (!b.hire_date) return -1;
            return new Date(b.hire_date) - new Date(a.hire_date);
          });
          
          const recentHiresList = sortedEmployees.slice(0, 3).map(emp => ({
            id: emp.employee_id,
            name: `${emp.first_name} ${emp.last_name}`,
            position: emp.job_title || 'Not Assigned',
            timeAgo: formatTimeAgo(emp.hire_date),
            avatar: emp.image_url || null
          }));
          
          setRecentHires(recentHiresList);
          
          // Update stats
          setStatsData(prev => ({
            ...prev,
            totalEmployees,
            newHires
          }));
        }
        
        // Process departments data
        if (departmentsResponse.data.success) {
          const departments = departmentsResponse.data.departments || [];
          
          // Count employees per department and calculate percentages
          const departmentCounts = {};
          const totalEmployeeCount = (employeesResponse.data.employees || []).length;
          
          if (totalEmployeeCount > 0) {
            (employeesResponse.data.employees || []).forEach(emp => {
              if (emp.department_id) {
                departmentCounts[emp.department_id] = (departmentCounts[emp.department_id] || 0) + 1;
              }
            });
            
            // Create department distribution data
            const departmentColors = ['#26D07C', '#1E293B', '#E2E8F0', '#EF4444', '#3B82F6', '#F97316'];
            
            const deptDistribution = departments.map((dept, index) => {
              const count = departmentCounts[dept.department_id] || 0;
              const percentage = Math.round((count / totalEmployeeCount) * 100);
              
              return {
                department: dept.department_name,
                percentage,
                color: departmentColors[index % departmentColors.length]
              };
            })
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 6); // Limit to top 6 departments
            
            setDepartmentData(deptDistribution);
          }
        }
        
        // Process jobs data for open positions
        if (jobsResponse.data.success) {
          const jobs = jobsResponse.data.jobs || [];
          // Count jobs marked as open/vacant
          const openPositions = jobs.filter(job => job.is_open).length;
          
          setStatsData(prev => ({
            ...prev,
            openPositions
          }));
        }
        
        // Set a placeholder turnover rate (this would typically come from a more complex calculation)
        setStatsData(prev => ({
          ...prev,
          turnoverRate: 4.8
        }));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const hireDate = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - hireDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
  };

  // Stat card component
  const StatCard = ({ icon, color, title, value, percentage, trend }) => {
    return (
      <div className="bg-white rounded-lg p-5 shadow-sm">
        <div className="flex justify-between">
          <div>{icon}</div>
          <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            <ArrowUp className={`w-3 h-3 ${trend === 'up' ? '' : 'rotate-180'}`} />
            <span>{percentage}%</span>
          </div>
        </div>
        <h3 className="text-gray-500 text-sm mt-4">{title}</h3>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard 
              icon={<Users className="text-green-500" />}
              color="green"
              title="Total Employees"
              value={statsData.totalEmployees.toLocaleString()}
              percentage="12.5"
              trend="up"
            />
            <StatCard 
              icon={<Users className="text-green-500" />}
              color="green"
              title={`New Hires (${new Date().getFullYear()})`}
              value={statsData.newHires.toLocaleString()}
              percentage="8.3"
              trend="up"
            />
            <StatCard 
              icon={<TrendingUp className="text-red-500" />}
              color="red"
              title="Turnover Rate"
              value={`${statsData.turnoverRate}%`}
              percentage="1.2"
              trend="up"
            />
            <StatCard 
              icon={<Briefcase className="text-green-500" />}
              color="green"
              title="Open Positions"
              value={statsData.openPositions.toLocaleString()}
              percentage="5.5"
              trend="up"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Department Distribution */}
            <div className="bg-white rounded-lg p-5 shadow-sm lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-medium">Department Distribution</h2>
                <select className="border border-gray-200 rounded-md px-3 py-1 text-sm">
                  <option>Last 30 Days</option>
                  <option>Last 60 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>
              
              <div className="flex items-end h-64 gap-16 pl-4">
                {departmentData.length > 0 ? (
                  departmentData.map((dept) => (
                    <div key={dept.department} className="flex flex-col items-center">
                      <div 
                        style={{ 
                          height: `${dept.percentage * 2}px`, 
                          backgroundColor: dept.color, 
                          width: '24px'
                        }}
                        className="rounded-t-sm"
                      ></div>
                      <div className="mt-3 text-center">
                        <p className="text-xs text-gray-500">{dept.department}</p>
                        <p className="font-medium">{dept.percentage}%</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <p className="text-gray-500">No department data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Hires */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-medium">Recent Hires</h2>
                <a href="/employees" className="text-green-500 text-sm">View All</a>
              </div>
              
              <div className="space-y-4">
                {recentHires.length > 0 ? (
                  recentHires.map((hire) => (
                    <div key={hire.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        {hire.avatar ? (
                          <img 
                            src={hire.avatar} 
                            alt={hire.name} 
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-medium">
                            {hire.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{hire.name}</p>
                          <p className="text-sm text-gray-500">{hire.position}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{hire.timeAgo}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No recent hires to display</p>
                )}
              </div>
            </div>
          </div>

          {/* AI-Powered Insights */}
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-medium mb-4">
              <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              </span>
              AI-Powered Insights
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-green-500 w-4 h-4" />
                  <h3 className="font-medium text-green-700">Positive Trend</h3>
                </div>
                <p className="text-sm text-gray-700">
                  Employee satisfaction has increased by 15% in the last quarter, primarily due to new wellness initiatives.
                </p>
              </div>
              
              <div className="bg-red-50 p-5 rounded-lg border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <h3 className="font-medium text-red-700">Action Required</h3>
                </div>
                <p className="text-sm text-gray-700">
                  {departmentData.length > 0 && departmentData[0].percentage > 30 ? 
                    `${departmentData[0].department} department showing higher concentration (${departmentData[0].percentage}%). Consider balancing resources.` :
                    'Engineering department showing signs of increased overtime hours. Consider reviewing workload distribution.'
                  }
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard; 