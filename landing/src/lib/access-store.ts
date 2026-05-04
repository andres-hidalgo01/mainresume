import fs from "node:fs";
import path from "node:path";

export type AccessRequest = {
  id: string;
  email: string;
  company?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  createdAt: string;
};

export type AccessToken = {
  id: string;
  email: string;
  tokenHash: string;
  expiresAt: string;
  usedAt?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  createdAt: string;
};

export type SessionRecord = {
  id: string;
  email: string;
  sessionHash: string;
  expiresAt: string;
  ip?: string | null;
  userAgent?: string | null;
  createdAt: string;
};

export type AuditLog = {
  id: string;
  email?: string | null;
  event: string;
  ip?: string | null;
  userAgent?: string | null;
  meta?: Record<string, unknown> | null;
  createdAt: string;
};

export type RateLimitRecord = {
  id: string;
  key: string;
  action: string;
  createdAt: string;
};

type LocalDb = {
  accessRequests: AccessRequest[];
  accessTokens: AccessToken[];
  sessions: SessionRecord[];
  auditLogs: AuditLog[];
  rateLimits: RateLimitRecord[];
};

const dataDir = path.join(process.cwd(), ".data");
const dbPath = path.join(dataDir, "access-db.json");

const emptyDb: LocalDb = {
  accessRequests: [],
  accessTokens: [],
  sessions: [],
  auditLogs: [],
  rateLimits: [],
};

function ensureDb() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(emptyDb, null, 2), "utf-8");
  }
}

export function readDb(): LocalDb {
  ensureDb();

  const raw = fs.readFileSync(dbPath, "utf-8");

  try {
    const parsed = JSON.parse(raw) as LocalDb;

    return {
      accessRequests: parsed.accessRequests || [],
      accessTokens: parsed.accessTokens || [],
      sessions: parsed.sessions || [],
      auditLogs: parsed.auditLogs || [],
      rateLimits: parsed.rateLimits || [],
    };
  } catch {
    return emptyDb;
  }
}

export function writeDb(db: LocalDb) {
  ensureDb();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
}
