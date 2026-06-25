"use client";

import { useEffect, useMemo, useState } from "react";
import { IntelligencePanel } from "@/components/IntelligencePanel";
import { analytics, demoOrders, formatMoney, products as initialProducts, providers as initialProviders, walletTransactions } from "@/lib/demo-data";

type Provider = (typeof initialProviders)[number];
type Product = (typeof initialProducts)[number];

const menu = ["Dashboard", "Municipios", "Proveedores", "Productos", "Pedidos", "Billeteras", "Reportes"];

function Field({ label, placeholder, type = "text", value, readOnly, onChange }: { label: string; placeholder?: string; type?: string; value?: string; readOnly?: boolean; onChange?: (value: string) => void }) {
  return <label className="space-y-2"><span>{label}</span><input readOnly={readOnly} type={type} placeholder={placeholder} value={value} onChange={(e) => onChange?.(e.target.value)} /></label>;
}

export default function AdminPage() {
  const [section, setSection] = useState("Dashboard");
  const [providersLoaded, setProvidersLoaded] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [providerList, setProviderList] = useState<Provider[]>(initialProviders);
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [providerSearch, setProviderSearch] = useState("");
  const [viewProvider, setViewProvider] = useState<Provider | null>(null);
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(initialProviders[0].id);
  const [productImageName, setProductImageName] = useState("");
  const [productImagePreview, setProductImagePreview] = useState("");

  const [providerForm, setProviderForm] = useState({ name: "", phone: "", altPhone: "", municipality: "Bauta", category: "Mercado", notes: "" });
  const [productForm, setProductForm] = useState({ slug: "", name: "", brand: "", weight: "", unit: "lb", cost: "", price: "", stock: "" });

  useEffect(() => {
    const savedProviders = localStorage.getItem("drex-market-demo-providers");
    const savedProducts = localStorage.getItem("drex-market-demo-products");
    if (savedProviders) setProviderList(JSON.parse(savedProviders));
    if (savedProducts) setProductList(JSON.parse(savedProducts));
    setProvidersLoaded(true); setProductsLoaded(true);
  }, []);
  useEffect(() => { if (providersLoaded) localStorage.setItem("drex-market-demo-providers", JSON.stringify(providerList)); }, [providerList, providersLoaded]);
  useEffect(() => { if (productsLoaded) localStorage.setItem("drex-market-demo-products", JSON.stringify(productList)); }, [productList, productsLoaded]);

  const activeProvider = useMemo(() => providerList.find((p) => p.id === selectedProvider) ?? providerList[0], [providerList, selectedProvider]);
  const productAutoId = `PRD-BAU-${String(productList.length + 1).padStart(4, "0")}`;
  const filteredProviders = useMemo(() => {
    const q = providerSearch.trim().toLowerCase();
    if (!q) return providerList;
    return providerList.filter((p) => [p.id, p.name, p.phone, p.category, p.municipality, p.province].join(" ").toLowerCase().includes(q));
  }, [providerList, providerSearch]);

  const addProvider = () => {
    if (!providerForm.name.trim()) return;
    const newProvider: Provider = { id: `PROV-BAU-${String(providerList.length + 1).padStart(3, "0")}`, name: providerForm.name, municipality: providerForm.municipality, province: "Artemisa", category: providerForm.category, contact: providerForm.notes || "Sin notas", phone: providerForm.altPhone ? `${providerForm.phone} / Alt: ${providerForm.altPhone}` : providerForm.phone, status: "Activo" };
    setProviderList([...providerList, newProvider]); setViewProvider(newProvider); setSelectedProvider(newProvider.id);
    setProviderForm({ name: "", phone: "", altPhone: "", municipality: "Bauta", category: "Mercado", notes: "" });
  };
  const deleteProvider = (id: string) => { setProviderList(providerList.filter((p) => p.id !== id)); if (viewProvider?.id === id) setViewProvider(null); };

  const addProduct = () => {
    if (!productForm.name.trim() || !activeProvider) return;
    const price = Number(productForm.price || 0); const cost = Number(productForm.cost || 0);
    const newProduct: Product = { id: productAutoId, slug: productForm.slug || productForm.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), name: productForm.name, brand: productForm.brand || "Marca demo", weight: `${productForm.weight} ${productForm.unit}`.trim(), category: activeProvider.category, description: "Producto agregado desde admin demo.", provider: activeProvider.name, municipality: activeProvider.municipality, price, cost, stock: Number(productForm.stock || 0), image: productImagePreview || "📦", imageFile: productImageName || "sin-imagen.jpg", badge: "Nuevo" };
    setProductList([...productList, newProduct]);
    setProductForm({ slug: "", name: "", brand: "", weight: "", unit: "lb", cost: "", price: "", stock: "" }); setProductImageName(""); setProductImagePreview("");
  };

  const onImage = (file?: File) => { if (!file) return; setProductImageName(file.name); setProductImagePreview(URL.createObjectURL(file)); };

  return <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8"><div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><span className="badge-demo">Admin demo</span><h1 className="mt-4 text-4xl font-black text-slate-950">Dashboard administrativo</h1><p className="mt-2 text-slate-600">Panel separado de la tienda pública.</p></div><div className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white">admin@demo.local</div></div><section className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]"><aside className="demo-card h-fit p-4">{menu.map((item) => <button key={item} onClick={() => setSection(item)} className={`mb-2 w-full rounded-2xl px-4 py-3 text-left text-sm font-black transition ${section === item ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-emerald-50"}`}>{item}</button>)}</aside><div className="space-y-8">

{section === "Dashboard" && <section className="grid gap-4 md:grid-cols-4">{[["Total vendido", analytics.totalSales], ["Ganancia", analytics.grossProfit], ["Saldo cargado", analytics.walletLoaded], ["Saldo circulando", analytics.circulatingBalance]].map(([l,v]) => <div key={String(l)} className="demo-card p-5"><p className="text-sm font-bold text-slate-500">{l}</p><p className="mt-2 text-3xl font-black text-emerald-700">{formatMoney(Number(v))}</p></div>)}</section>}
{section === "Municipios" && <section className="demo-card p-6"><h2 className="text-2xl font-black">Municipios</h2><p className="mt-2 text-slate-600">Bauta disponible. Resto próximamente.</p></section>}

{section === "Proveedores" && <><section className="demo-card p-6"><button onClick={() => setShowProviderForm(!showProviderForm)} className="flex w-full items-center justify-between text-left"><span><span className="text-2xl font-black">Agregar nuevo proveedor</span><span className="block text-sm text-slate-600">Formulario contraído</span></span><span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">{showProviderForm ? "Ocultar" : "Desplegar"}</span></button>{showProviderForm && <div className="mt-5 grid gap-4 md:grid-cols-2"><Field label="Nombre del proveedor" value={providerForm.name} onChange={(v)=>setProviderForm({...providerForm,name:v})}/><Field label="Teléfono" value={providerForm.phone} onChange={(v)=>setProviderForm({...providerForm,phone:v})}/><Field label="Teléfono alternativo" value={providerForm.altPhone} onChange={(v)=>setProviderForm({...providerForm,altPhone:v})}/><label className="space-y-2"><span>Municipio</span><select value={providerForm.municipality} onChange={(e)=>setProviderForm({...providerForm,municipality:e.target.value})}><option>Bauta</option></select></label><label className="space-y-2"><span>Categoría</span><select value={providerForm.category} onChange={(e)=>setProviderForm({...providerForm,category:e.target.value})}><option>Mercado</option><option>Ferretería</option><option>Peletería</option><option>Aseo e higiene</option><option>Combos familiares</option></select></label><Field label="Notas" value={providerForm.notes} onChange={(v)=>setProviderForm({...providerForm,notes:v})}/><button onClick={addProvider} className="btn-dark md:col-span-2">Guardar proveedor demo</button></div>}</section>{viewProvider && <section className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-6"><h2 className="text-2xl font-black">{viewProvider.name}</h2><p>ID: {viewProvider.id}</p><p>{viewProvider.category} · {viewProvider.municipality}</p><p>Tel: {viewProvider.phone}</p></section>}<section className="demo-card p-6"><h2 className="text-2xl font-black">Lista de proveedores</h2><input className="mt-4" placeholder="Buscar por Bauta, nombre, teléfono..." value={providerSearch} onChange={(e)=>setProviderSearch(e.target.value)}/><p className="mt-3 text-sm font-bold text-slate-500">Resultados: {filteredProviders.length}</p><div className="mt-4 grid gap-3">{filteredProviders.map((p)=><article key={p.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-black text-emerald-700">{p.id}</p><h3 className="text-lg font-black">{p.name}</h3><p className="text-sm text-slate-600">{p.category} · {p.municipality} · Tel: {p.phone}</p></div><div className="flex gap-2"><button onClick={()=>setViewProvider(p)} className="rounded-full bg-sky-50 px-4 py-2 text-xs font-black text-sky-700">Ver datos</button><button onClick={()=>deleteProvider(p.id)} className="rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-700">Eliminar</button></div></div></article>)}</div></section></>}

{section === "Productos" && <><section className="demo-card p-6"><button onClick={() => setShowProductForm(!showProductForm)} className="flex w-full items-center justify-between text-left"><span><span className="text-2xl font-black">Agregar nuevo producto</span><span className="block text-sm text-slate-600">ID automático, imagen real y peso con unidad.</span></span><span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">{showProductForm ? "Ocultar" : "Desplegar"}</span></button>{showProductForm && <div className="mt-5"><div className="grid gap-6 lg:grid-cols-[1fr_220px]"><div className="grid gap-4"><label className="space-y-2"><span>Proveedor</span><select value={selectedProvider} onChange={(e)=>setSelectedProvider(e.target.value)}>{providerList.map((p)=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><Field label="Municipio automático" readOnly value={activeProvider ? `${activeProvider.municipality}, ${activeProvider.province}` : ""}/><Field label="ID automático" readOnly value={productAutoId}/></div><label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center"><span className="text-sm font-black">Imagen</span>{productImagePreview ? <img src={productImagePreview} alt="Preview" className="mt-3 h-32 w-32 rounded-3xl object-cover"/> : <span className="mt-3 flex h-28 w-28 items-center justify-center rounded-3xl bg-white text-4xl">+</span>}<span className="mt-3 max-w-40 truncate text-xs font-semibold text-slate-500">{productImageName || "Subir archivo .jpg"}</span><input className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e)=>onImage(e.target.files?.[0])}/></label></div><div className="mt-5 grid gap-4"><Field label="Nombre identificativo" value={productForm.slug} onChange={(v)=>setProductForm({...productForm,slug:v})}/><Field label="Nombre comercial" value={productForm.name} onChange={(v)=>setProductForm({...productForm,name:v})}/><Field label="Marca" value={productForm.brand} onChange={(v)=>setProductForm({...productForm,brand:v})}/><div className="grid gap-4 md:grid-cols-[1fr_180px]"><Field label="Peso" type="number" value={productForm.weight} onChange={(v)=>setProductForm({...productForm,weight:v})}/><label className="space-y-2"><span>Unidad</span><select value={productForm.unit} onChange={(e)=>setProductForm({...productForm,unit:e.target.value})}><option>lb</option><option>g</option><option>kg</option></select></label></div><Field label="Stock inicial" type="number" value={productForm.stock} onChange={(v)=>setProductForm({...productForm,stock:v})}/><div className="grid gap-4 md:grid-cols-2"><Field label="Precio de compra" type="number" value={productForm.cost} onChange={(v)=>setProductForm({...productForm,cost:v})}/><Field label="Precio de venta" type="number" value={productForm.price} onChange={(v)=>setProductForm({...productForm,price:v})}/></div><button onClick={addProduct} className="btn-primary">Guardar producto demo</button></div></div>}</section><section className="demo-card p-6"><h2 className="text-2xl font-black">Lista de productos</h2><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead><tr><th>ID</th><th>Producto</th><th>Proveedor</th><th>Marca</th><th>Peso</th><th>Stock</th><th>Compra</th><th>Venta</th><th>Imagen</th></tr></thead><tbody>{productList.map((p)=><tr key={p.id} className="border-t border-slate-100"><td className="py-4 font-black">{p.id}</td><td>{p.image?.startsWith?.("blob:") ? <img src={p.image} alt={p.name} className="inline h-10 w-10 rounded-xl object-cover"/> : p.image} {p.name}</td><td>{p.provider}</td><td>{p.brand}</td><td>{p.weight}</td><td>{p.stock}</td><td>{formatMoney(p.cost)}</td><td className="font-black text-emerald-700">{formatMoney(p.price)}</td><td className="text-xs text-slate-500">{p.imageFile}</td></tr>)}</tbody></table></div></section></>}

{section === "Pedidos" && <section className="demo-card p-6"><h2 className="text-2xl font-black">Pedidos</h2>{demoOrders.map(o=><p key={o.id}>{o.id} · {o.beneficiary} · {o.status}</p>)}</section>}
{section === "Billeteras" && <section className="demo-card p-6"><h2 className="text-2xl font-black">Billeteras</h2>{walletTransactions.map(t=><p key={t.id}>{t.owner} · {t.type} · {formatMoney(t.amount)}</p>)}</section>}
{section === "Reportes" && <IntelligencePanel />}
</div></section></main>;
}
