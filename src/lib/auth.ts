import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SESSION_COOKIE = "sb_session_token";
const SECRET = process.env.SESSION_SECRET || "default-secret-change-in-production";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, key] = stored.split(":");
    if (!salt || !key) return false;
    const hashBuffer = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, "hex");
    return crypto.timingSafeEqual(hashBuffer, keyBuffer);
  } catch {
    return false;
  }
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  isSuperAdmin: boolean;
  tenantId?: string;
  role?: string;
}

export function signToken(payload: SessionPayload): string {
  const data = JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(data);
  const signature = hmac.digest("hex");
  return Buffer.from(`${data}.${signature}`).toString("base64url");
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const lastDot = decoded.lastIndexOf(".");
    if (lastDot === -1) return null;
    const dataStr = decoded.substring(0, lastDot);
    const signature = decoded.substring(lastDot + 1);

    const hmac = crypto.createHmac("sha256", SECRET);
    hmac.update(dataStr);
    const expectedSig = hmac.digest("hex");

    if (signature !== expectedSig) return null;

    const data = JSON.parse(dataStr);
    if (Date.now() > data.exp) return null;

    return data as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = verifyToken(token);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      memberships: {
        include: {
          tenant: true,
        },
      },
    },
  });

  return user;
}

export async function getCurrentTenant(preferredTenantId?: string) {
  const user = await getCurrentUser();
  if (!user || user.memberships.length === 0) return null;

  if (preferredTenantId) {
    const membership = user.memberships.find((m) => m.tenantId === preferredTenantId);
    if (membership) return { tenant: membership.tenant, role: membership.role, user };
  }

  // Default to first membership
  const defaultMembership = user.memberships[0];
  return {
    tenant: defaultMembership.tenant,
    role: defaultMembership.role,
    user,
  };
}

export { SESSION_COOKIE };
