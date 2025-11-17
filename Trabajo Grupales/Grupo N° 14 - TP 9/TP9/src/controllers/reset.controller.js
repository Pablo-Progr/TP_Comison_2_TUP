// controllers/reset.controller.js
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const db = require("../config/DB");
const { sendMail } = require("../services/email.service");

const EXP_MIN = Number(process.env.RESET_TOKEN_EXP_MIN || 60);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

async function findUserByEmail(email) {
  // Buscamos primero socio
  const [socios] = await db.query(
    'SELECT id, email FROM socios WHERE email = ?',
    [email]
  );

  if (socios.length > 0) {
    return {
      user_type: "socio",
      user_id: socios[0].id,
      email: socios[0].email,
    };
  }

  // Luego usuario staff
  const [usuarios] = await db.query(
    'SELECT usuario_id, correo FROM usuarios WHERE correo = ?',
    [email]
  );

  if (usuarios.length > 0) {
    return {
      user_type: "usuario",
      user_id: usuarios[0].usuario_id,
      email: usuarios[0].correo,
    };
  }

  return null;
}

const requestReset = async (req, res) => {
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

    await db.query(
      'INSERT INTO password_resets (user_type, user_id, email, token, expires_at) VALUES (?, ?, ?, ?, ?)',
      [user.user_type, user.user_id, user.email, token, expiresAt]
    );

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

const confirmReset = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ ok: false, msg: "token y newPassword son requeridos" });
    }

    const [resets] = await db.query(
      'SELECT id, user_type, user_id, email, expires_at, used_at FROM password_resets WHERE token = ?',
      [token]
    );

    if (resets.length === 0) {
      return res.status(400).json({ ok: false, msg: "Token inválido" });
    }

    const pr = resets[0];

    if (pr.used_at) {
      return res.status(400).json({ ok: false, msg: "Token ya utilizado" });
    }

    if (new Date(pr.expires_at) < new Date()) {
      return res.status(400).json({ ok: false, msg: "Token expirado" });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(newPassword, saltRounds);

    if (pr.user_type === "socio") {
      await db.query(
        'UPDATE socios SET password = ? WHERE id = ?',
        [hash, pr.user_id]
      );
    } else {
      // Para usuarios staff, usar password_hash
      await db.query(
        'UPDATE usuarios SET password_hash = ?, contrasena = ? WHERE usuario_id = ?',
        [hash, '', pr.user_id]
      );
    }

    await db.query(
      'UPDATE password_resets SET used_at = NOW() WHERE id = ?',
      [pr.id]
    );

    res.json({ ok: true, msg: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error("confirmReset error", err);
    res.status(500).json({ ok: false, msg: "Error interno" });
  }
};

module.exports = {
  requestReset,
  confirmReset,
};
