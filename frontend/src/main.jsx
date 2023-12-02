import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Dashboard from './dashboard'; // Asegúrate de importar el componente Dashboard
import './index.css';
import Cursos from './pages/Courses';
import Carrera from './pages/Table';
import Nav from './components/NavBar';
import Recomendaciones from './pages/Recomendaciones';
import 'bootstrap/dist/css/bootstrap.min.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/carreras" element={<Carrera />} />
        <Route path="/recomendaciones" element={<Recomendaciones />} />
        <Route path="/nav" element={<Nav />} />

      </Routes>
    </Router>
  </React.StrictMode>,
);
