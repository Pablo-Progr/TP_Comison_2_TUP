const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || "false") === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendMail({ to, subject, html }) {
  const from = `"${process.env.MAIL_FROM_NAME || "Soporte"}" <${
    process.env.MAIL_FROM_EMAIL
  }>`;
  return transporter.sendMail({ from, to, subject, html });
}

module.exports = { transporter, sendMail };
