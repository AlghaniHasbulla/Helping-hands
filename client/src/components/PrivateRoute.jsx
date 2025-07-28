import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const auth = useSelector(state => state.auth);

  if (!auth.isAuthenticated) {
    return <Navigate to="/Sign-In" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
