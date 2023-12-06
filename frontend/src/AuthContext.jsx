// AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => JSON.parse(localStorage.getItem('isAuthenticated')) || false
  );

  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  const login = () => {
    // Lógica de autenticación aquí...
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Lógica de cierre de sesión aquí...
    setIsAuthenticated(false);
  };

  console.log('Estado de autenticación:', isAuthenticated);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);