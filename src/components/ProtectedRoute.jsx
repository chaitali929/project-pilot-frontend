import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useUserStore from '../store/userStore';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, token, initializeUser, isLoading } = useUserStore();

  useEffect(() => { initializeUser(); }, []);

  if (!token) return <Navigate to="/login" replace />;
  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    const redirect = user.role === 'coordinator' ? '/CoordinatorDashboard'
      : user.role === 'mentor' ? '/MentorDashboard' : '/StudentDashboard';
    return <Navigate to={redirect} replace />;
  }
  return children;
}
