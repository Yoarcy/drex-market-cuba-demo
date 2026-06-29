import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const requiredRole = body.requiredRole ? String(body.requiredRole).toUpperCase() : "";

  if (!email || !password) return NextResponse.json({ error: "Pon email y contraseña." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Email o contraseña incorrectos." }, { status: 401 });
  }
  if (user.status === "SUSPENDED") return NextResponse.json({ error: "Usuario suspendido." }, { status: 403 });
  if (requiredRole === "ADMIN" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Esta cuenta no tiene permiso de administrador." }, { status: 403 });
  }

  await setSessionCookie(user);
  return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
