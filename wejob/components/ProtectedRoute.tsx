import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'employer' | 'freelancer' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { user, profile, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If user exists but profile is null or has no role, we redirect to home
  if (!loading && user && (!profile || !profile.role)) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && profile && profile.role !== allowedRole) {
    if (allowedRole === 'admin') {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    if (profile.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to={profile.role === 'employer' ? '/employer/dashboard' : '/freelancer/dashboard'} replace />;
  }

  if (allowedRole && !profile) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
