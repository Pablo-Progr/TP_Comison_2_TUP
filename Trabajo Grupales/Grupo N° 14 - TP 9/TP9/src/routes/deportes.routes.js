const express = require('express');
const router = express.Router();
const deportesController = require('../controllers/deportes.controller');
const verificarToken = require("../middlewares/authMiddleware");

// Rutas CRUD protegidas
router.get('/', verificarToken, deportesController.getAll);
router.get('/:id', verificarToken, deportesController.getById);
router.post('/', verificarToken, deportesController.create);
router.put('/:id', verificarToken, deportesController.update);
router.delete('/:id', verificarToken, deportesController.remove);

module.exports = router;
