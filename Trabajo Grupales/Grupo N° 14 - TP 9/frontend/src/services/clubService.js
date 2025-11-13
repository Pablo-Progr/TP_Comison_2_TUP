// Ejemplo de cómo usar la API con el token automáticamente incluido
import api from './api';

const clubService = {
  // ========== SOCIOS ==========
  
  // Obtener todos los socios
  getSocios: async () => {
    const response = await api.get('/socios');
    return response.data;
  },

  // Obtener socio por ID
  getSocioById: async (id) => {
    const response = await api.get(`/socios/${id}`);
    return response.data;
  },

  // Crear socio
  createSocio: async (socioData) => {
    const response = await api.post('/socios', socioData);
    return response.data;
  },

  // Actualizar socio
  updateSocio: async (id, socioData) => {
    const response = await api.put(`/socios/${id}`, socioData);
    return response.data;
  },

  // Eliminar socio
  deleteSocio: async (id) => {
    const response = await api.delete(`/socios/${id}`);
    return response.data;
  },

  // ========== DEPORTES ==========
  
  // Obtener todos los deportes
  getDeportes: async () => {
    const response = await api.get('/deportes');
    return response.data;
  },

  // Crear deporte
  createDeporte: async (deporteData) => {
    const response = await api.post('/deportes', deporteData);
    return response.data;
  },

  // Actualizar deporte
  updateDeporte: async (id, deporteData) => {
    const response = await api.put(`/deportes/${id}`, deporteData);
    return response.data;
  },

  // Eliminar deporte
  deleteDeporte: async (id) => {
    const response = await api.delete(`/deportes/${id}`);
    return response.data;
  },

  // ========== ASIGNACIONES ==========
  
  // Obtener todas las asignaciones
  getAsignaciones: async () => {
    const response = await api.get('/asignaciones');
    return response.data;
  },

  // Obtener deportes de un socio
  getDeportesDeSocio: async (socioId) => {
    const response = await api.get(`/asignaciones/socio/${socioId}`);
    return response.data;
  },

  // Obtener socios de un deporte
  getSociosDeDeporte: async (deporteId) => {
    const response = await api.get(`/asignaciones/deporte/${deporteId}`);
    return response.data;
  },

  // Asignar socio a deporte
  asignarSocioDeporte: async (socioId, deporteId) => {
    const response = await api.post('/asignaciones', { socio_id: socioId, deporte_id: deporteId });
    return response.data;
  },

  // Desasignar socio de deporte
  desasignarSocioDeporte: async (socioId, deporteId) => {
    const response = await api.delete('/asignaciones', { 
      data: { socio_id: socioId, deporte_id: deporteId } 
    });
    return response.data;
  },

  // ========== PAGOS ==========
  
  // Obtener todos los pagos
  getPagos: async () => {
    const response = await api.get('/pagos');
    return response.data;
  },

  // Registrar pago
  createPago: async (pagoData) => {
    const response = await api.post('/pagos', pagoData);
    return response.data;
  },

  // Obtener pagos de un socio
  getPagosDeSocio: async (socioId) => {
    const response = await api.get(`/pagos/socio/${socioId}`);
    return response.data;
  },

  // Obtener deuda de un socio
  getDeudaSocio: async (socioId) => {
    const response = await api.get(`/pagos/deuda/${socioId}`);
    return response.data;
  },
};

export default clubService;
