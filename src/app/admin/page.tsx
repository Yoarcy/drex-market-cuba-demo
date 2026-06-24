"use client";

import { useMemo, useState } from "react";
import { IntelligencePanel } from "@/components/IntelligencePanel";
import { analytics, demoOrders, formatMoney, products, providers, walletTransactions } from "@/lib/demo-data";

const menu = [
  "Dashboard",
  "Municipios",
  "Proveedores",
  "Productos",
  "Pedidos",
  "Billeteras",
  "Reportes",
];

const metricCards = [
  ["Total vendido demo", analytics.totalSales],
  ["Ganancia bruta demo", analytics.grossProfit],
  ["Créditos/saldo cargado", analytics.walletLoaded],
  ["Saldo circulando", analytics.circulatingBalance],
];

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <label className="space-y-2">
      <span>{label}</span>
      <input type={type} placeholder={placeholder} />
    </label>
  );
}

export default function AdminPage() {
  const [section, setSection] = useState("Dashboard");
  const [selectedProvider, setSelectedProvider] = useState(providers[0].id);
  const activeProvider = useMemo(
    () => providers.find((provider) => provider.id === selectedProvider) ?? providers[0],
    [selectedProvider],
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="badge-demo">Admin demo</span>
          <h1 className="mt-4 text-4xl font-black text-slate-950">Dashboard administrativo</h1>
          <p className="mt-2 text-slate-600">
            Panel separado de la tienda pública. El menú izquierdo controla qué módulo administrativo se muestra.
          </p>
        </div>
        <div className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white">Acceso admin demo · admin@demo.local</div>
      </div>

      <section className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="demo-card h-fit p-4">
          {menu.map((item) => (
            <button
              key={item}
              onClick={() => setSection(item)}
              className={`mb-2 w-full rounded-2xl px-4 py-3 text-left text-sm font-black transition ${
                section === item ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              {item}
            </button>
          ))}
          <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-xs font-bold text-amber-800">
            El usuario público no ve este menú. Esta sección requiere rol ADMIN.
          </div>
        </aside>

        <div className="space-y-8">
          {section === "Dashboard" && (
            <>
              <section className="grid gap-4 md:grid-cols-4">
                {metricCards.map(([label, value]) => (
                  <div key={label as string} className="demo-card p-5">
                    <p className="text-sm font-bold text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-black text-emerald-700">{formatMoney(value as number)}</p>
                  </div>
                ))}
              </section>
              <section className="grid gap-8 lg:grid-cols-2">
                <div className="demo-card p-6">
                  <h2 className="text-2xl font-black">Resumen comercial</h2>
                  <div className="mt-5 space-y-3 text-sm font-semibold text-slate-700">
                    <p>Producto más vendido: <b>{analytics.bestSeller}</b></p>
                    <p>Producto más rentable: <b>{analytics.mostProfitable}</b></p>
                    <p>Proveedor con más ventas: <b>{analytics.topProvider}</b></p>
                    <p>Municipio con más pedidos: <b>{analytics.topMunicipality}</b></p>
                    <p>Riesgo de agotamiento: <b>{analytics.predictedStockout}</b></p>
                  </div>
                </div>
                <div className="demo-card p-6">
                  <h2 className="text-2xl font-black">Separación de roles</h2>
                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    El cliente compra en la tienda pública. El administrador entra por `/admin/login` y gestiona datos operativos aquí.
                  </p>
                </div>
              </section>
            </>
          )}

          {section === "Municipios" && (
            <section className="demo-card p-6">
              <h2 className="text-2xl font-black">Municipios de Artemisa</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  "Artemisa", "Alquízar", "Bahía Honda", "Bauta", "Caimito", "Candelaria", "Guanajay", "Güira de Melena", "Mariel", "San Antonio de los Baños", "San Cristóbal",
                ].map((name) => (
                  <div key={name} className={name === "Bauta" ? "rounded-2xl border border-emerald-200 bg-emerald-50 p-4" : "rounded-2xl border border-slate-200 bg-slate-50 p-4"}>
                    <p className="font-black">{name}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-600">{name === "Bauta" ? "Disponible" : "No disponible aún"}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {section === "Proveedores" && (
            <>
              <section className="demo-card p-6">
                <h2 className="text-2xl font-black">Agregar nuevo proveedor</h2>
                <p className="mt-2 text-sm text-slate-600">Este formulario solo aparece cuando el admin selecciona Proveedores.</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Field label="Nombre proveedor" placeholder="Proveedor Bauta Alimentos" />
                  <Field label="Contacto" placeholder="Operador Demo" />
                  <Field label="Teléfono" placeholder="+53 5000 0000" />
                  <label className="space-y-2">
                    <span>Municipio operativo</span>
                    <select>
                      <option>Bauta — disponible</option>
                      <option disabled>Guanajay — no disponible aún</option>
                      <option disabled>Mariel — no disponible aún</option>
                    </select>
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span>Categoría principal</span>
                    <input placeholder="Alimentos, aseo, combos familiares..." />
                  </label>
                </div>
                <button className="btn-dark mt-5">Guardar proveedor demo</button>
              </section>

              <section className="demo-card p-6">
                <h2 className="text-2xl font-black">Lista de proveedores registrados</h2>
                <div className="mt-5 grid gap-3">
                  {providers.map((provider) => (
                    <article key={provider.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-xs font-black text-emerald-700">{provider.id}</p>
                          <h3 className="text-lg font-black text-slate-950">{provider.name}</h3>
                          <p className="text-sm font-semibold text-slate-600">{provider.category} · {provider.municipality}, {provider.province}</p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{provider.status}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}

          {section === "Productos" && (
            <>
              <section className="demo-card p-6">
                <h2 className="text-2xl font-black">Agregar nuevo producto</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Primero se selecciona el proveedor. Eso determina el municipio donde el producto estará disponible.
                </p>
                <div className="mt-5 grid gap-4">
                  <label className="space-y-2">
                    <span>Proveedor</span>
                    <select value={selectedProvider} onChange={(event) => setSelectedProvider(event.target.value)}>
                      {providers.map((provider) => (
                        <option key={provider.id} value={provider.id}>{provider.name} · {provider.municipality}</option>
                      ))}
                    </select>
                  </label>
                  <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
                    Municipio automático: {activeProvider.municipality}, {activeProvider.province}. El producto quedará disponible solo donde opera este proveedor.
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="ID automático" placeholder="PRD-BAU-0007" />
                    <Field label="Nombre identificativo" placeholder="combo-familiar-bauta" />
                    <Field label="Nombre comercial" placeholder="Combo Familiar Bauta" />
                    <Field label="Marca" placeholder="DREX Demo / marca ficticia" />
                    <Field label="Gramaje / formato" placeholder="1 kg, 500 g, combo variado..." />
                    <Field label="Foto / archivo" placeholder="combo-familiar-bauta.jpg" />
                    <Field label="Precio de compra" placeholder="31.00" type="number" />
                    <Field label="Precio de venta" placeholder="42.00" type="number" />
                  </div>
                </div>
                <button className="btn-primary mt-5">Guardar producto demo</button>
              </section>

              <section className="demo-card p-6">
                <h2 className="text-2xl font-black">Lista de productos registrados</h2>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[860px] text-left text-sm">
                    <thead className="text-slate-500"><tr><th className="py-3">ID</th><th>Producto</th><th>Proveedor</th><th>Marca</th><th>Gramaje</th><th>Compra</th><th>Venta</th><th>Imagen</th></tr></thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.slug} className="border-t border-slate-100">
                          <td className="py-4 font-black">{product.id}</td>
                          <td>{product.image} {product.name}</td>
                          <td>{product.provider}</td>
                          <td>{product.brand}</td>
                          <td>{product.weight}</td>
                          <td>{formatMoney(product.cost)}</td>
                          <td className="font-black text-emerald-700">{formatMoney(product.price)}</td>
                          <td className="text-xs text-slate-500">{product.imageFile}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {section === "Pedidos" && (
            <section className="demo-card p-6">
              <h2 className="text-2xl font-black">Pedidos recientes</h2>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="text-slate-500"><tr><th className="py-3">Orden</th><th>Beneficiario</th><th>Pago</th><th>Repartidor</th><th>Estado</th><th>Total</th></tr></thead>
                  <tbody>{demoOrders.map((order) => <tr key={order.id} className="border-t border-slate-100"><td className="py-4 font-black">{order.id}</td><td>{order.beneficiary}</td><td>{order.payment}</td><td>{order.courier}</td><td><span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">{order.status}</span></td><td className="font-black">{formatMoney(order.total)}</td></tr>)}</tbody>
                </table>
              </div>
            </section>
          )}

          {section === "Billeteras" && (
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
          )}

          {section === "Reportes" && <IntelligencePanel />}
        </div>
      </section>
    </main>
  );
}
