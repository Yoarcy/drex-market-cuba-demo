import { IntelligencePanel } from "@/components/IntelligencePanel";
import { analytics, demoOrders, formatMoney, products, walletTransactions } from "@/lib/demo-data";

const metricCards = [
  ["Total vendido demo", analytics.totalSales],
  ["Ganancia bruta demo", analytics.grossProfit],
  ["Créditos/saldo cargado", analytics.walletLoaded],
  ["Saldo circulando", analytics.circulatingBalance],
];

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="badge-demo">Admin demo</span>
          <h1 className="mt-4 text-4xl font-black text-slate-950">Dashboard operacional</h1>
          <p className="mt-2 text-slate-600">Panel profesional para pedidos, municipios, proveedores, reparto, Saldo DREX y reportes.</p>
        </div>
        <div className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white">admin@demo.local</div>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        {metricCards.map(([label, value]) => (
          <div key={label as string} className="demo-card p-5">
            <p className="text-sm font-bold text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black text-emerald-700">{formatMoney(value as number)}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="demo-card h-fit p-4">
          {[
            "Dashboard", "Municipios", "Proveedores", "Productos", "Servicios", "Pedidos", "Repartidores", "Billeteras", "Liquidaciones", "Reportes",
          ].map((item) => (
            <button key={item} className="mb-2 w-full rounded-2xl px-4 py-3 text-left text-sm font-black text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700">{item}</button>
          ))}
        </aside>

        <div className="space-y-8">
          <section className="demo-card p-6">
            <h2 className="text-2xl font-black">Pedidos recientes</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="text-slate-500"><tr><th className="py-3">Orden</th><th>Beneficiario</th><th>Pago</th><th>Repartidor</th><th>Estado</th><th>Total</th></tr></thead>
                <tbody>{demoOrders.map((order) => <tr key={order.id} className="border-t border-slate-100"><td className="py-4 font-black">{order.id}</td><td>{order.beneficiary}</td><td>{order.payment}</td><td>{order.courier}</td><td><span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">{order.status}</span></td><td className="font-black">{formatMoney(order.total)}</td></tr>)}</tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <div className="demo-card p-6">
              <h2 className="text-2xl font-black">Analítica comercial</h2>
              <div className="mt-5 space-y-3 text-sm font-semibold text-slate-700">
                <p>Producto más vendido: <b>{analytics.bestSeller}</b></p>
                <p>Producto más rentable: <b>{analytics.mostProfitable}</b></p>
                <p>Proveedor con más ventas: <b>{analytics.topProvider}</b></p>
                <p>Municipio con más pedidos: <b>{analytics.topMunicipality}</b></p>
                <p>Ticket promedio por municipio: <b>{formatMoney(analytics.averageTicket)}</b></p>
                <p>Riesgo de agotamiento: <b>{analytics.predictedStockout}</b></p>
              </div>
            </div>
            <div className="demo-card p-6">
              <h2 className="text-2xl font-black">Municipios Artemisa</h2>
              <div className="mt-5 space-y-3 text-sm font-semibold">
                <p><span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Bauta activo</span></p>
                <p className="text-slate-600">Los otros 10 municipios están visibles pero desactivados hasta activar proveedores/reparto.</p>
                <p className="text-slate-600">Motor: {analytics.recommendationEngine}.</p>
              </div>
            </div>
          </section>

          <IntelligencePanel />

          <section className="demo-card p-6">
            <h2 className="text-2xl font-black">Billeteras y movimientos</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {walletTransactions.map((tx) => (
                <div key={tx.id} className="rounded-2xl border border-slate-200 p-4">
                  <p className="font-black">{tx.owner}</p>
                  <p className="text-sm text-slate-600">{tx.type} · {tx.direction}</p>
                  <p className="mt-2 text-xl font-black text-emerald-700">{formatMoney(tx.amount)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="demo-card p-6">
            <h2 className="text-2xl font-black">Productos y proveedores</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {products.map((product) => (
                <div key={product.slug} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-black">{product.image} {product.name}</p>
                  <p className="text-sm text-slate-600">{product.provider} · margen demo {formatMoney(product.price - product.cost)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
