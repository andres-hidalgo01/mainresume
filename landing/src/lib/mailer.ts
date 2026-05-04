import nodemailer from "nodemailer";

let cachedTransporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const host = import.meta.env.SMTP_HOST;
  const port = Number(import.meta.env.SMTP_PORT || 0);
  const user = import.meta.env.SMTP_USER;
  const pass = import.meta.env.SMTP_PASS;

  if (host && port && user && pass) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    return cachedTransporter;
  }

  const testAccount = await nodemailer.createTestAccount();

  cachedTransporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return cachedTransporter;
}

export async function sendMagicLinkEmail(params: {
  to: string;
  link: string;
  expiresAt: string;
}) {
  const transporter = await getTransporter();

  const expiresDate = new Date(params.expiresAt);

  const prettyDate = new Intl.DateTimeFormat("es-CR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(expiresDate);

  const ttlMinutes = Number(import.meta.env.ACCESS_TOKEN_TTL_MINUTES || 30);

  const ttlLabel =
    ttlMinutes === 60
      ? "1 hora"
      : ttlMinutes === 30
        ? "30 minutos"
        : `${ttlMinutes} minutos`;

  const info = await transporter.sendMail({
    from: import.meta.env.SMTP_FROM || "CV Privado <no-reply@localhost>",
    to: params.to,
    subject: "Acceso temporal al CV privado de Andrés Hidalgo",
    text: `
Acceso temporal al CV privado

Se solicitó acceso privado para visualizar el CV digital de Andrés Hidalgo.

Duración del enlace: ${ttlLabel}
Válido hasta: ${prettyDate}

Accede aquí:
${params.link}

Si no solicitaste este acceso, ignora este correo.
    `,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f4f4;padding:32px;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:18px;padding:32px;border:1px solid #e6e6e6;">
          
          <h1 style="margin:0 0 12px;color:#111;font-size:26px;">
            Acceso temporal al CV privado
          </h1>

          <p style="margin:0 0 22px;color:#444;font-size:15px;line-height:1.6;">
            Se solicitó acceso privado para visualizar el CV digital de 
            <strong>Andrés Hidalgo</strong>.
          </p>

          <div style="background:#f7f7f7;border-radius:14px;padding:18px 20px;margin:24px 0;">
            <p style="margin:0 0 8px;color:#222;font-size:15px;">
              <strong>Duración del enlace:</strong> ${ttlLabel}
            </p>

            <p style="margin:0;color:#222;font-size:15px;">
              <strong>Válido hasta:</strong> ${prettyDate}
            </p>
          </div>

          <p style="margin:28px 0;text-align:center;">
            <a 
              href="${params.link}" 
              style="display:inline-block;background:#111;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:bold;font-size:15px;"
            >
              Abrir CV privado
            </a>
          </p>

          <p style="margin:24px 0 8px;color:#666;font-size:13px;line-height:1.5;">
            Si el botón no funciona, copia y pega este enlace en tu navegador:
          </p>

          <p style="word-break:break-all;margin:0 0 24px;font-size:13px;">
            <a href="${params.link}" style="color:#314f8f;">
              ${params.link}
            </a>
          </p>

          <hr style="border:none;border-top:1px solid #eeeeee;margin:26px 0;" />

          <p style="margin:0;color:#777;font-size:12px;line-height:1.5;">
            Si no solicitaste este acceso, puedes ignorar este correo.
            Este enlace es temporal y de un solo uso.
          </p>
        </div>
      </div>
    `,
  });

  return {
    messageId: info.messageId,
    previewUrl: nodemailer.getTestMessageUrl(info) || null,
  };
}

export async function sendOwnerNotificationEmail(params: {
  recruiterEmail: string;
  accessAt: string;
  ip?: string | null;
  userAgent?: string | null;
}) {
  const ownerEmail = import.meta.env.OWNER_EMAIL;

  if (!ownerEmail) {
    return null;
  }

  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from: import.meta.env.SMTP_FROM || "CV Privado <no-reply@localhost>",
    to: ownerEmail,
    subject: "Acceso exitoso al CV privado",
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:620px;margin:auto">
        <h2>Acceso exitoso al CV privado</h2>
        <p><strong>Se logueó:</strong> ${params.recruiterEmail}</p>
        <p><strong>Fecha y hora:</strong> ${params.accessAt}</p>
        <p><strong>IP:</strong> ${params.ip || "N/D"}</p>
        <p><strong>Navegador:</strong> ${params.userAgent || "N/D"}</p>
      </div>
    `,
  });

  return {
    messageId: info.messageId,
    previewUrl: nodemailer.getTestMessageUrl(info) || null,
  };
}
