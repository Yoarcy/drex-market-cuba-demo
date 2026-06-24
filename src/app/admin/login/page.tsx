import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex max-w-5xl items-center justify-center px-4 py-12 lg:px-8">
      <section className="demo-card grid w-full overflow-hidden md:grid-cols-2">
        <div className="bg-gradient-to-br from-slate-950 to-emerald-800 p-8 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-100">Panel privado demo</p>
          <h1 className="mt-4 text-4xl font-black">Acceso administrativo</h1>
          <p className="mt-4 text-white/85">
            Entrada separada para operadores. Desde aquí se gestionan proveedores, productos, imágenes, precios, pedidos, repartidores, billeteras y estadísticas.
          </p>
          <div className="mt-8 rounded-2xl bg-white/15 p-4 text-sm font-semibold">
            Demo admin: admin@demo.local / demo123
          </div>
        </div>
        <form className="p-8">
          <h2 className="text-2xl font-black text-slate-950">Login admin demo</h2>
          <div className="mt-6 grid gap-4">
            <label className="space-y-2"><span>Email admin</span><input placeholder="admin@demo.local" type="email" /></label>
            <label className="space-y-2"><span>Contraseña</span><input placeholder="••••••••" type="password" /></label>
            <input className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" placeholder="honeypot" />
            <div className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">
              En producción esta ruta tendría middleware de rol ADMIN, rate limit, bloqueo de intentos y auditoría.
            </div>
            <Link href="/admin" className="btn-dark">Entrar al panel admin</Link>
            <Link href="/" className="text-center text-sm font-bold text-emerald-700">Volver a la tienda pública</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
