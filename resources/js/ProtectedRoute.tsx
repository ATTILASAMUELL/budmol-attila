import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/hooks';
import { JSX } from 'react/jsx-runtime';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
