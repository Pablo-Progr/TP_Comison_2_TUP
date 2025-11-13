const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagos.controller');
const verificarToken = require("../middlewares/authMiddleware");

// Listar todos los pagos
router.get('/', verificarToken, pagosController.getAll);

// Registrar pago
router.post('/', verificarToken, pagosController.create);

// Pagos por socio
router.get('/socio/:socio_id', verificarToken, pagosController.getPagosDeSocio);

// Deuda del socio
router.get('/deuda/:socio_id', verificarToken, pagosController.getDeudaSocio);

module.exports = router;
