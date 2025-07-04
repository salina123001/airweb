import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { User } from '../../types'; // 或 './types'

interface PrivateRouteProps {
  user: User | null;
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ user, children }) => {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
