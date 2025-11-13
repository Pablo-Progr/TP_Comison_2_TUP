const express = require('express');
const router = express.Router();
const asignacionesController = require('../controllers/asignaciones.controller');
const verificarToken = require("../middlewares/authMiddleware");

// Listar todas las asignaciones
router.get('/', verificarToken, asignacionesController.getAll);

// Deportes de un socio
router.get('/socio/:socio_id', verificarToken, asignacionesController.getDeportesDeSocio);

// Socios de un deporte
router.get('/deporte/:deporte_id', verificarToken, asignacionesController.getSociosDeDeporte);

// Asignar socio a deporte
router.post('/', verificarToken, asignacionesController.asignar);

// Desasignar socio de deporte
router.delete('/', verificarToken, asignacionesController.desasignar);

module.exports = router;
