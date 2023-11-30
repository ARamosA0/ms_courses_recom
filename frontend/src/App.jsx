import  { useState } from 'react';
import { Navigate } from 'react-router-dom'; // Importa Navigate en lugar de Redirect
import './App.css';
import localImage from './image/logo.png';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);

  const handleLogin = () => {
    if (email == 'admin' && password == '1234') {
      // Aquí puedes implementar la lógica de autenticación
      // Por ahora, solo imprimo en la consola los datos ingresados
      console.log('Email:', email);
      console.log('Password:', password);

      // Establece redirectToDashboard a true para activar la redirección
      setRedirectToDashboard(true);
    } else {
      // Muestra una alerta si los campos están vacíos
      alert('Por favor, completa todos los campos antes de iniciar sesión.');
    }
  };

  // Usa Navigate en lugar de Redirect
  if (redirectToDashboard) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <img src={localImage} className="logo " alt="logo"/>
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
        </form>
      </div>
    </div>
  );
}

export default App;
