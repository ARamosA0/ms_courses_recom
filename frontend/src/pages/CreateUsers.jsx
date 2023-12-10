import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./createusers.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function CreateUser() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [correo, setCorreo] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateUserAndCuenta = async () => {
    try {
      // Crear usuario
      const userResponse = await fetch('http://ip172-18-0-13-clr0h9mfml8g00ck4d3g-5002.direct.labs.play-with-docker.com/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido,
          dni: parseInt(dni),
          correo,
        }),
      });
  
      if (!userResponse.ok) {
        const userErrorData = await userResponse.json();
        throw new Error('Error al crear usuario: ${userErrorData.error}');
      }
  
      // Obtener el usuario_id del usuario recién creado
      const { usuario_id } = await userResponse.json();
  
      // Crear cuenta de usuario
      const cuentaResponse = await fetch('http://ip172-18-0-13-clr0h9mfml8g00ck4d3g-5002.direct.labs.play-with-docker.com/usuarios_cuentas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id,
          username,
          password,
        }),
      });
  
      if (cuentaResponse.ok) {
        alert('Usuario y cuenta creados con éxito');
        // Puedes realizar acciones adicionales después de crear el usuario y la cuenta
      } else {
        const cuentaErrorData = await cuentaResponse.json();
        throw new Error('Error al crear cuenta de usuario: ${cuentaErrorData.error}');
      }
    } catch (error) {
      console.error('Error de red:', error.message);
    }
  };
  return (
    <div className="login-container"> {/* Usa la clase login-container */}
      <div className="login-form card"> {/* Usa la clase login-form y card */}
        <h2>Crear Usuario</h2>
        <form>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="apellido" className="form-label">
            Apellido
          </label>
          <input
            type="text"
            className="form-control"
            id="apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dni" className="form-label">
            DNI
          </label>
          <input
            type="text"
            className="form-control"
            id="dni"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="correo" className="form-label">
            Correo
          </label>
          <input
            type="email"
            className="form-control"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="username"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button type="button" className="btn btn-primary" onClick={handleCreateUserAndCuenta}>
          CREAR
        </button>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;