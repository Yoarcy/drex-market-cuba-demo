import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

const SESSION_COOKIE = "drex_session";
const SESSION_SECRET = process.env.AUTH_SECRET || "drex-local-auth-secret-change-before-production";

type SessionPayload = { userId: string; role: UserRole; email: string; exp: number };

function b64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function sign(payload: string) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [kind, salt, hash] = storedHash.split("$");
  if (kind !== "scrypt" || !salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const saved = Buffer.from(hash, "hex");
  return saved.length === candidate.length && crypto.timingSafeEqual(saved, candidate);
}

export function createSessionToken(payload: Omit<SessionPayload, "exp">) {
  const data: SessionPayload = { ...payload, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 };
  const encoded = b64url(JSON.stringify(data));
  return `${encoded}.${sign(encoded)}`;
}

export function readSessionToken(token?: string): SessionPayload | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || sign(encoded) !== signature) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: { id: string; role: UserRole; email: string }) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionToken({ userId: user.id, role: user.role, email: user.email }), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const jar = await cookies();
  const session = readSessionToken(jar.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.userId }, select: { id: true, name: true, email: true, phone: true, role: true, status: true } });
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/admin/login");
  return user;
}
