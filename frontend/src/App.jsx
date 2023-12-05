import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './App.css';
import localImage from './image/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);
  const [redirectToCreateUser, setRedirectToCreateUser] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://ip172-18-0-64-clnkkc4snmng008p6ii0-5002.direct.labs.play-with-docker.com/usuarios_cuentas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const cuentas = await response.json();

        // Verifica si las credenciales del usuario coinciden con alguna cuenta
        const cuentaEncontrada = cuentas.usuarios_cuentas.find(
          (cuenta) => cuenta.username === email && cuenta.password === password
        );

        if (cuentaEncontrada) {
          console.log('Usuario autenticado con éxito');
          // Aquí puedes redirigir al usuario a la página de dashboard
          setRedirectToDashboard(true);
        } else {
          alert('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        }
      } else {
        const data = await response.json();
        console.error('Error al obtener cuentas:', data.error);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const handleCreateAccount = () => {
    // Establece redirectToCreateUser a true para activar la redirección a la página de creación de usuarios
    setRedirectToCreateUser(true);
  };

  // Usa Navigate en lugar de Redirect
  if (redirectToDashboard) {
    return <Navigate to="/dashboard" />;
  }

  if (redirectToCreateUser) {
    return <Navigate to="/CreateUsers" />;
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <img src={localImage} className="logo " alt="logo" />
        <h1>Log In</h1>
        <form>
          <div className="input-container">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">
              <i className="fas fa-lock"></i>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <button type="button" onClick={handleLogin}>
            INICIAR SESIÓN
          </button>
          <button type="button" onClick={handleCreateAccount}>
            CREAR CUENTA
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
