"use client";

import { useMemo, useState } from "react";
import { IntelligencePanel } from "@/components/IntelligencePanel";
import { analytics, demoOrders, formatMoney, products, providers as initialProviders, walletTransactions } from "@/lib/demo-data";

type Provider = (typeof initialProviders)[number];

const menu = ["Dashboard", "Municipios", "Proveedores", "Productos", "Pedidos", "Billeteras", "Reportes"];
const metricCards = [
  ["Total vendido demo", analytics.totalSales],
  ["Ganancia bruta demo", analytics.grossProfit],
  ["Créditos/saldo cargado", analytics.walletLoaded],
  ["Saldo circulando", analytics.circulatingBalance],
];

function Field({ label, placeholder, type = "text", value, onChange }: { label: string; placeholder: string; type?: string; value?: string; onChange?: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <span>{label}</span>
      <input type={type} placeholder={placeholder} value={value} onChange={(event) => onChange?.(event.target.value)} />
    </label>
  );
}

export default function AdminPage() {
  const [section, setSection] = useState("Dashboard");
  const [providerList, setProviderList] = useState<Provider[]>(initialProviders);
  const [selectedProvider, setSelectedProvider] = useState(initialProviders[0].id);
  const [viewProvider, setViewProvider] = useState<Provider | null>(null);
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [providerSearch, setProviderSearch] = useState("");
  const [providerForm, setProviderForm] = useState({
    name: "",
    phone: "",
    altPhone: "",
    municipality: "Bauta",
    category: "Mercado",
    notes: "",
  });

  const activeProvider = useMemo(
    () => providerList.find((provider) => provider.id === selectedProvider) ?? providerList[0],
    [providerList, selectedProvider],
  );
  const filteredProviders = useMemo(() => {
    const query = providerSearch.trim().toLowerCase();
    if (!query) return providerList;
    return providerList.filter((provider) =>
      [provider.name, provider.municipality, provider.province, provider.category, provider.phone, provider.id]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [providerList, providerSearch]);

  const updateProviderField = (field: keyof typeof providerForm, value: string) => {
    setProviderForm((current) => ({ ...current, [field]: value }));
  };

  const addProvider = () => {
    if (!providerForm.name.trim()) return;
    const nextNumber = providerList.length + 1;
    const newProvider: Provider = {
      id: `PROV-BAU-${String(nextNumber).padStart(3, "0")}`,
      name: providerForm.name.trim(),
      municipality: providerForm.municipality,
      province: "Artemisa",
      category: providerForm.category,
      contact: providerForm.notes || "Sin notas",
      phone: providerForm.altPhone ? `${providerForm.phone} / Alt: ${providerForm.altPhone}` : providerForm.phone,
      status: "Activo",
    };
    setProviderList((current) => [...current, newProvider]);
    setSelectedProvider(newProvider.id);
    setViewProvider(newProvider);
    setProviderForm({ name: "", phone: "", altPhone: "", municipality: "Bauta", category: "Mercado", notes: "" });
  };

  const deleteProvider = (id: string) => {
    const filtered = providerList.filter((provider) => provider.id !== id);
    setProviderList(filtered);
    if (selectedProvider === id) setSelectedProvider(filtered[0]?.id ?? "");
    if (viewProvider?.id === id) setViewProvider(null);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="badge-demo">Admin demo</span>
          <h1 className="mt-4 text-4xl font-black text-slate-950">Dashboard administrativo</h1>
          <p className="mt-2 text-slate-600">Panel separado de la tienda pública. El menú izquierdo controla qué módulo administrativo se muestra.</p>
        </div>
        <div className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white">Acceso admin demo · admin@demo.local</div>
      </div>

      <section className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="demo-card h-fit p-4">
          {menu.map((item) => (
            <button key={item} onClick={() => setSection(item)} className={`mb-2 w-full rounded-2xl px-4 py-3 text-left text-sm font-black transition ${section === item ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"}`}>{item}</button>
          ))}
          <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-xs font-bold text-amber-800">El usuario público no ve este menú. Esta sección requiere rol ADMIN.</div>
        </aside>

        <div className="space-y-8">
          {section === "Dashboard" && <><section className="grid gap-4 md:grid-cols-4">{metricCards.map(([label, value]) => <div key={label as string} className="demo-card p-5"><p className="text-sm font-bold text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-emerald-700">{formatMoney(value as number)}</p></div>)}</section><section className="grid gap-8 lg:grid-cols-2"><div className="demo-card p-6"><h2 className="text-2xl font-black">Resumen comercial</h2><div className="mt-5 space-y-3 text-sm font-semibold text-slate-700"><p>Producto más vendido: <b>{analytics.bestSeller}</b></p><p>Producto más rentable: <b>{analytics.mostProfitable}</b></p><p>Proveedor con más ventas: <b>{analytics.topProvider}</b></p><p>Municipio con más pedidos: <b>{analytics.topMunicipality}</b></p><p>Riesgo de agotamiento: <b>{analytics.predictedStockout}</b></p></div></div><div className="demo-card p-6"><h2 className="text-2xl font-black">Separación de roles</h2><p className="mt-3 text-sm font-semibold text-slate-600">El cliente compra en la tienda pública. El administrador entra por `/admin/login` y gestiona datos operativos aquí.</p></div></section></>}

          {section === "Municipios" && <section className="demo-card p-6"><h2 className="text-2xl font-black">Municipios de Artemisa</h2><div className="mt-5 grid gap-3 md:grid-cols-3">{["Artemisa", "Alquízar", "Bahía Honda", "Bauta", "Caimito", "Candelaria", "Guanajay", "Güira de Melena", "Mariel", "San Antonio de los Baños", "San Cristóbal"].map((name) => <div key={name} className={name === "Bauta" ? "rounded-2xl border border-emerald-200 bg-emerald-50 p-4" : "rounded-2xl border border-slate-200 bg-slate-50 p-4"}><p className="font-black">{name}</p><p className="mt-1 text-sm font-semibold text-slate-600">{name === "Bauta" ? "Disponible" : "No disponible aún"}</p></div>)}</div></section>}

          {section === "Proveedores" && <>
            <section className="demo-card p-6">
              <button onClick={() => setShowProviderForm((value) => !value)} className="flex w-full items-center justify-between text-left">
                <span>
                  <span className="text-2xl font-black text-slate-950">Agregar nuevo proveedor</span>
                  <span className="mt-1 block text-sm font-semibold text-slate-600">Formulario contraído para dejar visible la lista.</span>
                </span>
                <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">{showProviderForm ? "Ocultar" : "Desplegar"}</span>
              </button>
              {showProviderForm && (
                <div className="mt-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Nombre del proveedor" placeholder="Proveedor Bauta Mercado" value={providerForm.name} onChange={(value) => updateProviderField("name", value)} />
                    <Field label="Teléfono" placeholder="+53 5000 0000" value={providerForm.phone} onChange={(value) => updateProviderField("phone", value)} />
                    <Field label="Teléfono alternativo" placeholder="+53 5000 0001" value={providerForm.altPhone} onChange={(value) => updateProviderField("altPhone", value)} />
                    <label className="space-y-2"><span>Municipio</span><select value={providerForm.municipality} onChange={(event) => updateProviderField("municipality", event.target.value)}><option>Bauta</option><option disabled>Guanajay — no disponible aún</option><option disabled>Mariel — no disponible aún</option></select></label>
                    <label className="space-y-2"><span>Categoría</span><select value={providerForm.category} onChange={(event) => updateProviderField("category", event.target.value)}><option>Mercado</option><option>Ferretería</option><option>Peletería</option><option>Aseo e higiene</option><option>Combos familiares</option></select></label>
                    <Field label="Notas" placeholder="Notas internas del proveedor demo" value={providerForm.notes} onChange={(value) => updateProviderField("notes", value)} />
                  </div>
                  <button onClick={addProvider} className="btn-dark mt-5">Guardar proveedor demo</button>
                </div>
              )}
            </section>

            {viewProvider && <section className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-6"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><p className="text-xs font-black text-emerald-700">Vista de proveedor</p><h2 className="mt-1 text-2xl font-black text-slate-950">{viewProvider.name}</h2><div className="mt-3 grid gap-2 text-sm font-semibold text-slate-700 md:grid-cols-2"><p>ID: {viewProvider.id}</p><p>Municipio: {viewProvider.municipality}, {viewProvider.province}</p><p>Categoría: {viewProvider.category}</p><p>Teléfono: {viewProvider.phone}</p><p>Estado: {viewProvider.status}</p><p>Notas: {viewProvider.contact}</p></div></div><button onClick={() => setViewProvider(null)} className="rounded-full bg-white px-4 py-2 text-sm font-black text-emerald-700">Cerrar vista</button></div></section>}

            <section className="demo-card p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-2xl font-black">Lista de proveedores registrados</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-600">Busca por municipio, nombre, teléfono, categoría o ID.</p>
                </div>
                <label className="w-full space-y-2 md:max-w-sm"><span>Buscar proveedor</span><input placeholder="Ej: Bauta, mercado, +53, nombre..." value={providerSearch} onChange={(event) => setProviderSearch(event.target.value)} /></label>
              </div>
              <p className="mt-4 text-sm font-bold text-slate-500">Resultados: {filteredProviders.length}</p>
              <div className="mt-5 grid gap-3">
                {filteredProviders.map((provider) => <article key={provider.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-black text-emerald-700">{provider.id}</p><h3 className="text-lg font-black text-slate-950">{provider.name}</h3><p className="text-sm font-semibold text-slate-600">{provider.category} · {provider.municipality}, {provider.province}</p><p className="mt-1 text-xs font-semibold text-slate-500">Tel: {provider.phone}</p></div><div className="flex flex-wrap gap-2"><button onClick={() => setViewProvider(provider)} className="rounded-full bg-sky-50 px-4 py-2 text-xs font-black text-sky-700">Ver datos</button><button onClick={() => deleteProvider(provider.id)} className="rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-700">Eliminar</button><span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">{provider.status}</span></div></div></article>)}
                {filteredProviders.length === 0 && <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm font-bold text-slate-500">No hay proveedores que coincidan con la búsqueda.</div>}
              </div>
            </section>
          </>}

          {section === "Productos" && <><section className="demo-card p-6"><h2 className="text-2xl font-black">Agregar nuevo producto</h2><p className="mt-2 text-sm text-slate-600">Primero se selecciona el proveedor. Eso determina el municipio donde el producto estará disponible.</p><div className="mt-5 grid gap-4"><label className="space-y-2"><span>Proveedor</span><select value={selectedProvider} onChange={(event) => setSelectedProvider(event.target.value)}>{providerList.map((provider) => <option key={provider.id} value={provider.id}>{provider.name} · {provider.municipality}</option>)}</select></label>{activeProvider && <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">Municipio automático: {activeProvider.municipality}, {activeProvider.province}. El producto quedará disponible solo donde opera este proveedor.</div>}<div className="grid gap-4 md:grid-cols-2"><Field label="ID automático" placeholder="PRD-BAU-0007" /><Field label="Nombre identificativo" placeholder="combo-familiar-bauta" /><Field label="Nombre comercial" placeholder="Combo Familiar Bauta" /><Field label="Marca" placeholder="DREX Demo / marca ficticia" /><Field label="Gramaje / formato" placeholder="1 kg, 500 g, combo variado..." /><Field label="Foto / archivo" placeholder="combo-familiar-bauta.jpg" /><Field label="Precio de compra" placeholder="31.00" type="number" /><Field label="Precio de venta" placeholder="42.00" type="number" /></div></div><button className="btn-primary mt-5">Guardar producto demo</button></section><section className="demo-card p-6"><h2 className="text-2xl font-black">Lista de productos registrados</h2><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[860px] text-left text-sm"><thead className="text-slate-500"><tr><th className="py-3">ID</th><th>Producto</th><th>Proveedor</th><th>Marca</th><th>Gramaje</th><th>Compra</th><th>Venta</th><th>Imagen</th></tr></thead><tbody>{products.map((product) => <tr key={product.slug} className="border-t border-slate-100"><td className="py-4 font-black">{product.id}</td><td>{product.image} {product.name}</td><td>{product.provider}</td><td>{product.brand}</td><td>{product.weight}</td><td>{formatMoney(product.cost)}</td><td className="font-black text-emerald-700">{formatMoney(product.price)}</td><td className="text-xs text-slate-500">{product.imageFile}</td></tr>)}</tbody></table></div></section></>}

          {section === "Pedidos" && <section className="demo-card p-6"><h2 className="text-2xl font-black">Pedidos recientes</h2><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="text-slate-500"><tr><th className="py-3">Orden</th><th>Beneficiario</th><th>Pago</th><th>Repartidor</th><th>Estado</th><th>Total</th></tr></thead><tbody>{demoOrders.map((order) => <tr key={order.id} className="border-t border-slate-100"><td className="py-4 font-black">{order.id}</td><td>{order.beneficiary}</td><td>{order.payment}</td><td>{order.courier}</td><td><span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">{order.status}</span></td><td className="font-black">{formatMoney(order.total)}</td></tr>)}</tbody></table></div></section>}

          {section === "Billeteras" && <section className="demo-card p-6"><h2 className="text-2xl font-black">Billeteras y movimientos</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{walletTransactions.map((tx) => <div key={tx.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{tx.owner}</p><p className="text-sm text-slate-600">{tx.type} · {tx.direction}</p><p className="mt-2 text-xl font-black text-emerald-700">{formatMoney(tx.amount)}</p></div>)}</div></section>}

          {section === "Reportes" && <IntelligencePanel />}
        </div>
      </section>
    </main>
  );
}
