import useAuthStore from '../store/useAuthStore';

/**
 * Hook personalizado para acceder a la autenticación
 * Simplifica el acceso al store de autenticación
 */
const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    clearError,
  } = useAuthStore();

  return {
    // Estado
    user,
    token,
    isAuthenticated,
    loading,
    error,
    
    // Acciones
    login,
    logout,
    clearError,
    
    // Helpers
    isAdmin: user?.rol === 'admin',
    isOperador: user?.rol === 'operador',
    userEmail: user?.email,
    userType: user?.user_type,
  };
};

export default useAuth;
