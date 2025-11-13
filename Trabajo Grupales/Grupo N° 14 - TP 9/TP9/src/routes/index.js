// src/routes/index.js - Router principal que centraliza todas las rutas
const express = require("express");
const router = express.Router();

// Importar rutas de recursos
const asignacionesRoutes = require("./asignaciones.routes");
const deportesRoutes = require("./deportes.routes");
const sociosRoutes = require("./socios.routes");
const pagosRoutes = require("./pagos.routes");

// Importar controladores de auth directamente
const { authLogin } = require("../controllers/auth.controller");
const resetController = require("../controllers/reset.controller");

// Ruta de bienvenida de la API
router.get('/', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'API Club Deportivo',
    endpoints: {
      login: 'POST /api/login',
      reset_request: 'POST /api/reset/request',
      reset_confirm: 'POST /api/reset/confirm',
      socios: '/api/socios',
      deportes: '/api/deportes',
      asignaciones: '/api/asignaciones',
      pagos: '/api/pagos'
    }
  });
});

// Auth routes (sin middleware de autenticación)
router.post("/login", authLogin);
router.post("/reset/request", resetController.requestReset);
router.post("/reset/confirm", resetController.confirmReset);

// Registrar rutas de recursos protegidos
router.use("/socios", sociosRoutes);
router.use("/deportes", deportesRoutes);
router.use("/asignaciones", asignacionesRoutes);
router.use("/pagos", pagosRoutes);

module.exports = router;

