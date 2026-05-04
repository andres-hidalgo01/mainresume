import crypto from "node:crypto";
import { readDb, writeDb } from "./access-store";

const ACCESS_TOKEN_TTL_MINUTES = Number(
  import.meta.env.ACCESS_TOKEN_TTL_MINUTES || 30,
);

const SESSION_TTL_HOURS = Number(import.meta.env.SESSION_TTL_HOURS || 8);

const MAX_REQUESTS_PER_WINDOW = Number(
  import.meta.env.MAX_REQUESTS_PER_WINDOW || 5,
);
const RATE_LIMIT_WINDOW_MINUTES = Number(
  import.meta.env.RATE_LIMIT_WINDOW_MINUTES || 30,
);

export function nowIso() {
  return new Date().toISOString();
}

export function randomId() {
  return crypto.randomUUID();
}

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60_000);
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function logEvent(params: {
  email?: string | null;
  event: string;
  ip?: string | null;
  userAgent?: string | null;
  meta?: Record<string, unknown> | null;
}) {
  const db = readDb();

  db.auditLogs.push({
    id: randomId(),
    email: params.email || null,
    event: params.event,
    ip: params.ip || null,
    userAgent: params.userAgent || null,
    meta: params.meta || null,
    createdAt: nowIso(),
  });

  writeDb(db);
}

export function isRateLimited(key: string, action: string) {
  const db = readDb();
  const cutoff = Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000;

  const attempts = db.rateLimits.filter((item) => {
    return (
      item.key === key &&
      item.action === action &&
      new Date(item.createdAt).getTime() >= cutoff
    );
  });

  return attempts.length >= MAX_REQUESTS_PER_WINDOW;
}

export function hitRateLimit(key: string, action: string) {
  const db = readDb();

  db.rateLimits.push({
    id: randomId(),
    key,
    action,
    createdAt: nowIso(),
  });

  writeDb(db);
}

export function storeAccessRequest(params: {
  email: string;
  company?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}) {
  const db = readDb();

  db.accessRequests.push({
    id: randomId(),
    email: params.email,
    company: params.company || null,
    ip: params.ip || null,
    userAgent: params.userAgent || null,
    createdAt: nowIso(),
  });

  writeDb(db);
}

export function createAccessToken(params: {
  email: string;
  ip?: string | null;
  userAgent?: string | null;
}) {
  const db = readDb();

  const rawToken = randomToken(24);
  const tokenHash = sha256(rawToken);
  const createdAt = new Date();
  const expiresAt = addMinutes(
    createdAt,
    ACCESS_TOKEN_TTL_MINUTES,
  ).toISOString();

  db.accessTokens.push({
    id: randomId(),
    email: params.email,
    tokenHash,
    expiresAt,
    usedAt: null,
    ip: params.ip || null,
    userAgent: params.userAgent || null,
    createdAt: createdAt.toISOString(),
  });

  writeDb(db);

  return {
    rawToken,
    expiresAt,
  };
}

export function consumeAccessToken(rawToken: string) {
  const db = readDb();
  const tokenHash = sha256(rawToken);

  const token = db.accessTokens.find((item) => item.tokenHash === tokenHash);

  if (!token) {
    return { ok: false as const, reason: "invalid" as const };
  }

  if (token.usedAt) {
    return { ok: false as const, reason: "used" as const, email: token.email };
  }

  if (new Date(token.expiresAt).getTime() < Date.now()) {
    return {
      ok: false as const,
      reason: "expired" as const,
      email: token.email,
    };
  }

  token.usedAt = nowIso();
  writeDb(db);

  return {
    ok: true as const,
    email: token.email,
  };
}

export function createSession(params: {
  email: string;
  ip?: string | null;
  userAgent?: string | null;
}) {
  const db = readDb();

  const rawSession = randomToken(32);
  const sessionHash = sha256(rawSession);
  const createdAt = new Date();
  const expiresAt = addHours(createdAt, SESSION_TTL_HOURS).toISOString();

  db.sessions.push({
    id: randomId(),
    email: params.email,
    sessionHash,
    expiresAt,
    ip: params.ip || null,
    userAgent: params.userAgent || null,
    createdAt: createdAt.toISOString(),
  });

  writeDb(db);

  return {
    rawSession,
    expiresAt,
  };
}

export function validateSession(rawSession?: string | null) {
  if (!rawSession) return null;

  const db = readDb();
  const sessionHash = sha256(rawSession);

  const session = db.sessions.find((item) => item.sessionHash === sessionHash);

  if (!session) return null;

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    return null;
  }

  return session;
}
