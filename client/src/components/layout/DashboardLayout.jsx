import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Building2, 
  Briefcase, 
  User, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { authService } from '../../services/api';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/employees', icon: <Users size={20} />, label: 'Employees' },
    { path: '/departments', icon: <Building2 size={20} />, label: 'Departments' },
    { path: '/jobs', icon: <Briefcase size={20} />, label: 'Jobs' },
    { path: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary-600">HRMS</h1>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`
          ${isMobileMenuOpen ? 'block' : 'hidden'} 
          md:block md:w-64 bg-white shadow-md z-10
          ${isMobileMenuOpen ? 'absolute inset-0 mt-16' : ''}
        `}
      >
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-bold text-primary-600">HRMS</h1>
          <p className="text-sm text-gray-500">Human Resource Management</p>
        </div>
        
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`
                    flex items-center px-6 py-3 text-sm
                    ${isActive(item.path) 
                      ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-500' 
                      : 'text-gray-600 hover:bg-gray-100'}
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-4">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto p-6 border-t">
          <button 
            onClick={handleLogout}
            className="flex items-center text-red-500 hover:text-red-700"
          >
            <LogOut size={20} className="mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout; 