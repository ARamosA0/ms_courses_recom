// api.jsx
export const api = {
    login: async (userCredentials) => {
      try {
        const response = await fetch('http://ip172-18-0-38-clno7fufml8g00blhs70-5002.direct.labs.play-with-docker.com/usuarios_cuentas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userCredentials),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error durante la autenticación');
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error durante la autenticación', error);
        throw new Error('Error durante la autenticación');
      }
    },
    // Otras funciones de la API...
  };
  