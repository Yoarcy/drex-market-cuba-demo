"use client";

import { useState } from "react";
import Link from "next/link";

type Mode = "admin" | "client";

export function LoginForm({ mode = "client" }: { mode?: Mode }) {
  const [email, setEmail] = useState(mode === "admin" ? "admin@demo.local" : "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, requiredRole: mode === "admin" ? "ADMIN" : undefined }),
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "No se pudo iniciar sesión.");
      return;
    }
    window.location.href = mode === "admin" ? "/admin" : "/catalogo";
  }

  return (
    <form onSubmit={submit} className={mode === "admin" ? "p-8" : "login-form-demo"}>
      {mode === "admin" ? <h2 className="text-2xl font-black text-slate-950">Login admin</h2> : null}
      <div className={mode === "admin" ? "mt-6 grid gap-4" : "contents"}>
        <label className="space-y-2"><span>Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={mode === "admin" ? "admin@demo.local" : "tu@email.com"} type="email" autoComplete="email" /></label>
        <label className="space-y-2"><span>Contraseña</span><input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" autoComplete="current-password" /></label>
        <input className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" placeholder="honeypot" />
        {error ? <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div> : null}
        <button type="submit" disabled={loading} className={mode === "admin" ? "btn-dark" : "btn-primary login-main-button"}>{loading ? "Entrando..." : mode === "admin" ? "Entrar al panel admin" : "Entrar"}</button>
        {mode === "admin" ? <Link href="/" className="text-center text-sm font-bold text-emerald-700">Volver a la tienda pública</Link> : <Link href="/registro" className="register-link">Crear cuenta</Link>}
      </div>
    </form>
  );
}

export function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", website: "", terms: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function setField(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!form.terms) {
      setError("Acepta los términos para crear la cuenta.");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "No se pudo crear la cuenta.");
      return;
    }
    window.location.href = "/catalogo";
  }

  return (
    <form onSubmit={submit} className="mt-8 grid gap-4">
      <label className="space-y-2"><span>Nombre completo</span><input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Nombre y apellidos" autoComplete="name" /></label>
      <label className="space-y-2"><span>Email</span><input value={form.email} onChange={(e) => setField("email", e.target.value)} type="email" placeholder="tu@email.com" autoComplete="email" /></label>
      <label className="space-y-2"><span>Teléfono</span><input value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+53 ..." autoComplete="tel" /></label>
      <label className="space-y-2"><span>Contraseña</span><input value={form.password} onChange={(e) => setField("password", e.target.value)} type="password" placeholder="Mínimo 8 caracteres" autoComplete="new-password" /></label>
      <label className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-800"><input checked={form.terms} onChange={(e) => setField("terms", e.target.checked)} className="mt-1 w-auto" type="checkbox" /> Acepto términos y confirmo que mis datos son correctos.</label>
      <input value={form.website} onChange={(e) => setField("website", e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {error ? <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div> : null}
      <button type="submit" disabled={loading} className="btn-primary">{loading ? "Creando cuenta..." : "Crear cuenta"}</button>
    </form>
  );
}
