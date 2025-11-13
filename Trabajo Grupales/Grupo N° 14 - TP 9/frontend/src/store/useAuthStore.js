import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set) => ({
  // Estado
  user: authService.getUser(),
  token: authService.getToken(),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,

  // Acciones
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.login(email, password);
      set({
        user: { email, user_type: data.user_type, rol: data.rol },
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });
      return data;
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message || 'Error al iniciar sesión' 
      });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;
