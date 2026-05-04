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
    subject: "Acceso temporal al CV privado",
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:620px;margin:auto">
        <h2>Acceso temporal</h2>
        <p>Se solicitó acceso privado para visualizar contenido restringido.</p>
        <p><strong>Duración del enlace:</strong> ${ttlLabel}</p>
        <p><strong>Válido hasta:</strong> ${prettyDate}</p>
        <p>Haz clic en el siguiente enlace:</p>
        <p><a href="${params.link}">${params.link}</a></p>
        <p>Si no solicitaste este acceso, ignora este correo.</p>
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
