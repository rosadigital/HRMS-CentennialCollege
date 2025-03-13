import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { Users, Building2, Briefcase, TrendingUp } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

// Mock data for the charts
const departmentData = [
  { id: 'HR', value: 12 },
  { id: 'Engineering', value: 25 },
  { id: 'Marketing', value: 18 },
  { id: 'Finance', value: 15 },
  { id: 'Operations', value: 20 },
];

const jobTrendData = [
  { month: 'Jan', hired: 5, left: 2 },
  { month: 'Feb', hired: 8, left: 3 },
  { month: 'Mar', hired: 12, left: 5 },
  { month: 'Apr', hired: 6, left: 2 },
  { month: 'May', hired: 10, left: 4 },
  { month: 'Jun', hired: 15, left: 7 },
];

const Dashboard = () => {
  // StatCard component for displaying statistics
  const StatCard = ({ icon, title, value, change, changeType }) => {
    return (
      <div className="card flex items-start">
        <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <p className="text-2xl font-bold my-1">{value}</p>
          <p className={`text-sm ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
            <span className="flex items-center">
              <TrendingUp size={16} className="mr-1" />
              {change}
            </span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to the HRMS Dashboard</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<Users size={24} />}
          title="Total Employees"
          value="90"
          change="+5% since last month"
          changeType="positive"
        />
        <StatCard 
          icon={<Building2 size={24} />}
          title="Departments"
          value="5"
          change="No change"
          changeType="neutral"
        />
        <StatCard 
          icon={<Briefcase size={24} />}
          title="Open Positions"
          value="12"
          change="+2 since last month"
          changeType="positive"
        />
        <StatCard 
          icon={<Users size={24} />}
          title="New Hires"
          value="15"
          change="+8 since last month"
          changeType="positive"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Employees by Department</h2>
          <div className="h-80">
            <ResponsivePie
              data={departmentData}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: 'category10' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000'
                      }
                    }
                  ]
                }
              ]}
            />
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Hiring Trends</h2>
          <div className="h-80">
            <ResponsiveBar
              data={jobTrendData}
              keys={['hired', 'left']}
              indexBy="month"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              groupMode="grouped"
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'set2' }}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Month',
                legendPosition: 'middle',
                legendOffset: 32
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Count',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemOpacity: 1
                      }
                    }
                  ]
                }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center p-3 border-b border-gray-100 last:border-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <Users size={20} className="text-gray-500" />
              </div>
              <div>
                <p className="font-medium">New employee joined</p>
                <p className="text-sm text-gray-500">John Doe was added to the Engineering department</p>
              </div>
              <div className="ml-auto text-sm text-gray-400">
                2 hours ago
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard; 