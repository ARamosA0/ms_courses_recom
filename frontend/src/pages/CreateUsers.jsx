import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function CreateUser() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [correo, setCorreo] = useState('');
  const [existingUsers, setExistingUsers] = useState([]);

  // Obtener datos existentes al cargar el componente
  useEffect(() => {
    const fetchExistingUsers = async () => {
      try {
        const response = await fetch('http://ip172-18-0-64-clnkkc4snmng008p6ii0-5002.direct.labs.play-with-docker.com/usuarios');
        if (response.ok) {
          const data = await response.json();
          setExistingUsers(data.usuarios);
        } else {
          console.error('Error al obtener usuarios existentes');
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    };

    fetchExistingUsers();
  }, []); // El segundo parámetro [] asegura que el efecto se ejecute solo una vez al montar el componente

  const handleCreateUser = async () => {
    try {
      const response = await fetch('http://ip172-18-0-64-clnkkc4snmng008p6ii0-5002.direct.labs.play-with-docker.com/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido,
          dni: parseInt(dni), // Convierte el dni a número
          correo,
        }),
      });

      if (response.ok) {
        console.log('Usuario creado con éxito');
        // Actualizar la lista de usuarios después de crear uno nuevo
        fetchExistingUsers();
        // Puedes redirigir al usuario a otra página o realizar otras acciones después de crear el usuario
      } else {
        const data = await response.json();
        console.error('Error al crear usuario:', data.error);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  return (
    <div className="container mt-5">
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
        <button type="button" className="btn btn-primary" onClick={handleCreateUser}>
          Crear Usuario
        </button>

        {/* Muestra los datos existentes */}
        <div className="mt-4">
          <h3>Datos Existentes</h3>
          <ul>
            {existingUsers.map((user) => (
              <li key={user.usuario_id}>{`${user.nombre} ${user.apellido} - DNI: ${user.dni} - Correo: ${user.correo}`}</li>
            ))}
          </ul>
        </div>
      </form>
    </div>
  );
}

export default CreateUser;
