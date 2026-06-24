import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
      <section className="demo-card p-8">
        <span className="badge-demo">Registro comprador demo</span>
        <h1 className="mt-4 text-4xl font-black text-slate-950">Crear cuenta</h1>
        <p className="mt-2 text-slate-600">Para verse como producto real, el comprador debe registrarse y loguearse antes del flujo completo.</p>
        <form className="mt-8 grid gap-4">
          <label className="space-y-2"><span>Nombre completo</span><input placeholder="Cliente Demo" /></label>
          <label className="space-y-2"><span>Email</span><input type="email" placeholder="cliente@demo.local" /></label>
          <label className="space-y-2"><span>Teléfono</span><input placeholder="+00 000 000 000" /></label>
          <label className="space-y-2"><span>Contraseña</span><input type="password" placeholder="Mínimo 8 caracteres demo" /></label>
          <label className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-800"><input className="mt-1 w-auto" type="checkbox" /> Acepto términos demo y confirmo que no usaré datos reales.</label>
          <input className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <Link href="/login" className="btn-primary">Registrar cuenta demo</Link>
        </form>
      </section>
    </main>
  );
}
