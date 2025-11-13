const express = require('express');
const router = express.Router();
const sociosController = require('../controllers/socios.controller');
const verificarToken = require("../middlewares/authMiddleware");

// Rutas CRUD protegidas
router.get('/', verificarToken, sociosController.getAll);
router.get('/:id', verificarToken, sociosController.getById);
router.post('/', verificarToken, sociosController.create);
router.put('/:id', verificarToken, sociosController.update);
router.delete('/:id', verificarToken, sociosController.remove);

module.exports = router;
