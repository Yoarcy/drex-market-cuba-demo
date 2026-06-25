import Link from "next/link";
import { MunicipalitySelector } from "@/components/MunicipalitySelector";
import { products, formatMoney } from "@/lib/demo-data";

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden px-4 py-14 md:py-[76px] lg:px-8"><div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl"/><div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl"/><div className="relative mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div>
          <span className="badge-demo">Marketplace hiperlocal · Artemisa / Bauta</span>
          <h1 className="mt-5 max-w-3xl text-[34px] font-extrabold leading-[1.08] tracking-[-0.04em] text-slate-950 md:text-[52px] md:leading-[1.02]">
            Compra demo para familiares en Cuba con proveedores y reparto por municipio.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Plataforma demostrativa de portafolio: e-commerce, carrito, login, DemoPay, Saldo DREX tipo débito, órdenes, proveedores, repartidores, admin y analítica comercial.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/catalogo" className="btn-primary">Explorar Bauta</Link>
            <Link href="/login" className="btn-dark">Entrar o registrarme</Link>
          </div>
          <p className="mt-5 text-sm font-semibold text-slate-500">No vende productos reales. No procesa pagos reales. No use datos personales reales.</p>
        </div>
        <div className="demo-card overflow-hidden p-4">
          <div className="rounded-[1.4rem] bg-gradient-to-br from-emerald-500 via-sky-500 to-orange-400 p-6 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.3em] opacity-90">Vista demo</p>
            <h2 className="mt-3 text-3xl font-black">Compra demo para Bauta</h2>
            <p className="mt-2 text-white/85">Catálogo local · Beneficiario en Cuba · DemoPay o Saldo DREX</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {products.slice(0, 4).map((product) => (
                <div key={product.slug} className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                  <div className="text-4xl">{product.image}</div>
                  <p className="mt-2 font-bold">{product.name}</p>
                  <p className="text-sm text-white/80">{formatMoney(product.price)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div></section>

      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <MunicipalitySelector />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Municipio activo", "Bauta"],
            ["Pago", "DemoPay"],
            ["Billetera", "Saldo DREX"],
            ["Entrega", "Reparto local"],
          ].map(([label, value]) => (
            <div key={label} className="demo-card p-[18px]">
              <p className="text-sm font-bold text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="demo-card p-[18px]">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-600">Recomendaciones para el cliente</p>
          <h2 className="mt-3 text-2xl font-black text-slate-950">Productos sugeridos según compras demo</h2>
          <p className="mt-2 text-slate-600">La tienda pública solo muestra recomendaciones útiles para comprar. Las estadísticas internas quedan reservadas al panel admin.</p>
        </div>
      </section>
    </main>
  );
}
