// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Usuario no autenticado, redirigir a la página de inicio de sesión
    return <Navigate to="/" />;
  }

  // Usuario autenticado, renderizar el elemento
  return element;
};

export default ProtectedRoute;
