import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';

// Context (to be implemented)
// import { AuthProvider } from './contexts/AuthContext';

function App() {
  // For demo purposes, we'll consider the user as logged in
  const isAuthenticated = false; // This would normally come from a context or similar

  return (
    // <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/employees" element={isAuthenticated ? <Employees /> : <Navigate to="/login" />} />
          <Route path="/departments" element={isAuthenticated ? <Departments /> : <Navigate to="/login" />} />
          <Route path="/jobs" element={isAuthenticated ? <Jobs /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    // </AuthProvider>
  );
}

export default App; 