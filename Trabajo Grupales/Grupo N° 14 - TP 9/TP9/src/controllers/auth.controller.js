// controllers/auth.controller.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/DB");

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "dev-secret", {
    expiresIn: "12h",
  });
}

const authLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ ok: false, msg: "Email y password son requeridos" });
    }

    // 1) Intentar como socio (bcrypt obligado)
    const [socios] = await db.query(
      'SELECT id, email, password FROM socios WHERE email = ?',
      [email]
    );

    if (socios.length > 0) {
      const socio = socios[0];
      const ok = await bcrypt.compare(password, socio.password);
      if (!ok) {
        return res
          .status(401)
          .json({ ok: false, msg: "Credenciales inválidas" });
      }

      const token = signToken({
        user_type: "socio",
        id: socio.id,
        email: socio.email,
      });
      return res.json({
        ok: true,
        user_type: "socio",
        token,
      });
    }

    // 2) Intentar como usuario staff (admin/operador)
    const [usuarios] = await db.query(
      'SELECT usuario_id, correo, contrasena, password_hash, rol FROM usuarios WHERE correo = ?',
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ ok: false, msg: "Credenciales inválidas" });
    }

    const usuario = usuarios[0];
    let valid = false;

    if (usuario.password_hash && usuario.password_hash.length > 0) {
      // Ya migrado a bcrypt
      valid = await bcrypt.compare(password, usuario.password_hash);
    } else {
      // Aún en texto plano (compatibilidad)
      valid = password === usuario.contrasena;
    }

    if (!valid) {
      return res.status(401).json({ ok: false, msg: "Credenciales inválidas" });
    }

    const token = signToken({
      user_type: "usuario",
      id: usuario.usuario_id,
      email: usuario.correo,
      rol: usuario.rol || "admin",
    });

    res.json({
      ok: true,
      user_type: "usuario",
      rol: usuario.rol || "admin",
      token,
    });
  } catch (err) {
    console.error("authLogin error", err);
    res.status(500).json({ ok: false, msg: "Error interno" });
  }
};

module.exports = {
  authLogin,
};
