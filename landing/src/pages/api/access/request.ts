import type { APIRoute } from "astro";
import {
  createAccessToken,
  hitRateLimit,
  isRateLimited,
  isValidEmail,
  logEvent,
  storeAccessRequest,
} from "../../../lib/security";
import { sendMagicLinkEmail } from "../../../lib/mailer";

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const ip = clientAddress || "unknown";
    const userAgent = request.headers.get("user-agent") || "";

    const body = await request.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const company = String(body.company || "").trim();

    if (!email || !isValidEmail(email)) {
      logEvent({
        email,
        event: "request_invalid_email",
        ip,
        userAgent,
      });

      return new Response(
        JSON.stringify({
          ok: false,
          error: "Debes ingresar un correo válido.",
        }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        },
      );
    }

    const rateKey = `${ip}:${email}`;

    if (isRateLimited(rateKey, "request_access")) {
      logEvent({
        email,
        event: "request_blocked_rate_limit",
        ip,
        userAgent,
        meta: { rateKey },
      });

      return new Response(
        JSON.stringify({
          ok: false,
          error: "Demasiados intentos. Intenta más tarde.",
        }),
        {
          status: 429,
          headers: { "content-type": "application/json" },
        },
      );
    }

    hitRateLimit(rateKey, "request_access");

    storeAccessRequest({
      email,
      company,
      ip,
      userAgent,
    });

    const token = createAccessToken({
      email,
      ip,
      userAgent,
    });

    const origin = import.meta.env.APP_ORIGIN || new URL(request.url).origin;
    const magicLink = `${origin}/auth/verify?token=${encodeURIComponent(
      token.rawToken,
    )}`;

    const enableTestMagicLink =
      import.meta.env.ENABLE_TEST_MAGIC_LINK === "true";

    const hasSmtpConfig =
      Boolean(import.meta.env.SMTP_HOST) &&
      Boolean(import.meta.env.SMTP_PORT) &&
      Boolean(import.meta.env.SMTP_USER) &&
      Boolean(import.meta.env.SMTP_PASS);

    let previewUrl: string | null = null;

    /*
      En Render, mientras no tengas SMTP real, NO intentamos enviar correo.
      Si ENABLE_TEST_MAGIC_LINK=true o SMTP está vacío, devolvemos el magic link directo.
    */
    if (!enableTestMagicLink && hasSmtpConfig) {
      const mail = await sendMagicLinkEmail({
        to: email,
        link: magicLink,
        expiresAt: token.expiresAt,
      });

      previewUrl = mail.previewUrl;
    }

    const shouldReturnMagicLink = enableTestMagicLink || !hasSmtpConfig;

    logEvent({
      email,
      event: shouldReturnMagicLink
        ? "test_magic_link_generated"
        : "magic_link_sent",
      ip,
      userAgent,
      meta: {
        company,
        expiresAt: token.expiresAt,
        previewUrl,
        testMode: shouldReturnMagicLink,
      },
    });

    return new Response(
      JSON.stringify({
        ok: true,
        message: shouldReturnMagicLink
          ? "Se generó un enlace temporal de prueba."
          : "Se envió el enlace temporal al correo indicado.",
        expiresAt: token.expiresAt,
        previewUrl,
        magicLink: shouldReturnMagicLink ? magicLink : null,
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Access request error:", error);

    return new Response(
      JSON.stringify({
        ok: false,
        error: "Error interno al generar el acceso.",
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
  }
};
