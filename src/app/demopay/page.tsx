import Link from "next/link";

export default function DemoPayPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
      <section className="demo-card overflow-hidden">
        <div className="bg-gradient-to-r from-slate-950 to-emerald-800 p-8 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-200">DemoPay</p>
          <h1 className="mt-3 text-4xl font-black">Pasarela ficticia</h1>
          <p className="mt-3 text-white/80">Modo demostración. No introduzca datos reales. Este pago es simulado.</p>
        </div>
        <div className="p-8">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">
            DemoPay no solicita números de tarjeta, no simula bancos reales y no procesa pagos reales.
          </div>
          <div className="mt-6 grid gap-3">
            <Link href="/orden/DMC-1005" className="btn-primary">Pago aprobado demo</Link>
            <Link href="/checkout" className="rounded-full bg-red-50 px-5 py-4 text-center font-black text-red-700 transition hover:bg-red-100">Pago rechazado demo</Link>
            <Link href="/mis-pedidos" className="rounded-full bg-slate-100 px-5 py-4 text-center font-black text-slate-700 transition hover:bg-slate-200">Dejar pago pendiente demo</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
