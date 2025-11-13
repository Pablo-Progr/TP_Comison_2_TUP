// controllers/auth.controller.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "dev-secret", {
    expiresIn: "12h",
  });
}

exports.authLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ ok: false, msg: "Email y password son requeridos" });
    }

    // 1) Intentar como socio (bcrypt obligado)
    const socio = await prisma.socios.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (socio) {
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
    const usuario = await prisma.usuarios.findFirst({
      where: { correo: email },
      select: {
        usuario_id: true,
        correo: true,
        contrasena: true,
        password_hash: true,
        rol: true,
      },
    });

    if (!usuario) {
      return res.status(401).json({ ok: false, msg: "Credenciales inválidas" });
    }

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
