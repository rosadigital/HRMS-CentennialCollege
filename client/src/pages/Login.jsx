import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check for demo credentials
      if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
        // Simulated login for demo
        localStorage.setItem('token', 'demo-token');
        
        // Dispatch a storage event to update authentication state across tabs
        window.dispatchEvent(new Event('storage'));
        
        navigate('/dashboard');
      } else {
        // Show error for incorrect credentials
        setError('Invalid email or password. Try admin@example.com / password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0B1B24] p-5">
      <div className="w-full max-w-[1200px] flex overflow-hidden rounded-3xl">
        {/* Left Panel */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-between bg-[#0B1B24] text-white p-12">
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-[#26D07C] rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM5 5H9V19H5V5ZM19 19H11V5H19V19Z" fill="white"/>
                </svg>
              </div>
              <span className="font-bold text-xl">HRSystem</span>
            </div>

            <h1 className="text-4xl font-bold mb-4">Welcome to HR Management System</h1>
            <p className="text-gray-400 mb-16">Streamline your HR operations with our comprehensive management solution.</p>

            <div className="flex items-center gap-2 text-gray-400 mb-5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C10.4968 22.0005 9.03292 21.5544 7.80138 20.7247C6.56984 19.8949 5.63066 18.719 5.11463 17.3553C4.59861 15.9916 4.53307 14.5052 4.92673 13.1079C5.32039 11.7106 6.15509 10.4685 7.3 9.55L11.3 6.26C11.4772 6.11114 11.7069 6.02949 11.945 6.02949C12.1831 6.02949 12.4128 6.11114 12.59 6.26L16.59 9.55C17.734 10.4685 18.5679 11.7102 18.9611 13.1069C19.3544 14.5036 19.2888 15.9893 18.773 17.3525C18.2571 18.7157 17.3184 19.8914 16.0875 20.7214C14.8566 21.5513 13.3933 21.998 11.89 22H12ZM12 8L8 11.28C7.19958 11.9388 6.6356 12.841 6.39011 13.8559C6.14462 14.8708 6.23297 15.9372 6.6406 16.8938C7.04824 17.8504 7.75465 18.6472 8.65683 19.1587C9.55901 19.6702 10.6075 19.869 11.64 19.72C12.38 19.62 13.08 19.34 13.69 18.92C14.5108 18.3266 15.1132 17.4791 15.4015 16.5059C15.6898 15.5328 15.6478 14.4855 15.2817 13.5409C14.9157 12.5964 14.246 11.8023 13.37 11.28L12 10.12V8Z" fill="#26D07C"/>
              </svg>
              <span>Enterprise-grade security</span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="border border-gray-700 rounded-xl px-6 py-3 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 10V6C16 4.89543 15.1046 4 14 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H14C15.1046 20 16 19.1046 16 18V14M10 12H21M21 12L18 9M21 12L18 15" stroke="#26D07C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>ISO 27001 Certified</span>
            </div>
            <div className="border border-gray-700 rounded-xl px-6 py-3 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C10.4968 22.0005 9.03292 21.5544 7.80138 20.7247C6.56984 19.8949 5.63066 18.719 5.11463 17.3553C4.59861 15.9916 4.53307 14.5052 4.92673 13.1079C5.32039 11.7106 6.15509 10.4685 7.3 9.55L11.3 6.26C11.4772 6.11114 11.7069 6.02949 11.945 6.02949C12.1831 6.02949 12.4128 6.11114 12.59 6.26L16.59 9.55C17.734 10.4685 18.5679 11.7102 18.9611 13.1069C19.3544 14.5036 19.2888 15.9893 18.773 17.3525C18.2571 18.7157 17.3184 19.8914 16.0875 20.7214C14.8566 21.5513 13.3933 21.998 11.89 22H12Z" stroke="#26D07C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 bg-white p-6 md:p-12 rounded-3xl">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2">Sign in to your account</h2>
            <p className="text-gray-500 text-center mb-8">Enter your credentials to access your account</p>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107"/>
                  <path d="M3.15302 7.3455L6.43852 9.755C7.32752 7.554 9.48052 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15902 2 4.82802 4.1685 3.15302 7.3455Z" fill="#FF3D00"/>
                  <path d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3038 18.001 12 18C9.39897 18 7.19047 16.3415 6.35847 14.027L3.09747 16.5395C4.75247 19.778 8.11347 22 12 22Z" fill="#4CAF50"/>
                  <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2"/>
                </svg>
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.2125 9.84766C22.2125 8.91016 22.1156 8.23828 21.9078 7.54297H12.2438V10.6523H18.075C17.9156 11.5898 17.2844 12.9805 15.825 13.9336L15.8062 14.0625L18.8906 16.4648L19.1016 16.4844C21.0375 14.7227 22.2125 12.4805 22.2125 9.84766Z" fill="#4285F4"/>
                  <path d="M12.2438 21.9805C15.1391 21.9805 17.5719 21.0273 19.1016 16.4844L15.825 13.9336C14.9062 14.543 13.6922 14.9648 12.2438 14.9648C9.35156 14.9648 6.92969 13.3164 6.02344 10.9102L5.90156 10.9195L2.69062 13.4102L2.65312 13.5273C4.16719 18.3594 7.9125 21.9805 12.2438 21.9805Z" fill="#34A853"/>
                  <path d="M6.02344 10.9102C5.77031 10.2148 5.62812 9.47266 5.62812 8.70703C5.62812 7.94141 5.77031 7.19922 6.00937 6.50391L6.00469 6.36758L2.75156 3.83984L2.65312 3.88672C1.83281 5.27344 1.36719 6.92578 1.36719 8.70703C1.36719 10.4883 1.83281 12.1406 2.65312 13.5273L6.02344 10.9102Z" fill="#FBBC05"/>
                  <path d="M12.2438 2.44922C14.2859 2.44922 15.7203 3.28516 16.5406 4.04297L19.4766 1.20703C17.5719 -0.140625 15.1391 -0.804688 12.2438 -0.804688C7.9125 -0.804688 4.16719 2.75391 2.65312 7.58594L6.00937 10.2031C6.92969 7.79688 9.35156 5.24844 12.2438 5.24844V2.44922Z" fill="#EB4335"/>
                </svg>
                <span>Microsoft</span>
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg"
                    placeholder="••••••••"
                    required
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6C15.79 6 19.17 8.13 20.82 11.5C19.17 14.87 15.79 17 12 17C8.21 17 4.83 14.87 3.18 11.5C4.83 8.13 8.21 6 12 6ZM12 4C7 4 2.73 7.11 1 11.5C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 11.5C21.27 7.11 17 4 12 4ZM12 9C13.38 9 14.5 10.12 14.5 11.5C14.5 12.88 13.38 14 12 14C10.62 14 9.5 12.88 9.5 11.5C9.5 10.12 10.62 9 12 9ZM12 7C9.52 7 7.5 9.02 7.5 11.5C7.5 13.98 9.52 16 12 16C14.48 16 16.5 13.98 16.5 11.5C16.5 9.02 14.48 7 12 7Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#26D07C] focus:ring-[#26D07C] border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="remember-me" className="text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm text-[#26D07C] hover:text-[#1fa364]">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#26D07C] text-white rounded-lg hover:bg-[#1fa364] transition-colors"
                disabled={loading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 7L9.6 8.4L12.2 11H2V13H12.2L9.6 15.6L11 17L16 12L11 7Z" fill="white"/>
                  <path d="M20 19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H12V5H20V19Z" fill="white"/>
                </svg>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="text-center text-sm text-gray-500 mt-6">
              Don't have an account? 
              <a href="#" className="ml-1 text-[#26D07C] hover:text-[#1fa364]">
                Contact your HR admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 