import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();
  const password = String(body.password || "");
  const honeypot = String(body.website || "").trim();

  if (honeypot) return NextResponse.json({ error: "Solicitud rechazada." }, { status: 400 });
  if (!name || !email || !password) return NextResponse.json({ error: "Nombre, email y contraseña son obligatorios." }, { status: 400 });
  if (!email.includes("@")) return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "La contraseña debe tener mínimo 8 caracteres." }, { status: 400 });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Ese email ya está registrado." }, { status: 409 });

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone: phone || null,
      passwordHash: hashPassword(password),
      role: "CUSTOMER",
      status: "ACTIVE",
    },
  });
  await prisma.customer.create({ data: { userId: user.id, country: "", notes: "Cuenta creada desde registro." } }).catch(() => null);
  await setSessionCookie(user);
  return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
}
