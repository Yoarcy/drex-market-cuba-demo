import { MunicipalitySelector } from "@/components/MunicipalitySelector";

export default function Home() {
  return (
    <main>
      <section className="hero-shell relative overflow-hidden px-4 py-14 md:py-[76px] lg:px-8"><div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl"/><div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl"/><div className="relative mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div className="hero-copy-card">
          <div className="hero-truck-lane" aria-hidden="true">
            <div className="truck-rig">
              <img className="truck-part truck-smoke" src="/hero-truck/optimized/03_smoke_corrected.png" alt="" />
              <img className="truck-part truck-backfire" src="/hero-truck/optimized/04_backfire_corrected.png" alt="" />
              <img className="truck-part truck-body" src="/hero-truck/optimized/01_truck_body.png" alt="" />
              <img className="truck-part truck-cargo" src="/hero-truck/optimized/05_cargo.png" alt="" />
              <img className="truck-part truck-wheel truck-wheel-back" src="/hero-truck/optimized/02_wheel.png" alt="" />
              <img className="truck-part truck-wheel truck-wheel-front" src="/hero-truck/optimized/02_wheel.png" alt="" />
            </div>
          </div>
          <h1 className="mt-5 max-w-3xl text-[34px] font-extrabold leading-[1.08] tracking-[-0.04em] text-slate-950 md:text-[52px] md:leading-[1.02]">
            Compra demo para familiares en Cuba con proveedores y reparto por municipio.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Plataforma demostrativa de portafolio: e-commerce, carrito, login, DemoPay, Saldo DREX tipo débito, órdenes, proveedores, repartidores, admin y analítica comercial.
          </p>
          <p className="mt-5 text-sm font-semibold text-slate-500">No vende productos reales. No procesa pagos reales. No use datos personales reales.</p>
        </div>
        <div className="demo-card hero-carousel-card overflow-hidden p-0">
          <div className="hero-carousel" aria-label="Tira automática de imágenes DREX Market">
            <div className="hero-carousel-track">
              <img src="/hero-strip/hero-01.png" alt="DREX Market producto 1" />
              <img src="/hero-strip/hero-02.png" alt="DREX Market producto 2" />
              <img src="/hero-strip/hero-03.png" alt="DREX Market producto 3" />
              <img src="/hero-strip/hero-04.png" alt="DREX Market producto 4" />
            </div>
            <div className="hero-carousel-dots"><span /><span /><span /><span /></div>
          </div>
        </div>
      </div></section>

      <section id="ubicacion" className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
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
