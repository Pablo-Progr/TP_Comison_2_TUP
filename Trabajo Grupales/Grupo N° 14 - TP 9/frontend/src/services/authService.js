import api from './api';

const authService = {
  // Login de usuario
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { token, user_type, rol } = response.data;
      
      // Guardar token y datos del usuario en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ 
        email, 
        user_type, 
        rol 
      }));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al iniciar sesión' };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verificar si hay sesión activa
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obtener token actual
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Obtener datos del usuario
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Reset password - solicitar token
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/reset/request', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al solicitar recuperación' };
    }
  },

  // Reset password - confirmar con token
  confirmPasswordReset: async (token, newPassword) => {
    try {
      const response = await api.post('/reset/confirm', { token, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al restablecer contraseña' };
    }
  },
};

export default authService;
