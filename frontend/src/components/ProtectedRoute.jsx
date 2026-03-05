import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Check if the user has a token saved in their browser
  const token = localStorage.getItem('token');

  // 2. If they DO NOT have a token, kick them to the login page
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // 3. If they DO have a token, open the door and let them see the page!
  return <Outlet />;
};

export default ProtectedRoute;