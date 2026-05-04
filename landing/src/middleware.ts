import type { MiddlewareHandler } from 'astro';
import { logEvent, validateSession } from './lib/security';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const pathname = context.url.pathname;

  if (!pathname.startsWith('/private')) {
    return next();
  }

  const ip = context.clientAddress || 'unknown';
  const userAgent = context.request.headers.get('user-agent') || '';
  const sessionCookie = context.cookies.get('private_session')?.value || null;

  const session = validateSession(sessionCookie);

  if (!session) {
    logEvent({
      event: 'private_access_denied_or_expired',
      ip,
      userAgent,
      meta: {
        pathname,
      },
    });

    return context.redirect('/access?expired=1');
  }

  context.locals.user = {
    email: session.email,
    expiresAt: session.expiresAt,
  };

  const response = await next();

  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
};