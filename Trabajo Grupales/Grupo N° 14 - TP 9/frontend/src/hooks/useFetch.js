import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Hook para hacer peticiones HTTP con manejo de estados
 * @param {string|Object} urlOrConfig - URL del endpoint o objeto de configuración
 * @param {Object} options - Opciones de configuración (si el primer parámetro es string)
 */
const useFetch = (urlOrConfig, options = {}) => {
  // Determinar si se pasó una URL o un objeto de configuración
  let url, autoFetch, method, body, fetchFn;
  
  if (typeof urlOrConfig === 'string') {
    // Uso tradicional: useFetch(url, options)
    url = urlOrConfig;
    ({ autoFetch = true, method = 'GET', body = null } = options);
  } else {
    // Uso con configuración: useFetch({ url, fetchFn, autoFetch, ... })
    ({ url, fetchFn, autoFetch = true, method = 'GET', body = null } = urlOrConfig || {});
  }

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Función para ejecutar la petición
   */
  const fetchData = async (customBody = null) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      
      // Si se proporcionó una función fetchFn, usarla directamente
      if (fetchFn && typeof fetchFn === 'function') {
        const result = await fetchFn(customBody);
        setData(result);
        return result;
      }

      // Si no, usar el método HTTP tradicional con la URL
      if (!url) {
        throw new Error('Se debe proporcionar una URL o una función fetchFn');
      }

      const requestBody = customBody || body;

      switch (method.toUpperCase()) {
        case 'GET':
          response = await api.get(url);
          break;
        case 'POST':
          response = await api.post(url, requestBody);
          break;
        case 'PUT':
          response = await api.put(url, requestBody);
          break;
        case 'DELETE':
          response = await api.delete(url, { data: requestBody });
          break;
        default:
          throw new Error(`Método HTTP no soportado: ${method}`);
      }

      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error en la petición';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función para refrescar los datos
   */
  const refetch = () => fetchData();

  /**
   * Función para limpiar los datos
   */
  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  // Auto-fetch al montar el componente si está habilitado
  useEffect(() => {
    if (autoFetch && (url || fetchFn)) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, autoFetch]);

  return {
    data,
    loading,
    error,
    fetchData,
    refetch,
    reset,
  };
};

export default useFetch;
