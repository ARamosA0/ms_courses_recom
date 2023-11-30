import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Dashboard from './dashboard'; // Asegúrate de importar el componente Dashboard
import './index.css';
import Cursos from './pages/Courses';
import Recomendaciones from './pages/recomendaciones';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/cursos" element={<Cursos />} />
        <Route path="/dashboard/recomendaciones" element={<Recomendaciones />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
