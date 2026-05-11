const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const enviarEmailActivacion = async ({ destinatario, nombre, token }) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const enlace = `${frontendUrl}/activar/${token}`;

  await transporter.sendMail({
    from: `"DotSet" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: 'Activa tu cuenta en DotSet',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px;background:#f9f9f9;border-radius:12px;">
        <h2 style="color:#302b63;">Hola, ${nombre}</h2>
        <p style="color:#444;line-height:1.6;">
          El administrador te ha creado una cuenta en <strong>DotSet</strong>.
          Haz clic en el botón de abajo para activar tu cuenta y establecer tu contraseña.
        </p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${enlace}"
             style="background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:14px 32px;
                    border-radius:8px;text-decoration:none;font-weight:bold;font-size:1rem;">
            Activar mi cuenta
          </a>
        </div>
        <p style="color:#888;font-size:0.85rem;">
          Este enlace expira en <strong>48 horas</strong>. Si no lo usas a tiempo, contacta al administrador.
        </p>
        <p style="color:#aaa;font-size:0.8rem;">
          Si no esperabas este correo, ignóralo.
        </p>
      </div>
    `,
  });
};

const enviarEmailReset = async ({ destinatario, nombre, token }) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const enlace = `${frontendUrl}/reset/${token}`;

  await transporter.sendMail({
    from: `"DotSet" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: 'Restablecer contraseña en DotSet',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px;background:#f9f9f9;border-radius:12px;">
        <h2 style="color:#302b63;">Hola, ${nombre}</h2>
        <p style="color:#444;line-height:1.6;">
          Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>DotSet</strong>.
          Haz clic en el botón de abajo para elegir una nueva contraseña.
        </p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${enlace}"
             style="background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:14px 32px;
                    border-radius:8px;text-decoration:none;font-weight:bold;font-size:1rem;">
            Restablecer contraseña
          </a>
        </div>
        <p style="color:#888;font-size:0.85rem;">
          Este enlace expira en <strong>2 horas</strong>. Si no solicitaste esto, ignora este correo.
        </p>
      </div>
    `,
  });
};

module.exports = { enviarEmailActivacion, enviarEmailReset };
