
// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Dashboard from './dashboard';
import Cursos from './pages/Courses';
import Carrera from './pages/Table';
import Nav from './components/NavBar';
import Recomendaciones from './pages/Recomendaciones';
import CreateUsers from './pages/CreateUsers';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './AuthContext';  // Importa el AuthProvider

// const isAuthenticated = true; // Cambia a `true` si el usuario está autenticado

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Utiliza AuthProvider para envolver el árbol de componentes */}
    <AuthProvider>
      <Router>
        {/* Utiliza Routes para envolver tus rutas */}
        <Routes>
        <Route path="/" element={<App />} />
        {/* Cambia la ruta principal de "/dashboard" a "/dashboard/*" */}
        <Route
          path="/dashboard/*"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="/cursos"
          element={<ProtectedRoute element={<Cursos />} />}
        />
        <Route
          path="/carreras"
          element={<ProtectedRoute element={<Carrera />} />}
        />
        <Route
          path="/recomendaciones"
          element={<ProtectedRoute element={<Recomendaciones />} />}
        />
        <Route path="/nav" element={<Nav />} />
        <Route path="/CreateUsers" element={<CreateUsers />} />
      </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>,
);
