import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto flex max-w-5xl items-center justify-center px-4 py-12 lg:px-8">
      <section className="demo-card grid w-full overflow-hidden md:grid-cols-2">
        <div className="bg-gradient-to-br from-emerald-600 to-sky-600 p-8 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-100">Acceso seguro demo</p>
          <h1 className="mt-4 text-4xl font-black">Entrar a DREX Market</h1>
          <p className="mt-4 text-white/85">Registro/login con apariencia real: sesión, roles, validación, anti-spam, anti-bot y bloqueo por intentos para el MVP conectado.</p>
          <div className="mt-8 rounded-2xl bg-white/15 p-4 text-sm font-semibold">Demo admin: admin@demo.local / demo123<br/>Demo cliente: cliente@demo.local / demo123</div>
        </div>
        <form className="p-8">
          <h2 className="text-2xl font-black text-slate-950">Login demo</h2>
          <div className="mt-6 grid gap-4">
            <label className="space-y-2"><span>Email</span><input placeholder="cliente@demo.local" type="email" /></label>
            <label className="space-y-2"><span>Contraseña</span><input placeholder="••••••••" type="password" /></label>
            <input className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" placeholder="No llenar: honeypot anti-bot" />
            <div className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-600">Protecciones planificadas: hash de contraseña, rate limit, bloqueo temporal, honeypot y verificación demo.</div>
            <Link href="/catalogo" className="btn-primary">Entrar como cliente</Link>
            <Link href="/admin" className="btn-dark">Entrar como admin</Link>
            <Link href="/registro" className="text-center text-sm font-bold text-emerald-700">Crear cuenta demo</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
