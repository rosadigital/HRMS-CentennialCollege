import React from 'react';
import { ArrowUp, TrendingUp, Users, Briefcase } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

// Mock data
const departmentData = [
  { department: 'Engineering', percentage: 32, color: '#26D07C' },
  { department: 'Sales', percentage: 24, color: '#1E293B' },
  { department: 'Marketing', percentage: 18, color: '#E2E8F0' },
  { department: 'HR', percentage: 12, color: '#EF4444' },
];

const recentHires = [
  {
    id: 1,
    name: 'Sarah Johnson',
    position: 'Senior Developer',
    timeAgo: 'Today',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 2,
    name: 'Michael Chen',
    position: 'Product Manager',
    timeAgo: 'Yesterday',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 3,
    name: 'Emily Wilson',
    position: 'UX Designer',
    timeAgo: '2 days ago',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
  }
];

const Dashboard = () => {
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
        {/* <p className="text-gray-600">Welcome to the HRMS Dashboard</p> */}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard 
          icon={<Users className="text-green-500" />}
          color="green"
          title="Total Employees"
          value="2,451"
          percentage="12.5"
          trend="up"
        />
        <StatCard 
          icon={<Users className="text-green-500" />}
          color="green"
          title="New Hires (2025)"
          value="145"
          percentage="8.3"
          trend="up"
        />
        <StatCard 
          icon={<TrendingUp className="text-red-500" />}
          color="red"
          title="Turnover Rate"
          value="4.8%"
          percentage="1.2"
          trend="up"
        />
        <StatCard 
          icon={<Briefcase className="text-green-500" />}
          color="green"
          title="Open Positions"
          value="38"
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
            {departmentData.map((dept) => (
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
            ))}
          </div>
        </div>

        {/* Recent Hires */}
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-medium">Recent Hires</h2>
            <a href="#" className="text-green-500 text-sm">View All</a>
          </div>
          
          <div className="space-y-4">
            {recentHires.map((hire) => (
              <div key={hire.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <img 
                    src={hire.avatar} 
                    alt={hire.name} 
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{hire.name}</p>
                    <p className="text-sm text-gray-500">{hire.position}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{hire.timeAgo}</span>
              </div>
            ))}
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-red-500">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <h3 className="font-medium text-red-700">Action Required</h3>
            </div>
            <p className="text-sm text-gray-700">
              Engineering department showing signs of increased overtime hours. Consider reviewing workload distribution.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard; 