"use client";

import { useEffect, useMemo, useState } from "react";
import { IntelligencePanel } from "@/components/IntelligencePanel";
import { analytics, demoOrders, formatMoney, products as initialProducts, providers as initialProviders, walletTransactions } from "@/lib/demo-data";

type Provider = (typeof initialProviders)[number];
type Product = (typeof initialProducts)[number] & { createdAt?: string; priceHistory?: { date: string; oldPrice: number; newPrice: number; variation: number }[] };

const menu = ["Dashboard", "Municipios", "Proveedores", "Productos", "Pedidos", "Billeteras", "Reportes"];

function Field({ label, placeholder, type = "text", value, readOnly, onChange }: { label: string; placeholder?: string; type?: string; value?: string; readOnly?: boolean; onChange?: (value: string) => void }) {
  return <label className="space-y-2"><span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{label}</span><input readOnly={readOnly} type={type} placeholder={placeholder} value={value} onChange={(e) => onChange?.(e.target.value)} /></label>;
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
  const [viewProductId, setViewProductId] = useState<string | null>(null);
  const [stockToAdd, setStockToAdd] = useState("");
  const [newPrice, setNewPrice] = useState("");

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
    const newProduct: Product = { id: productAutoId, slug: productForm.slug || productForm.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), name: productForm.name, brand: productForm.brand || "Marca demo", weight: `${productForm.weight} ${productForm.unit}`.trim(), category: activeProvider.category, description: "Producto agregado desde admin demo.", provider: activeProvider.name, municipality: activeProvider.municipality, price, cost, stock: Number(productForm.stock || 0), image: productImagePreview || "📦", imageFile: productImageName || "sin-imagen.jpg", badge: "Nuevo", createdAt: new Date().toLocaleString("es-CU"), priceHistory: [] };
    setProductList([...productList, newProduct]);
    setViewProductId(newProduct.id);
    setProductForm({ slug: "", name: "", brand: "", weight: "", unit: "lb", cost: "", price: "", stock: "" });
    setProductImageName("");
    setProductImagePreview("");
  };

  const addStock = (productId: string) => {
    const amount = Number(stockToAdd || 0);
    if (!amount) return;
    setProductList(productList.map((product) => product.id === productId ? { ...product, stock: product.stock + amount } : product));
    setStockToAdd("");
  };

  const changeProductPrice = (productId: string) => {
    const value = Number(newPrice || 0);
    if (!value) return;
    setProductList(productList.map((product) => {
      if (product.id !== productId) return product;
      return {
        ...product,
        price: value,
        priceHistory: [
          ...(product.priceHistory ?? []),
          { date: new Date().toLocaleString("es-CU"), oldPrice: product.price, newPrice: value, variation: value - product.price },
        ],
      };
    }));
    setNewPrice("");
  };

  const onImage = (file?: File) => { if (!file) return; setProductImageName(file.name); setProductImagePreview(URL.createObjectURL(file)); };

  return <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8"><div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><span className="badge-demo">Admin demo</span><h1 className="mt-4 text-4xl font-black text-slate-950">Dashboard administrativo</h1><p className="mt-2 text-slate-600">Panel separado de la tienda pública.</p></div><div className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white">admin@demo.local</div></div><section className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]"><aside className="demo-card h-fit p-4">{menu.map((item) => <button key={item} onClick={() => setSection(item)} className={`mb-2 w-full rounded-2xl px-4 py-3 text-left text-sm font-black transition ${section === item ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-emerald-50"}`}>{item}</button>)}</aside><div className="space-y-8">

{section === "Dashboard" && <section className="grid gap-4 md:grid-cols-4">{[["Total vendido", analytics.totalSales], ["Ganancia", analytics.grossProfit], ["Saldo cargado", analytics.walletLoaded], ["Saldo circulando", analytics.circulatingBalance]].map(([l,v]) => <div key={String(l)} className="demo-card p-5"><p className="text-sm font-bold text-slate-500">{l}</p><p className="mt-2 text-3xl font-black text-emerald-700">{formatMoney(Number(v))}</p></div>)}</section>}
{section === "Municipios" && <section className="demo-card p-6"><h2 className="text-2xl font-black">Municipios</h2><p className="mt-2 text-slate-600">Bauta disponible. Resto próximamente.</p></section>}

{section === "Proveedores" && <><section className="demo-card p-6"><button onClick={() => setShowProviderForm(!showProviderForm)} className="flex w-full items-center justify-between text-left"><span><span className="text-2xl font-black">Agregar nuevo proveedor</span><span className="block text-sm text-slate-600">Formulario contraído</span></span><span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">{showProviderForm ? "Ocultar" : "Desplegar"}</span></button>{showProviderForm && <div className="mt-5 grid gap-4 md:grid-cols-2"><Field label="Nombre del proveedor" value={providerForm.name} onChange={(v)=>setProviderForm({...providerForm,name:v})}/><Field label="Teléfono" value={providerForm.phone} onChange={(v)=>setProviderForm({...providerForm,phone:v})}/><Field label="Teléfono alternativo" value={providerForm.altPhone} onChange={(v)=>setProviderForm({...providerForm,altPhone:v})}/><label className="space-y-2"><span>Municipio</span><select value={providerForm.municipality} onChange={(e)=>setProviderForm({...providerForm,municipality:e.target.value})}><option>Bauta</option></select></label><label className="space-y-2"><span>Categoría</span><select value={providerForm.category} onChange={(e)=>setProviderForm({...providerForm,category:e.target.value})}><option>Mercado</option><option>Ferretería</option><option>Peletería</option><option>Aseo e higiene</option><option>Combos familiares</option></select></label><Field label="Notas" value={providerForm.notes} onChange={(v)=>setProviderForm({...providerForm,notes:v})}/><button onClick={addProvider} className="btn-dark md:col-span-2">Guardar proveedor demo</button></div>}</section>{viewProvider && <section className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-6"><h2 className="text-2xl font-black">{viewProvider.name}</h2><p>ID: {viewProvider.id}</p><p>{viewProvider.category} · {viewProvider.municipality}</p><p>Tel: {viewProvider.phone}</p></section>}<section className="demo-card p-6"><h2 className="text-2xl font-black">Lista de proveedores</h2><input className="mt-4" placeholder="Buscar por Bauta, nombre, teléfono..." value={providerSearch} onChange={(e)=>setProviderSearch(e.target.value)}/><p className="mt-3 text-sm font-bold text-slate-500">Resultados: {filteredProviders.length}</p><div className="mt-4 grid gap-3">{filteredProviders.map((p)=><article key={p.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-black text-emerald-700">{p.id}</p><h3 className="text-lg font-black">{p.name}</h3><p className="text-sm text-slate-600">{p.category} · {p.municipality} · Tel: {p.phone}</p></div><div className="flex gap-2"><button onClick={()=>setViewProvider(p)} className="rounded-full bg-sky-50 px-4 py-2 text-xs font-black text-sky-700">Ver datos</button><button onClick={()=>deleteProvider(p.id)} className="rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-700">Eliminar</button></div></div></article>)}</div></section></>}

{section === "Productos" && <><section className="demo-card p-6"><button onClick={() => setShowProductForm(!showProductForm)} className="flex w-full items-center justify-between text-left"><span><span className="text-2xl font-black">Agregar nuevo producto</span><span className="block text-sm text-slate-600">Formulario contraído. ID automático, imagen real y peso con unidad.</span></span><span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">{showProductForm ? "Ocultar" : "Desplegar"}</span></button>{showProductForm && <div className="mt-5"><div className="grid gap-6 lg:grid-cols-[1fr_220px]"><div className="grid gap-4"><label className="space-y-2"><span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Proveedor</span><select value={selectedProvider} onChange={(e)=>setSelectedProvider(e.target.value)}>{providerList.map((p)=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><Field label="Municipio automático" readOnly value={activeProvider ? `${activeProvider.municipality}, ${activeProvider.province}` : ""}/><Field label="ID automático" readOnly value={productAutoId}/></div><label className="flex min-h-40 cursor-pointer md:min-h-56 flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center"><span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Imagen</span>{productImagePreview ? <img src={productImagePreview} alt="Preview" className="mt-3 h-24 w-24 rounded-3xl object-contain bg-white p-2 md:h-36 md:w-36"/> : <span className="mt-3 flex h-20 w-20 items-center justify-center md:h-28 md:w-28 rounded-3xl bg-white text-4xl">+</span>}<span className="mt-3 max-w-44 truncate text-xs font-semibold text-slate-500">{productImageName || "Subir archivo .jpg"}</span><input className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e)=>onImage(e.target.files?.[0])}/></label></div><div className="mt-4 grid gap-3"><Field label="Nombre identificativo" value={productForm.slug} onChange={(v)=>setProductForm({...productForm,slug:v})}/><Field label="Nombre comercial" value={productForm.name} onChange={(v)=>setProductForm({...productForm,name:v})}/><Field label="Marca" value={productForm.brand} onChange={(v)=>setProductForm({...productForm,brand:v})}/><div className="grid gap-4 md:grid-cols-[1fr_180px]"><Field label="Peso" type="number" value={productForm.weight} onChange={(v)=>setProductForm({...productForm,weight:v})}/><label className="space-y-2"><span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Unidad</span><select value={productForm.unit} onChange={(e)=>setProductForm({...productForm,unit:e.target.value})}><option>lb</option><option>g</option><option>kg</option></select></label></div><Field label="Stock inicial" type="number" value={productForm.stock} onChange={(v)=>setProductForm({...productForm,stock:v})}/><div className="grid gap-4 md:grid-cols-2"><Field label="Precio de compra" type="number" value={productForm.cost} onChange={(v)=>setProductForm({...productForm,cost:v})}/><Field label="Precio de venta" type="number" value={productForm.price} onChange={(v)=>setProductForm({...productForm,price:v})}/></div><button onClick={addProduct} className="btn-primary sticky bottom-3 z-10 shadow-xl shadow-orange-200 md:static">Guardar producto demo</button></div></div>}</section><section className="demo-card p-6"><h2 className="text-2xl font-black">Lista de productos</h2><p className="mt-1 text-sm font-semibold text-slate-600">Solo se muestra ID y nombre identificativo. Pincha un producto para ver detalles y agregar stock.</p><div className="mt-5 grid gap-3">{productList.map((p)=>{ const isOut = p.stock <= 0; return <article key={p.id} className={`rounded-2xl border bg-slate-50 p-4 ${isOut ? "border-red-500 ring-2 ring-red-100" : "border-slate-200"}`}><div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between"><div className="flex flex-wrap items-center gap-3"><span className={isOut ? "text-xs font-black text-red-700" : "text-xs font-black text-emerald-700"}>{p.id}</span>{isOut && <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">agotado</span>}<h3 className="text-lg font-black text-slate-950">{p.slug}</h3><button onClick={()=>setViewProductId(viewProductId === p.id ? null : p.id)} className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-600">{viewProductId === p.id ? "Contraer" : "Expandir"}</button></div><span className={isOut ? "rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700" : "rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700"}>Stock: {p.stock}</span></div>{viewProductId === p.id && <div className="mt-4 grid gap-4 rounded-2xl bg-white p-4 md:grid-cols-[140px_1fr]"><div className="flex items-center justify-center rounded-2xl bg-slate-50 p-3">{p.image?.startsWith?.("blob:") ? <img src={p.image} alt={p.name} className="h-28 w-28 rounded-xl object-contain"/> : <span className="text-5xl">{p.image}</span>}</div><div className="grid gap-2 text-sm font-semibold text-slate-700 md:grid-cols-2"><p>Nombre: {p.name}</p><p>Proveedor: {p.provider}</p><p>Marca: {p.brand}</p><p className="font-black">Peso para reparto: {p.weight}</p><p className={isOut ? "font-black text-red-700" : ""}>Stock actual: {p.stock} {isOut ? "— no disponible para compra" : ""}</p><p>Imagen: {p.imageFile}</p><p>Fecha alta: {p.createdAt ?? "Producto demo inicial"}</p><p>Compra: {formatMoney(p.cost)}</p><p>Venta actual: {formatMoney(p.price)}</p><div className="mt-2 flex flex-wrap gap-2 md:col-span-2"><input className="max-w-40" type="number" placeholder="Agregar stock" value={stockToAdd} onChange={(e)=>setStockToAdd(e.target.value)}/><button onClick={()=>addStock(p.id)} className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white">Sumar stock</button><input className="max-w-40" type="number" placeholder="Nuevo precio" value={newPrice} onChange={(e)=>setNewPrice(e.target.value)}/><button onClick={()=>changeProductPrice(p.id)} className="rounded-full bg-orange-500 px-4 py-2 text-xs font-black text-white">Cambiar precio</button></div>{(p.priceHistory?.length ?? 0) > 0 && <div className="md:col-span-2 rounded-2xl bg-slate-50 p-3"><p className="font-black">Historial de precio</p>{p.priceHistory?.map((item, index) => <p key={index} className="text-xs">{item.date}: {formatMoney(item.oldPrice)} → {formatMoney(item.newPrice)} ({item.variation >= 0 ? "+" : ""}{formatMoney(item.variation)})</p>)}</div>}</div></div>}</article>})}</div></section></>}

{section === "Pedidos" && <section className="demo-card p-6"><h2 className="text-2xl font-black">Pedidos</h2>{demoOrders.map(o=><p key={o.id}>{o.id} · {o.beneficiary} · {o.status}</p>)}</section>}
{section === "Billeteras" && <section className="demo-card p-6"><h2 className="text-2xl font-black">Billeteras</h2>{walletTransactions.map(t=><p key={t.id}>{t.owner} · {t.type} · {formatMoney(t.amount)}</p>)}</section>}
{section === "Reportes" && <IntelligencePanel />}
</div></section></main>;
}
