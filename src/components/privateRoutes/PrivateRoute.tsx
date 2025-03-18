import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  // Check if the token exists in localStorage
  const isAuthenticated = localStorage.getItem('token') !== null;

  // If not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return <>{element}</>;
};

export default PrivateRoute;
