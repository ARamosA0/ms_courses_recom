import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './Login.css';
import localImage from '../image/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);
  const [redirectToCreateUser, setRedirectToCreateUser] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        'http://ip172-18-0-47-clridamfml8g009ce570-5002.direct.labs.play-with-docker.com/usuarios_cuentas'
      );

      if (!response.ok) {
        throw new Error('Error al obtener datos de la API');
      }

      const data = await response.json();
      const user = data.usuarios_cuentas.find(
        (u) => u.username === email && u.password === password
      );

      if (user) {
        // Lógica de autenticación exitosa
        const userData = {
          email: user.username,
          // Otros campos del usuario si es necesario
        };

        login(userData);
        setRedirectToDashboard(true);
      } else {
        // Lógica para manejar credenciales incorrectas
        console.error('Credenciales incorrectas');
        alert('Credenciales incorrectas. Verifica tu email y contraseña.');
      }
    } catch (error) {
      console.error('Error al autenticar:', error);
    }
  };

  const handleCreateAccount = () => {
    setRedirectToCreateUser(true);
  };

  if (redirectToDashboard) {
    return <Navigate to="/dashboard" />;
  }

  if (redirectToCreateUser) {
    return <Navigate to="/CreateUsers" />;
  }

  return (
    <body className="login-body">
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
    </body>
  );
}

export default Login;
