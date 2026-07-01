import { demandForecast, productRecommendations } from "@/lib/demo-data";

export function IntelligencePanel() {
  const summary = [
    ["Ventas", "$242", "Total acumulado"],
    ["Ganancia estimada", "$63", "Margen bruto"],
    ["Pedidos activos", "4", "Preparando / reparto / entregados"],
    ["Riesgo stock", "2", "Productos a vigilar"],
  ];

  return (
    <section className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        {summary.map(([label, value, note]) => (
          <article key={label} className="demo-card p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black text-emerald-700">{value}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">{note}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="demo-card p-6">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-600">Motor inteligente</p>
        <h2 className="mt-3 text-2xl font-black text-slate-950">Recomendaciones comprobables</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Reglas visibles usando ventas, co-compra, tendencia semanal, stock y uso de Saldo DREX.
        </p>
        <div className="mt-5 space-y-4">
          {productRecommendations.map((block) => (
            <article key={block.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-black text-slate-950">{block.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{block.reason}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {block.products.map((product) => (
                  <span key={product} className="rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-700 shadow-sm">
                    {product}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="demo-card p-6">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-orange-600">Analítica predictiva</p>
        <h2 className="mt-3 text-2xl font-black text-slate-950">Previsión de demanda y agotamiento</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-3">Producto</th>
                <th>7 días</th>
                <th>Tendencia</th>
                <th>Stock</th>
                <th>Días restantes</th>
                <th>Riesgo</th>
                <th>Acción sugerida</th>
              </tr>
            </thead>
            <tbody>
              {demandForecast.map((item) => (
                <tr key={item.productSlug} className="border-t border-slate-100">
                  <td className="py-4 font-black text-slate-900">{item.productName}</td>
                  <td>{item.last7Days}</td>
                  <td className={item.trend >= 0 ? "font-bold text-emerald-700" : "font-bold text-red-600"}>{item.trend >= 0 ? "+" : ""}{item.trend}</td>
                  <td>{item.stock}</td>
                  <td>{item.daysToStockout}</td>
                  <td>
                    <span className={
                      item.risk === "Alto"
                        ? "rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700"
                        : item.risk === "Medio"
                          ? "rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700"
                          : "rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700"
                    }>
                      {item.risk}
                    </span>
                  </td>
                  <td className="text-slate-600">{item.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 rounded-2xl bg-sky-50 p-4 text-sm font-semibold text-sky-800">
          Fórmula visible: promedio diario = ventas últimos 7 días / 7. Días a agotarse = stock / promedio diario. Proyección = ventas actuales + 60% de la tendencia semanal.
        </div>
      </div>
      </div>
    </section>
  );
}
