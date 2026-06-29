import { LoginForm } from "@/components/AuthForms";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex max-w-5xl items-center justify-center px-4 py-12 lg:px-8">
      <section className="demo-card grid w-full overflow-hidden md:grid-cols-2">
        <div className="bg-gradient-to-br from-slate-950 to-emerald-800 p-8 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-100">Panel privado</p>
          <h1 className="mt-4 text-4xl font-black">Acceso administrativo</h1>
          <p className="mt-4 text-white/85">
            Entrada separada para operadores. Desde aquí se gestionan proveedores, productos, imágenes, precios, pedidos, repartidores, billeteras y estadísticas.
          </p>
          <div className="mt-8 rounded-2xl bg-white/15 p-4 text-sm font-semibold">
            Acceso inicial: admin@demo.local / demo123
          </div>
        </div>
        <LoginForm mode="admin" />
      </section>
    </main>
  );
}
