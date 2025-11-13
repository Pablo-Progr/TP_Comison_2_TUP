// routes/auth.routes.js
const express = require("express");
const router = express.Router();

const { authLogin } = require("../controllers/auth.controller");
const resetController = require("../controllers/reset.controller");

// Login (JWT)
router.post("/login", authLogin);

// Reset password: pedir token por mail
router.post("/reset/request", resetController.requestReset);

// Reset password: confirmar con token y nueva pass
router.post("/reset/confirm", resetController.confirmReset);

module.exports = router;
