// controllers/reset.controller.js
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const { sendMail } = require("../services/email.service");

const EXP_MIN = Number(process.env.RESET_TOKEN_EXP_MIN || 60);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

async function findUserByEmail(email) {
  // Buscamos primero socio y luego usuario staff
  const socio = await prisma.socios.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
    },
  });

  if (socio) {
    return {
      user_type: "socio",
      user_id: socio.id,
      email: socio.email,
    };
  }

  const usuario = await prisma.usuarios.findFirst({
    where: { correo: email },
    select: {
      usuario_id: true,
      correo: true,
    },
  });

  if (usuario) {
    return {
      user_type: "usuario",
      user_id: usuario.usuario_id,
      email: usuario.correo,
    };
  }

  return null;
}

exports.requestReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ ok: false, msg: "Email es requerido" });

    const user = await findUserByEmail(email);
    if (!user) {
      // Por seguridad respondemos 200 igual (no revelamos existencia)
      return res.json({
        ok: true,
        msg: "Si el email existe, recibirás instrucciones",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = addMinutes(new Date(), EXP_MIN);

    await prisma.password_resets.create({
      data: {
        user_type: user.user_type,
        user_id: user.user_id,
        email: user.email,
        token,
        expires_at: expiresAt,
      },
    });

    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}&type=${user.user_type}`;

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2>Recuperación de contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Hacé clic en el siguiente botón para continuar (válido por ${EXP_MIN} minutos):</p>
        <p>
          <a href="${resetLink}" style="display:inline-block;padding:10px 16px;border-radius:6px;text-decoration:none;border:1px solid #eee">
            Restablecer contraseña
          </a>
        </p>
        <p>Si no fuiste vos, ignorá este mensaje.</p>
      </div>
    `;

    await sendMail({
      to: user.email,
      subject: "Restablecer contraseña",
      html,
    });

    res.json({ ok: true, msg: "Si el email existe, recibirás instrucciones" });
  } catch (err) {
    console.error("requestReset error", err);
    res.status(500).json({ ok: false, msg: "Error interno" });
  }
};

exports.confirmReset = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ ok: false, msg: "token y newPassword son requeridos" });
    }

    const pr = await prisma.password_resets.findFirst({
      where: { token },
      select: {
        id: true,
        user_type: true,
        user_id: true,
        email: true,
        expires_at: true,
        used_at: true,
      },
    });

    if (!pr) {
      return res.status(400).json({ ok: false, msg: "Token inválido" });
    }

    if (pr.used_at) {
      return res.status(400).json({ ok: false, msg: "Token ya utilizado" });
    }

    if (new Date(pr.expires_at) < new Date()) {
      return res.status(400).json({ ok: false, msg: "Token expirado" });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(newPassword, saltRounds);

    if (pr.user_type === "socio") {
      await prisma.socios.update({
        where: { id: pr.user_id },
        data: { password: hash },
      });
    } else {
      // Para usuarios staff, si ya migraste a bcrypt, usar password_hash y dejar contrasena en desuso
      await prisma.usuarios.update({
        where: { usuario_id: pr.user_id },
        data: {
          password_hash: hash,
          contrasena: "",
        },
      });
    }

    await prisma.password_resets.update({
      where: { id: pr.id },
      data: { used_at: new Date() },
    });

    res.json({ ok: true, msg: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error("confirmReset error", err);
    res.status(500).json({ ok: false, msg: "Error interno" });
  }
};
