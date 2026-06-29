"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { IntelligencePanel } from "@/components/IntelligencePanel";
import { analytics, demoOrders, formatMoney, walletTransactions } from "@/lib/demo-data";

type Provider = { id: string; name: string; municipality: string; province: string; category: string; contact?: string; phone: string; status: string; image?: string; imageFile?: string };
type Product = { id: string; slug: string; name: string; brand: string; weight: string; category: string; description?: string; provider: string; municipality?: string; price: number; cost: number; stock: number; image: string; imageFile?: string; badge?: string; createdAt?: string; priceHistory?: { date: string; oldPrice: number; newPrice: number; variation: number }[] };
type AdminOrder = (typeof demoOrders)[number] & { id: string };
type WasteRecord = { id: string; productId: string; productName: string; productImage?: string; quantity: number; cause: string; payer: string; responsible: string; chargeAmount: number; createdAt: string };

const menu = [
  { label: "Dashboard", icon: "dashboard.png" },
  { label: "Proveedores", icon: "proveedores.png" },
  { label: "Productos", icon: "productos.png" },
  { label: "Merma", icon: "merma.png" },
  { label: "Promociones", icon: "promo.png" },
  { label: "Pedidos", icon: "pedidos.png" },
  { label: "Seguimiento", icon: "seguimiento.png" },
  { label: "Billeteras", icon: "billeteras.png" },
  { label: "Reportes", icon: "reportes.png" },
];

function loadStoredList<T>(key: string, fallback: T[]) {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T[]; } catch { return fallback; }
}

function clearLegacyDemoStorage() {
  if (typeof window === "undefined") return;
  [
    "drex-market-demo-providers",
    "drex-market-demo-products",
    "drex-market-deleted-providers",
    "drex-market-deleted-products",
  ].forEach((key) => localStorage.removeItem(key));
}

function loadInitialOrders() {
  const baseOrders: AdminOrder[] = demoOrders.map((order, index) => ({ ...order, id: `DCM260624${String(index + 1).padStart(5, "0")}` }));
  if (typeof window === "undefined") return baseOrders;
  const lastOrder = localStorage.getItem("drex-market-last-order");
  if (!lastOrder) return baseOrders;
  try {
    const order = JSON.parse(lastOrder);
    return baseOrders.some((item) => item.id === order.id) ? baseOrders : [{
      id: order.id,
      customer: order.customer || "Cliente DREX registrado",
      beneficiary: order.beneficiary,
      total: Number(order.total || 0),
      status: order.status || "Pago confirmado",
      payment: order.payment,
      courier: "Sin asignar",
    }, ...baseOrders];
  } catch {
    return baseOrders;
  }
}


const removedProductSlugs = new Set(["combo-familiar-bauta", "kit-aseo-hogar"]);
const removedProductNames = new Set(["combo familiar bauta", "kit aseo hogar", "kit aseo del hogar"]);
const keepVisibleProduct = (product: { slug?: string; name?: string }) => !removedProductSlugs.has(product.slug ?? "") && !removedProductNames.has((product.name ?? "").toLowerCase());

function Field({ label, placeholder, type = "text", value, readOnly, onChange }: { label: string; placeholder?: string; type?: string; value?: string; readOnly?: boolean; onChange?: (value: string) => void }) {
  return <label className="space-y-2"><span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{label}</span><input readOnly={readOnly} type={type} placeholder={placeholder} value={value} onChange={(e) => onChange?.(e.target.value)} /></label>;
}

export function AdminDashboard() {
  const [section, setSection] = useState("Dashboard");
  const adminMenuRef = useRef<HTMLDivElement>(null);
  const [adminMenuScrollable, setAdminMenuScrollable] = useState(false);
  const [providerList, setProviderList] = useState<Provider[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [providerSearch, setProviderSearch] = useState("");
  const [viewProvider, setViewProvider] = useState<Provider | null>(null);
  const [editingProviderId, setEditingProviderId] = useState<string | null>(null);
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [providerImageName, setProviderImageName] = useState("");
  const [providerImagePreview, setProviderImagePreview] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [productImagePreview, setProductImagePreview] = useState("");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [viewProductId, setViewProductId] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [wasteSearch, setWasteSearch] = useState("");
  const [selectedWasteProductId, setSelectedWasteProductId] = useState("");
  const [previewWasteProductId, setPreviewWasteProductId] = useState("");
  const wasteCauses = ["Llegó roto desde proveedor", "Se rompió en reparto", "Producto vencido", "Derrame o envase abierto", "Mala manipulación", "Faltante en entrega", "Otra causa"];
  const [wasteForm, setWasteForm] = useState({ quantity: "", cause: "Llegó roto desde proveedor", customCause: "", payer: "Mensajero responsable", responsible: "" });
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>(() => loadStoredList<WasteRecord>("drex-market-waste-records", []));
  const [stockToAdd, setStockToAdd] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [orderList, setOrderList] = useState<AdminOrder[]>(loadInitialOrders);
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [bulkOrderIds, setBulkOrderIds] = useState("");
  const [bulkOrderStatus, setBulkOrderStatus] = useState("Preparando");
  const [promotionList, setPromotionList] = useState([
    { id: "PROMO-BAU-002", name: "Liquidación stock bajo", discount: "7", product: "Productos seleccionados", start: "2026-06-25", end: "2026-06-30", limit: "10", status: "Pausada" },
  ]);
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [showPromoProductSelector, setShowPromoProductSelector] = useState(false);
  const [promoProductSearch, setPromoProductSearch] = useState("");

  const [providerForm, setProviderForm] = useState({ name: "", phone: "", altPhone: "", municipality: "Bauta", category: "Mercado", notes: "" });
  const productCategories = ["Mercado", "Ferretería", "Peletería", "Aseo e higiene", "Combos familiares", "Electrodomésticos", "Perfumería"];
  const [productForm, setProductForm] = useState({ slug: "", name: "", brand: "", category: "Mercado", weight: "", unit: "lb", cost: "", price: "", stock: "" });
  const [promotionForm, setPromotionForm] = useState({ name: "", discount: "", product: "", start: "", end: "", limit: "", status: "Activa" });

  useEffect(() => {
    let active = true;
    clearLegacyDemoStorage();
    Promise.all([
      fetch("/api/admin/providers").then((response) => response.json()),
      fetch("/api/admin/products").then((response) => response.json()),
      fetch("/api/admin/orders").then((response) => response.json()),
    ]).then(([dbProviders, dbProducts, dbOrders]) => {
      if (!active) return;
      const nextProviders = dbProviders;
      setProviderList(nextProviders);
      setProductList(dbProducts.filter(keepVisibleProduct));
      setOrderList(dbOrders);
      setSelectedProvider(nextProviders[0]?.id ?? "");
    }).catch(() => {
      setProviderList([]);
      setProductList([]);
      setOrderList([]);
    });
    return () => { active = false; };
  }, []);
  useEffect(() => { localStorage.setItem("drex-market-waste-records", JSON.stringify(wasteRecords)); }, [wasteRecords]);
  useEffect(() => {
    const updateMenuScroll = () => {
      const menuNode = adminMenuRef.current;
      if (!menuNode) return;
      setAdminMenuScrollable(menuNode.scrollWidth > menuNode.clientWidth + 4);
    };

    updateMenuScroll();
    window.addEventListener("resize", updateMenuScroll);
    return () => window.removeEventListener("resize", updateMenuScroll);
  }, []);
  useEffect(() => {
    const labels = menu.map((item) => item.label);
    const applyHashSection = () => {
      const hashSection = decodeURIComponent(window.location.hash.replace("#", ""));
      if (labels.includes(hashSection)) setSection(hashSection);
    };

    applyHashSection();
    window.addEventListener("hashchange", applyHashSection);
    return () => window.removeEventListener("hashchange", applyHashSection);
  }, []);

  const activeProvider = useMemo(() => providerList.find((p) => p.id === selectedProvider) ?? providerList[0], [providerList, selectedProvider]);
  const providerAutoId = `PROV-BAU-${String(providerList.length + 1).padStart(3, "0")}`;
  const productAutoId = `PRD-BAU-${String(productList.length + 1).padStart(4, "0")}`;
  const filteredProviders = useMemo(() => {
    const q = providerSearch.trim().toLowerCase();
    if (!q) return providerList;
    return providerList.filter((p) => [p.id, p.name, p.phone, p.category, p.municipality, p.province].join(" ").toLowerCase().includes(q));
  }, [providerList, providerSearch]);
  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    const visibleProducts = productList.filter(keepVisibleProduct);
    if (!q) return visibleProducts;
    return visibleProducts.filter((p) => [p.name, p.slug, p.id, p.brand].join(" ").toLowerCase().includes(q));
  }, [productList, productSearch]);
  const filteredPromoProducts = useMemo(() => {
    const q = promoProductSearch.trim().toLowerCase();
    const visibleProducts = productList.filter(keepVisibleProduct);
    if (!q) return visibleProducts;
    return visibleProducts.filter((p) => [p.name, p.slug, p.id, p.brand, p.provider].join(" ").toLowerCase().includes(q));
  }, [productList, promoProductSearch]);
  const filteredWasteProducts = useMemo(() => {
    const q = wasteSearch.trim().toLowerCase();
    if (!q) return [];
    const visibleProducts = productList.filter(keepVisibleProduct);
    return visibleProducts.filter((p) => [p.name, p.slug, p.id, p.brand, p.provider].join(" ").toLowerCase().includes(q));
  }, [productList, wasteSearch]);
  const selectedWasteProduct = useMemo(() => productList.find((product) => product.id === selectedWasteProductId) ?? null, [productList, selectedWasteProductId]);
  const previewWasteProduct = useMemo(() => productList.find((product) => product.id === previewWasteProductId) ?? null, [productList, previewWasteProductId]);


  const filteredOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();
    if (!q) return orderList;
    return orderList.filter((o) => o.id.toLowerCase().includes(q));
  }, [orderList, orderSearch]);

  const getPromotionProducts = (promoProductText: string) => promoProductText
    .split(" + ")
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => productList.find((product) => product.name === name || product.slug === name || product.id === name) ?? { id: name, name, image: "", imageFile: "Sin imagen" });

  const resetProviderForm = () => {
    setEditingProviderId(null);
    setProviderForm({ name: "", phone: "", altPhone: "", municipality: "Bauta", category: "Mercado", notes: "" });
    setProviderImageName("");
    setProviderImagePreview("");
  };

  const saveProvider = async () => {
    if (!providerForm.name.trim()) return;
    const phone = providerForm.altPhone ? `${providerForm.phone} / Alt: ${providerForm.altPhone}` : providerForm.phone;
    if (editingProviderId) {
      const updatedProviders = providerList.map((provider) => provider.id === editingProviderId ? {
        ...provider,
        name: providerForm.name,
        phone,
        municipality: providerForm.municipality,
        category: providerForm.category,
        contact: providerForm.notes || provider.contact,
        image: providerImagePreview || provider.image,
        imageFile: providerImageName || provider.imageFile,
      } : provider);
      setProviderList(updatedProviders);
      setViewProvider(updatedProviders.find((provider) => provider.id === editingProviderId) ?? null);
      resetProviderForm();
      return;
    }

    const response = await fetch("/api/admin/providers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: providerForm.name,
        municipality: providerForm.municipality,
        category: providerForm.category,
        contact: providerForm.notes || "Sin notas",
        phone,
      }),
    });
    const newProvider: Provider = { ...(await response.json()), image: providerImagePreview, imageFile: providerImageName || "Imagen" };
    setProviderList([newProvider, ...providerList]); setViewProvider(newProvider); setSelectedProvider(newProvider.id);
    resetProviderForm();
  };

  const editProvider = (provider: Provider) => {
    const [phone, alt = ""] = (provider.phone || "").split(" / Alt: ");
    setEditingProviderId(provider.id);
    setShowProviderForm(true);
    setProviderForm({ name: provider.name, phone, altPhone: alt, municipality: provider.municipality, category: provider.category, notes: "" });
    setProviderImageName(provider.imageFile || "");
    setProviderImagePreview(provider.image || "");
  };

  const deleteProvider = async (id: string) => {
    await fetch(`/api/admin/providers/${id}`, { method: "DELETE" }).catch(() => null);
    const deletedProviderIds = loadStoredList<string>("drex-market-deleted-providers", []);
    if (!deletedProviderIds.includes(id)) localStorage.setItem("drex-market-deleted-providers", JSON.stringify([...deletedProviderIds, id]));
    setProviderList(providerList.filter((p) => p.id !== id));
    if (viewProvider?.id === id) setViewProvider(null);
    if (editingProviderId === id) resetProviderForm();
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProductForm({ slug: "", name: "", brand: "", category: "Mercado", weight: "", unit: "lb", cost: "", price: "", stock: "" });
    setSelectedProvider(providerList[0]?.id ?? "");
    setProductImagePreview("");
  };

  const addProduct = async () => {
    if (!productForm.name.trim() || !activeProvider) return;
    const productPayload = {
      providerId: activeProvider.id,
      providerName: activeProvider.name,
      providerPhone: activeProvider.phone,
      municipality: activeProvider.municipality,
      slug: productForm.slug,
      name: productForm.name,
      brand: productForm.brand || "",
      weight: `${productForm.weight} ${productForm.unit}`.trim(),
      category: productForm.category,
      description: "Producto agregado desde admin.",
      price: productForm.price,
      cost: productForm.cost,
      stock: productForm.stock,
      image: productImagePreview || "",
    };
    const response = await fetch(editingProductId ? `/api/admin/products/${editingProductId}` : "/api/admin/products", {
      method: editingProductId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productPayload),
    });
    if (!response.ok) {
      alert("No se pudo guardar el producto en la base de datos. Revisa proveedor, nombre, precio y stock.");
      return;
    }
    const savedProduct: Product = await response.json();
    setProductList(editingProductId ? productList.map((product) => product.id === savedProduct.id ? savedProduct : product) : [savedProduct, ...productList]);
    setViewProductId(savedProduct.id);
    resetProductForm();
  };

  const addStock = (productId: string) => {
    const amount = Number(stockToAdd || 0);
    if (!amount) return;
    setProductList(productList.map((product) => product.id === productId ? { ...product, stock: product.stock + amount } : product));
    setStockToAdd("");
  };

  const deleteProduct = async (productId: string) => {
    const response = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    if (!response.ok) {
      alert("No se pudo eliminar el producto de la base de datos.");
      return;
    }
    const deletedProductIds = loadStoredList<string>("drex-market-deleted-products", []);
    if (!deletedProductIds.includes(productId)) localStorage.setItem("drex-market-deleted-products", JSON.stringify([...deletedProductIds, productId]));
    setProductList(productList.filter((product) => product.id !== productId));
    if (viewProductId === productId) setViewProductId(null);
  };


  const editProduct = (product: Product) => {
    const [weight = "", unit = "lb"] = String(product.weight || "").split(" ");
    setEditingProductId(product.id);
    setProductForm({
      slug: product.slug,
      name: product.name,
      brand: product.brand || "",
      category: product.category || "Mercado",
      weight,
      unit: unit || "lb",
      cost: String(product.cost ?? ""),
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
    });
    const provider = providerList.find((item) => item.name === product.provider);
    if (provider) setSelectedProvider(provider.id);
    setProductImagePreview(product.image || "");
    setShowProductForm(true);
    setViewProductId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const registerWaste = async () => {
    if (!selectedWasteProduct) return;
    const quantity = Math.max(0, Math.floor(Number(wasteForm.quantity || 0)));
    if (!quantity) { alert("Pon la cantidad de productos estropeados."); return; }
    if (quantity > selectedWasteProduct.stock) { alert("La merma no puede ser mayor que el stock actual."); return; }
    const finalCause = wasteForm.cause === "Otra causa" ? wasteForm.customCause.trim() : wasteForm.cause;
    if (!finalCause) { alert("Selecciona o escribe la causa de la merma."); return; }
    if (!wasteForm.responsible.trim() && wasteForm.payer !== "DREX asume") { alert("Pon el nombre del responsable o de quien lo rompió."); return; }
    const nextStock = selectedWasteProduct.stock - quantity;
    const response = await fetch(`/api/admin/products/${selectedWasteProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: selectedWasteProduct.slug,
        name: selectedWasteProduct.name,
        brand: selectedWasteProduct.brand,
        weight: selectedWasteProduct.weight,
        category: selectedWasteProduct.category,
        description: selectedWasteProduct.description,
        price: selectedWasteProduct.price,
        cost: selectedWasteProduct.cost,
        stock: nextStock,
        image: selectedWasteProduct.image,
      }),
    });
    if (!response.ok) { alert("No se pudo descontar la merma del stock."); return; }
    const savedProduct: Product = await response.json();
    setProductList(productList.map((product) => product.id === savedProduct.id ? { ...product, ...savedProduct } : product));
    setWasteRecords([{
      id: `MERMA-${Date.now()}`,
      productId: selectedWasteProduct.id,
      productName: selectedWasteProduct.name,
      productImage: selectedWasteProduct.image,
      quantity,
      cause: finalCause,
      payer: wasteForm.payer,
      responsible: wasteForm.responsible.trim() || "DREX",
      chargeAmount: selectedWasteProduct.cost * quantity,
      createdAt: new Date().toLocaleString("es-CU"),
    }, ...wasteRecords]);
    setWasteForm({ quantity: "", cause: "Llegó roto desde proveedor", customCause: "", payer: "Mensajero responsable", responsible: "" });
    setWasteSearch("");
    setSelectedWasteProductId("");
    setPreviewWasteProductId("");
  };

  const deleteWasteRecord = (recordId: string) => {
    if (!confirm("¿Seguro que quieres eliminar esta merma del historial? Esta acción no devuelve stock automáticamente.")) return;
    setWasteRecords(wasteRecords.filter((record) => record.id !== recordId));
  };

  const changeOrderStatus = (orderId: string, status: string) => setOrderList(orderList.map((order) => order.id === orderId ? { ...order, status } : order));
  const addProductToPromotion = (productName: string) => {
    const current = promotionForm.product.split(" + ").map((item) => item.trim()).filter(Boolean);
    if (current.includes(productName)) return;
    setPromotionForm({ ...promotionForm, product: [...current, productName].join(" + ") });
  };

  const addPromotion = () => {
    if (!promotionForm.name.trim()) return;
    setPromotionList([...promotionList, { id: `PROMO-BAU-${String(promotionList.length + 1).padStart(3, "0")}`, ...promotionForm }]);
    setPromotionForm({ name: "", discount: "", product: "", start: "", end: "", limit: "", status: "Activa" });
  };
  const togglePromotion = (id: string) => setPromotionList(promotionList.map((promo) => promo.id === id ? { ...promo, status: promo.status === "Activa" ? "Pausada" : "Activa" } : promo));
  const deletePromotion = (id: string) => setPromotionList(promotionList.filter((promo) => promo.id !== id));

  const changeOrdersStatusBulk = () => {
    const ids = bulkOrderIds.split(/[\s,;]+/).map((id) => id.trim().toUpperCase()).filter(Boolean);
    if (!ids.length) return;
    setOrderList(orderList.map((order) => ids.includes(order.id.toUpperCase()) ? { ...order, status: bulkOrderStatus } : order));
    setBulkOrderIds("");
  };

  const scrollAdminMenu = (direction: "left" | "right") => {
    adminMenuRef.current?.scrollBy({ left: direction === "left" ? -260 : 260, behavior: "smooth" });
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

  const onImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProductImagePreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  };
  const onProviderImage = (file?: File) => {
    if (!file) return;
    setProviderImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => setProviderImagePreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  return <main className="mx-auto max-w-7xl px-4 pb-10 pt-5 lg:px-8"><div className="admin-dashboard-hero mb-4"><div className="admin-dashboard-hero-content"><h1 className="text-4xl font-black text-white">Dashboard administrativo</h1><p className="mt-2 max-w-2xl text-white/90">Gestiona productos, proveedores, promociones, pedidos y liquidaciones demo desde un solo panel.</p></div></div><section className="mt-4 space-y-8"><nav className={`demo-card admin-section-palette ${adminMenuScrollable ? "" : "admin-section-palette-fit"}`} aria-label="Secciones del panel administrativo"><button type="button" onClick={() => scrollAdminMenu("left")} className="admin-section-arrow" aria-label="Desplazar secciones a la izquierda"><span>‹</span></button><div ref={adminMenuRef} className="admin-section-scroll">{menu.map((item) => <button key={item.label} title={item.label} data-label={item.label} onClick={() => setSection(item.label)} className={`admin-section-button ${section === item.label ? "admin-section-button-active" : ""}`} aria-label={item.label}><img src={`/assets/admin/icons/${item.icon}`} alt="" aria-hidden="true" /></button>)}</div><button type="button" onClick={() => scrollAdminMenu("right")} className="admin-section-arrow" aria-label="Desplazar secciones a la derecha"><span>›</span></button></nav><div className="space-y-8">

{section === "Dashboard" && <section className="space-y-5"><div className="demo-card p-6"><p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Panel general</p><h2 className="mt-2 text-2xl font-black">Resumen operativo DREX Market</h2><p className="mt-1 text-sm text-slate-600">Vista rápida para detectar ventas, órdenes, crédito interno, productos líderes y proveedores clave.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[["Ventas demo", formatMoney(analytics.totalSales), "↗ +12% semanal"], ["Órdenes", "4", "2 activas"], ["Ganancia bruta", formatMoney(analytics.grossProfit), "Margen demo"], ["Créditos DREX", formatMoney(analytics.circulatingBalance), "Circulando"], ["Producto rentable", "Combo Almuerzo", "+$225 demo"], ["Proveedor líder", "Bauta Alimentos", "Mayor volumen" ]].map(([label,value,note]) => <article key={label} className="demo-card min-h-[120px] p-[18px]"><div className="flex items-start justify-between gap-3"><div><p className="text-[13px] font-bold text-slate-500">{label}</p><p className="mt-2 text-[28px] font-extrabold tracking-[-0.03em] text-slate-950">{value}</p><p className="mt-1 text-xs font-bold text-emerald-700">{note}</p></div><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-lg">◆</span></div></article>)}</div></section>}
{section === "Municipios" && <section className="demo-card p-6"><h2 className="text-2xl font-black">Municipios</h2><p className="mt-2 text-slate-600">Bauta disponible. Resto próximamente.</p></section>}

{section === "Proveedores" && <><section className="demo-card p-6"><button onClick={() => setShowProviderForm(!showProviderForm)} className="w-full text-left"><span className="text-2xl font-black">{editingProviderId ? "Modificar proveedor" : "Agregar nuevo proveedor"}</span><span className="block text-sm text-slate-600">Pincha aquí para contraer o expandir el formulario.</span></button>{showProviderForm && <div className="mt-5 space-y-4"><div className="grid gap-4 md:grid-cols-[1fr_190px]"><div className="grid gap-3"><Field label="Nombre del proveedor" value={providerForm.name} onChange={(v)=>setProviderForm({...providerForm,name:v})}/><label className="space-y-2"><span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Municipio</span><select value={providerForm.municipality} onChange={(e)=>setProviderForm({...providerForm,municipality:e.target.value})}><option>Bauta</option></select></label><Field label="ID automático" readOnly value={providerAutoId}/></div><label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center">{providerImagePreview ? <img src={providerImagePreview} alt="Imagen" className="h-28 w-28 rounded-2xl object-contain bg-white p-2"/> : <span className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-sm font-black text-slate-400">Imagen</span>}<input className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e)=>onProviderImage(e.target.files?.[0])}/></label></div><div className="grid gap-3"><Field label="Teléfono" value={providerForm.phone} onChange={(v)=>setProviderForm({...providerForm,phone:v})}/><Field label="Teléfono alternativo" value={providerForm.altPhone} onChange={(v)=>setProviderForm({...providerForm,altPhone:v})}/><label className="space-y-2"><span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Categoría</span><select value={providerForm.category} onChange={(e)=>setProviderForm({...providerForm,category:e.target.value})}><option>Mercado</option><option>Ferretería</option><option>Peletería</option><option>Aseo e higiene</option><option>Combos familiares</option><option>Electrodomésticos</option><option>Perfumería</option></select></label><Field label="Notas" value={providerForm.notes} onChange={(v)=>setProviderForm({...providerForm,notes:v})}/><button onClick={saveProvider} className="btn-dark">{editingProviderId ? "Guardar cambios" : "Guardar proveedor demo"}</button></div></div>}</section><section className="demo-card p-6"><h2 className="text-2xl font-black">Lista de proveedores</h2><input className="mt-4" placeholder="Buscar por Bauta, nombre, teléfono..." value={providerSearch} onChange={(e)=>setProviderSearch(e.target.value)}/><p className="mt-3 text-sm font-bold text-slate-500">Resultados: {filteredProviders.length}</p><div className="mt-4 grid gap-3">{filteredProviders.map((p)=>{ const open = viewProvider?.id === p.id; return <article key={p.id} onClick={()=>setViewProvider(open ? null : p)} className={`cursor-pointer rounded-2xl border p-4 transition hover:border-emerald-200 hover:bg-emerald-50/50 ${open ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3"><div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white p-2">{p.image ? <img src={p.image} alt={p.name} className="h-full w-full rounded-xl object-contain"/> : <span className="text-[10px] font-black text-slate-400">Sin foto</span>}</div><div><p className="text-xs font-black text-emerald-700">{p.id}</p><h3 className="text-lg font-black">{p.name}</h3><p className="text-sm text-slate-600">{p.category} · {p.municipality} · Tel: {p.phone}</p></div></div><div className="flex flex-wrap gap-2"><button onClick={(event)=>{event.stopPropagation(); editProvider(p);}} className="w-fit rounded-full bg-sky-50 px-4 py-2 text-xs font-black text-sky-700">Modificar</button><button onClick={(event)=>{event.stopPropagation(); deleteProvider(p.id);}} className="w-fit rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-700">Eliminar</button></div></div>{open && <div className="mt-4 grid gap-2 rounded-2xl bg-white/80 p-4 text-sm font-semibold text-slate-700 md:grid-cols-2"><p>ID: {p.id}</p><p>Nombre: {p.name}</p><p>Categoría: {p.category}</p><p>Municipio: {p.municipality}</p><p>Provincia: {p.province}</p><p>Teléfono: {p.phone || "Sin teléfono"}</p><p>Estado: {p.status}</p><p>Imagen: {p.imageFile ?? "Sin foto"}</p></div>}</article>})}</div></section></>}

{section === "Productos" && <><section className="demo-card p-6"><div role="button" tabIndex={0} onClick={() => setShowProductForm(!showProductForm)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setShowProductForm(!showProductForm); }} className="cursor-pointer select-none" aria-expanded={showProductForm}><h2 className="text-2xl font-black">{editingProductId ? "Editar producto" : "Agregar nuevo producto"}</h2><p className="mt-1 text-sm font-semibold text-slate-600">Pincha el título para contraer o expandir el formulario.</p></div>{showProductForm && <div className="mt-5"><div className="grid gap-6 md:grid-cols-[1fr_240px]"><div className="grid gap-4"><label className="space-y-2"><span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Proveedor</span><select value={selectedProvider} onChange={(e)=>setSelectedProvider(e.target.value)}>{providerList.map((p)=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><Field label="Municipio automático" readOnly value={activeProvider ? `${activeProvider.municipality}, ${activeProvider.province}` : ""}/><Field label="ID automático" readOnly value={productAutoId}/></div><label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center md:min-h-full"><span className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-4xl md:h-36 md:w-36">{productImagePreview ? <img src={productImagePreview} alt="Preview" className="h-full w-full rounded-3xl object-contain p-2"/> : "+"}</span><input className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e)=>onImage(e.target.files?.[0])}/></label></div><div className="mt-4 grid gap-3"><Field label="Nombre identificativo" value={productForm.slug} onChange={(v)=>setProductForm({...productForm,slug:v})}/><Field label="Nombre comercial" value={productForm.name} onChange={(v)=>setProductForm({...productForm,name:v})}/><Field label="Marca" value={productForm.brand} onChange={(v)=>setProductForm({...productForm,brand:v})}/><label className="space-y-2"><span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Categoría</span><select value={productForm.category} onChange={(e)=>setProductForm({...productForm,category:e.target.value})}>{productCategories.map((category)=><option key={category}>{category}</option>)}</select></label><div className="grid gap-4 md:grid-cols-[1fr_180px]"><Field label="Peso" type="number" value={productForm.weight} onChange={(v)=>setProductForm({...productForm,weight:v})}/><label className="space-y-2"><span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Unidad</span><select value={productForm.unit} onChange={(e)=>setProductForm({...productForm,unit:e.target.value})}><option>lb</option><option>g</option><option>kg</option><option>l</option><option>ml</option></select></label></div><Field label="Stock inicial" type="number" value={productForm.stock} onChange={(v)=>setProductForm({...productForm,stock:v})}/><div className="grid gap-4 md:grid-cols-2"><Field label="Precio de compra" type="number" value={productForm.cost} onChange={(v)=>setProductForm({...productForm,cost:v})}/><Field label="Precio de venta" type="number" value={productForm.price} onChange={(v)=>setProductForm({...productForm,price:v})}/></div><div className="grid gap-2 sm:grid-cols-2"><button onClick={addProduct} className="group relative overflow-hidden rounded-full border border-orange-200 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 px-5 py-3 text-xs font-black text-white shadow-xl shadow-orange-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-orange-300 active:translate-y-0 md:static"><span className="relative z-10 flex items-center justify-center gap-2"><span>✓</span>{editingProductId ? "Guardar cambios del producto" : "Guardar producto demo"}</span><span className="absolute inset-y-0 left-0 w-1/3 bg-white/40 opacity-0 blur-xl transition group-hover:opacity-100" /></button>{editingProductId && <button type="button" onClick={resetProductForm} className="group relative overflow-hidden rounded-full border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-100 px-5 py-3 text-xs font-black text-slate-700 shadow-lg shadow-slate-100 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xl active:translate-y-0"><span className="relative z-10 flex items-center justify-center gap-2"><span>↺</span>Cancelar edición</span><span className="absolute inset-y-0 left-0 w-1/3 bg-white/60 opacity-0 blur-xl transition group-hover:opacity-100" /></button>}</div></div></div>}</section><section className="demo-card p-6"><h2 className="text-2xl font-black">Lista de productos</h2><p className="mt-1 text-sm font-semibold text-slate-600">Lista compacta: toca el box del producto para ver detalles y agregar stock.</p><input className="mt-4" placeholder="Buscar producto por nombre..." value={productSearch} onChange={(e)=>setProductSearch(e.target.value)}/><p className="mt-3 text-sm font-bold text-slate-500">Resultados: {filteredProducts.length}</p><div className="mt-5 grid gap-2">{filteredProducts.map((p)=>{ const isOut = p.stock <= 0; return <article key={p.id} className={`rounded-2xl border bg-slate-50 p-3 ${isOut ? "border-red-500 ring-2 ring-red-100" : "border-slate-200"}`}><div role="button" tabIndex={0} onClick={()=>setViewProductId(viewProductId === p.id ? null : p.id)} onKeyDown={(event)=>{ if (event.key === "Enter" || event.key === " ") setViewProductId(viewProductId === p.id ? null : p.id); }} className="flex w-full cursor-pointer select-none flex-col gap-2 rounded-2xl p-1 transition hover:bg-white md:flex-row md:items-center md:justify-between"><div className="flex min-w-0 items-center gap-2"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white p-1 text-lg">{p.image?.startsWith?.("blob:") || p.image?.startsWith?.("data:") ? <img src={p.image} alt={p.name} className="h-full w-full rounded-lg object-contain"/> : p.image ? <span>{p.image}</span> : <span className="text-[9px] font-black text-slate-400">+</span>}</span><h3 className="truncate text-sm font-black text-slate-950">{p.slug}</h3>{isOut && <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-black text-white">agotado</span>}</div><span className={isOut ? "w-fit rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-black text-red-700" : "w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700"}>Stock: {p.stock}</span></div>{viewProductId === p.id && <div className="mt-3 grid gap-4 rounded-2xl bg-white p-4 md:grid-cols-[140px_1fr]"><div className="flex items-center justify-center rounded-2xl bg-slate-50 p-3">{(p.image?.startsWith?.("blob:") || p.image?.startsWith?.("data:")) ? <img src={p.image} alt={p.name} className="h-28 w-28 rounded-xl object-contain"/> : p.image ? <span className="text-5xl">{p.image}</span> : <span className="text-xs font-black text-slate-400">Sin imagen</span>}</div><div className="grid gap-2 text-sm font-semibold text-slate-700 md:grid-cols-2"><p>Nombre: {p.name}</p><p>Proveedor: {p.provider}</p><p>Marca: {p.brand}</p><p>Categoría: {p.category}</p><p className="font-black">Peso para reparto: {p.weight}</p><p className={isOut ? "font-black text-red-700" : ""}>Stock actual: {p.stock} {isOut ? "— no disponible para compra" : ""}</p><p>Imagen: {p.imageFile}</p><p>Fecha alta: {p.createdAt ?? "Producto demo inicial"}</p><p>Compra: {formatMoney(p.cost)}</p><p>Venta actual: {formatMoney(p.price)}</p><div className="mt-3 grid gap-2 md:col-span-2 sm:grid-cols-2 xl:grid-cols-[minmax(0,160px)_auto_minmax(0,160px)_auto_auto] xl:items-center"><input className="w-full" type="number" placeholder="Agregar stock" value={stockToAdd} onChange={(e)=>setStockToAdd(e.target.value)}/><button type="button" onClick={()=>addStock(p.id)} className="group relative min-h-11 w-full overflow-hidden rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-white px-4 py-2 text-xs font-black text-emerald-800 shadow-lg shadow-emerald-100 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:from-emerald-100 hover:shadow-xl hover:shadow-emerald-200 active:translate-y-0 xl:w-auto"><span className="relative z-10 flex items-center justify-center gap-1.5"><span>＋</span>Sumar stock</span><span className="absolute inset-y-0 left-0 w-1/3 bg-white/50 opacity-0 blur-xl transition group-hover:opacity-100" /></button><input className="w-full" type="number" placeholder="Nuevo precio" value={newPrice} onChange={(e)=>setNewPrice(e.target.value)}/><button type="button" onClick={()=>changeProductPrice(p.id)} className="group relative min-h-11 w-full overflow-hidden rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-white px-4 py-2 text-xs font-black text-amber-800 shadow-lg shadow-amber-100 transition duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:from-amber-100 hover:shadow-xl hover:shadow-amber-200 active:translate-y-0 xl:w-auto"><span className="relative z-10 flex items-center justify-center gap-1.5"><span>$</span>Cambiar precio</span><span className="absolute inset-y-0 left-0 w-1/3 bg-white/50 opacity-0 blur-xl transition group-hover:opacity-100" /></button><div className="grid gap-2 sm:col-span-2 sm:grid-cols-2 xl:col-span-1"><button type="button" onClick={()=>editProduct(p)} className="group relative min-h-11 w-full overflow-hidden rounded-full border border-sky-200 bg-gradient-to-r from-sky-50 via-cyan-50 to-white px-4 py-2 text-xs font-black text-sky-800 shadow-lg shadow-sky-100 transition duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:from-sky-100 hover:to-cyan-50 hover:shadow-xl hover:shadow-sky-200 active:translate-y-0"><span className="relative z-10 flex items-center justify-center gap-1.5"><span className="text-sm">✎</span>Editar producto</span><span className="absolute inset-y-0 left-0 w-1/3 bg-white/50 opacity-0 blur-xl transition group-hover:opacity-100" /></button><button type="button" onClick={()=>deleteProduct(p.id)} className="group relative min-h-11 w-full overflow-hidden rounded-full border border-rose-200 bg-gradient-to-r from-rose-50 via-red-50 to-white px-4 py-2 text-xs font-black text-rose-800 shadow-lg shadow-rose-100 transition duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:from-rose-100 hover:to-red-50 hover:shadow-xl hover:shadow-rose-200 active:translate-y-0"><span className="relative z-10 flex items-center justify-center gap-1.5"><span className="text-sm">×</span>Eliminar producto</span><span className="absolute inset-y-0 left-0 w-1/3 bg-white/50 opacity-0 blur-xl transition group-hover:opacity-100" /></button></div></div>{(p.priceHistory?.length ?? 0) > 0 && <div className="md:col-span-2 rounded-2xl bg-slate-50 p-3"><p className="font-black">Historial de precio</p>{p.priceHistory?.map((item, index) => <p key={index} className="text-xs">{item.date}: {formatMoney(item.oldPrice)} → {formatMoney(item.newPrice)} ({item.variation >= 0 ? "+" : ""}{formatMoney(item.variation)})</p>)}</div>}</div></div>}</article>})}</div></section></>}


{section === "Merma" && <section className="space-y-6"><section className="demo-card p-6"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-black uppercase tracking-[0.18em] text-rose-600">Control de merma</p><h2 className="mt-2 text-2xl font-black text-slate-950">Productos estropeados o perdidos</h2><p className="mt-1 text-sm font-semibold text-slate-600">Selecciona un producto, registra la cantidad dañada, causa y quién paga. Al guardar se descuenta del stock real.</p></div><div className="rounded-3xl bg-rose-50 p-4 text-center"><p className="text-xs font-black uppercase tracking-[0.16em] text-rose-500">Mermas registradas</p><p className="text-3xl font-black text-rose-700">{wasteRecords.length}</p></div></div><div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]"><div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><input placeholder="Buscar producto por nombre, proveedor, marca o ID..." value={wasteSearch} onChange={(e)=>setWasteSearch(e.target.value)}/>{wasteSearch.trim() ? <><p className="mt-3 text-sm font-bold text-slate-500">Resultados: {filteredWasteProducts.length}</p><div className="mt-4 grid max-h-[430px] gap-2 overflow-y-auto pr-1">{filteredWasteProducts.length ? filteredWasteProducts.map((product)=><button key={product.id} type="button" onClick={()=>{setPreviewWasteProductId(product.id);setSelectedWasteProductId("");}} className={`flex items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-left transition ${previewWasteProductId === product.id || selectedWasteProductId === product.id ? "border-rose-300 bg-white shadow-lg shadow-rose-100" : "border-slate-200 bg-white/70 hover:border-emerald-200 hover:bg-white"}`}><span className="flex min-w-0 items-center gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-1">{(product.image?.startsWith?.("blob:") || product.image?.startsWith?.("data:")) ? <img src={product.image} alt={product.name} className="h-full w-full rounded-lg object-contain"/> : product.image ? <span className="text-2xl">{product.image}</span> : <span className="text-[9px] font-black text-slate-400">Sin imagen</span>}</span><span className="min-w-0"><span className="block truncate text-sm font-black text-slate-950">{product.name}</span><span className="block truncate text-xs font-bold text-slate-500">{product.provider} · {product.slug}</span></span></span><span className={product.stock <= 0 ? "rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-black text-red-700" : "rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700"}>Stock: {product.stock}</span></button>) : <p className="rounded-2xl bg-white p-4 text-sm font-bold text-slate-500">No hay productos que coincidan con esa búsqueda.</p>}</div></> : <p className="mt-3 text-sm font-bold text-slate-400">Escribe para buscar y mostrar productos.</p>}</div><aside className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xl shadow-rose-50"><h3 className="text-xl font-black text-slate-950">Registrar merma</h3>{selectedWasteProduct ? <div className="mt-4 space-y-4"><div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"><span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white p-2">{(selectedWasteProduct.image?.startsWith?.("blob:") || selectedWasteProduct.image?.startsWith?.("data:")) ? <img src={selectedWasteProduct.image} alt={selectedWasteProduct.name} className="h-full w-full rounded-xl object-contain"/> : selectedWasteProduct.image ? <span className="text-3xl">{selectedWasteProduct.image}</span> : <span className="text-[10px] font-black text-slate-400">Sin imagen</span>}</span><div><p className="text-sm font-black text-slate-950">{selectedWasteProduct.name}</p><p className="text-xs font-bold text-slate-500">Stock actual: {selectedWasteProduct.stock} · Costo: {formatMoney(selectedWasteProduct.cost)}</p></div></div><Field label="Cantidad estropeada" type="number" value={wasteForm.quantity} onChange={(v)=>setWasteForm({...wasteForm,quantity:v})}/><label className="space-y-2"><span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Causa</span><select value={wasteForm.cause} onChange={(e)=>setWasteForm({...wasteForm,cause:e.target.value})}>{wasteCauses.map((cause)=><option key={cause}>{cause}</option>)}</select></label><label className="space-y-2"><span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Detalle / otra causa</span><textarea className="min-h-20 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold" placeholder={wasteForm.cause === "Otra causa" ? "Escribe la causa exacta..." : "Opcional: detalles de lo ocurrido..."} value={wasteForm.customCause} onChange={(e)=>setWasteForm({...wasteForm,customCause:e.target.value})}/></label><label className="space-y-2"><span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Quién paga</span><select value={wasteForm.payer} onChange={(e)=>setWasteForm({...wasteForm,payer:e.target.value})}><option>Mensajero responsable</option><option>Proveedor</option><option>DREX asume</option><option>Cliente</option></select></label><Field label="Nombre del responsable" placeholder="Ej: Carlos, mensajero turno tarde" value={wasteForm.responsible} onChange={(v)=>setWasteForm({...wasteForm,responsible:v})}/><div className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800">A descontar/cobrar: {formatMoney((Number(wasteForm.quantity || 0) || 0) * selectedWasteProduct.cost)} {wasteForm.payer === "Mensajero responsable" ? `al mensajero${wasteForm.responsible ? `: ${wasteForm.responsible}` : " responsable"}` : wasteForm.responsible ? `a: ${wasteForm.payer} · ${wasteForm.responsible}` : `a: ${wasteForm.payer}`}</div><button type="button" onClick={registerWaste} className="group relative min-h-12 w-full overflow-hidden rounded-full border border-rose-200 bg-gradient-to-r from-rose-500 via-red-500 to-orange-400 px-5 py-3 text-xs font-black text-white shadow-xl shadow-rose-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0"><span className="relative z-10 flex items-center justify-center gap-2"><span>−</span>Registrar merma y descontar stock</span><span className="absolute inset-y-0 left-0 w-1/3 bg-white/40 opacity-0 blur-xl transition group-hover:opacity-100" /></button></div> : <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">Busca un producto y tócalo para revisarlo antes de registrar la merma.</p>}</aside></div></section><section className="demo-card p-6"><h2 className="text-2xl font-black">Historial de merma</h2><p className="mt-1 text-sm font-semibold text-slate-600">Sirve para recordar qué se debe cobrar al mensajero/proveedor o asumir internamente.</p><div className="mt-4 grid gap-3">{wasteRecords.length ? wasteRecords.map((record)=><article key={record.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div className="flex min-w-0 items-center gap-3"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white p-1 shadow-sm">{record.productImage?.startsWith?.("data:") || record.productImage?.startsWith?.("blob:") ? <img src={record.productImage} alt={record.productName} className="h-full w-full rounded-xl object-contain"/> : record.productImage ? <span className="text-2xl">{record.productImage}</span> : <span className="text-[9px] font-black text-slate-400">Sin imagen</span>}</span><div className="min-w-0"><p className="text-xs font-black text-rose-600">{record.id}</p><h3 className="truncate font-black text-slate-950">{record.productName} · x{record.quantity}</h3><p className="text-sm font-semibold text-slate-600">{record.cause}</p></div></div><div className="text-left md:text-right"><p className="text-sm font-black text-slate-950">{formatMoney(record.chargeAmount)}</p><p className="text-xs font-bold text-slate-500">Paga: {record.payer}</p><p className="text-xs font-bold text-slate-500">Responsable: {record.responsible || "Sin nombre"}</p><p className="text-xs font-bold text-slate-400">{record.createdAt}</p><button type="button" onClick={()=>deleteWasteRecord(record.id)} className="mt-2 rounded-full border border-rose-200 bg-white px-2.5 py-1 text-[10px] font-black text-rose-700 transition hover:bg-rose-50">Eliminar</button></div></div></article>) : <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">Todavía no hay mermas registradas.</p>}</div></section></section>}


{previewWasteProduct && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true"><div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl shadow-slate-950/30"><div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-rose-600">Confirmar producto</p><h3 className="text-xl font-black text-slate-950">¿Este es el producto?</h3></div><button type="button" onClick={()=>setPreviewWasteProductId("")} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl font-black text-slate-600 transition hover:bg-slate-200">×</button></div><div className="grid gap-5 p-5 md:grid-cols-[240px_1fr]"><div className="flex min-h-64 items-center justify-center rounded-3xl bg-slate-50 p-4">{(previewWasteProduct.image?.startsWith?.("blob:") || previewWasteProduct.image?.startsWith?.("data:")) ? <img src={previewWasteProduct.image} alt={previewWasteProduct.name} className="max-h-72 w-full object-contain"/> : previewWasteProduct.image ? <span className="text-8xl">{previewWasteProduct.image}</span> : <span className="text-sm font-black text-slate-400">Sin imagen</span>}</div><div className="space-y-4"><div><h4 className="text-3xl font-black leading-tight text-slate-950">{previewWasteProduct.name}</h4><p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{previewWasteProduct.description || "Sin descripción."}</p></div><div className="grid gap-2 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600"><span>Proveedor: {previewWasteProduct.provider}</span><span>Marca: {previewWasteProduct.brand || "Sin marca"}</span><span>Categoría: {previewWasteProduct.category}</span><span>Peso/unidad: {previewWasteProduct.weight || "No definido"}</span><span>Slug/ID: {previewWasteProduct.slug}</span><span>Stock actual: {previewWasteProduct.stock}</span><span>Costo: {formatMoney(previewWasteProduct.cost)}</span><span>Precio venta: {formatMoney(previewWasteProduct.price)}</span></div><div className="grid gap-2 sm:grid-cols-2"><button type="button" onClick={()=>{setSelectedWasteProductId(previewWasteProduct.id);setPreviewWasteProductId("");}} className="group relative min-h-12 w-full overflow-hidden rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 px-5 py-3 text-xs font-black text-white shadow-xl shadow-emerald-100 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0"><span className="relative z-10">Seleccionar este</span><span className="absolute inset-y-0 left-0 w-1/3 bg-white/40 opacity-0 blur-xl transition group-hover:opacity-100" /></button><button type="button" onClick={()=>{setPreviewWasteProductId("");setSelectedWasteProductId("");}} className="group relative min-h-12 w-full overflow-hidden rounded-full border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-100 px-5 py-3 text-xs font-black text-slate-700 shadow-lg shadow-slate-100 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xl active:translate-y-0"><span className="relative z-10">Volver a búsqueda</span><span className="absolute inset-y-0 left-0 w-1/3 bg-white/60 opacity-0 blur-xl transition group-hover:opacity-100" /></button></div></div></div></div></div>}

{section === "Promociones" && <section className="demo-card p-6"><button onClick={()=>setShowPromoForm(!showPromoForm)} className="flex w-full items-center justify-between text-left"><span><span className="text-2xl font-black">Promociones</span><span className="block text-sm text-slate-600">Crear descuentos, combos, fechas activas y límites de uso. Todo es demo.</span></span><span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">{showPromoForm ? "Ocultar" : "Crear promoción"}</span></button>{showPromoForm && <div className="mt-5 grid gap-4 md:grid-cols-2"><Field label="Nombre de la promoción" value={promotionForm.name} onChange={(v)=>setPromotionForm({...promotionForm,name:v})}/><Field label="Descuento %" type="number" value={promotionForm.discount} onChange={(v)=>setPromotionForm({...promotionForm,discount:v})}/><div className="space-y-2 md:col-span-2"><span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Productos incluidos</span><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-bold text-slate-700">{promotionForm.product || "Ningún producto seleccionado"}</p><button type="button" onClick={()=>setShowPromoProductSelector(true)} className="mt-3 rounded-full bg-sky-50 px-4 py-2 text-xs font-black text-sky-700">Abrir selector de productos</button></div></div><Field label="Límite de usos" type="number" value={promotionForm.limit} onChange={(v)=>setPromotionForm({...promotionForm,limit:v})}/><Field label="Fecha inicio" type="date" value={promotionForm.start} onChange={(v)=>setPromotionForm({...promotionForm,start:v})}/><Field label="Fecha fin" type="date" value={promotionForm.end} onChange={(v)=>setPromotionForm({...promotionForm,end:v})}/><label className="space-y-2"><span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Estado</span><select value={promotionForm.status} onChange={(e)=>setPromotionForm({...promotionForm,status:e.target.value})}><option>Activa</option><option>Pausada</option></select></label><button onClick={addPromotion} className="btn-dark">Guardar promoción demo</button></div>}<div className="mt-6 grid gap-4 md:grid-cols-2">{promotionList.map((promo)=><article key={promo.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black text-emerald-700">{promo.id}</p><h3 className="text-lg font-black">{promo.name}</h3><p className="text-sm text-slate-600">{promo.discount}% demo · {promo.status}</p></div><span className={promo.status === "Activa" ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700" : "rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700"}>{promo.status}</span></div><div className="mt-3 grid gap-1 text-sm font-semibold text-slate-600"><p>Producto/combo: {promo.product}</p><div className="mt-2 flex flex-wrap gap-2">{getPromotionProducts(promo.product).map((product) => <div key={`${promo.id}-${product.id}`} className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 p-1">{(product.image?.startsWith?.("blob:") || product.image?.startsWith?.("data:")) ? <img src={product.image} alt={product.name} className="h-full w-full rounded-lg object-contain"/> : product.image ? <span className="text-2xl">{product.image}</span> : <span className="text-[9px] font-black text-slate-400">Sin imagen</span>}</span><span className="text-xs font-black text-slate-700">{product.name}</span></div>)}</div><p>Fechas: {promo.start || "Sin inicio"} → {promo.end || "Sin fin"}</p><p>Límite: {promo.limit || "Sin límite"} usos demo</p></div><div className="mt-4 flex flex-wrap gap-2"><button onClick={()=>togglePromotion(promo.id)} className="rounded-full bg-sky-50 px-4 py-2 text-xs font-black text-sky-700">{promo.status === "Activa" ? "Pausar" : "Activar"}</button><button onClick={()=>deletePromotion(promo.id)} className="rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-700">Eliminar</button></div></article>)}</div></section>}
{showPromoProductSelector && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"><section className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="text-2xl font-black text-slate-950">Seleccionar productos para promoción</h2><p className="text-sm font-semibold text-slate-600">Busca, agrega productos y luego regresa al formulario.</p></div><button onClick={()=>setShowPromoProductSelector(false)} className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">Regresar a promoción</button></div><div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Seleccionados</p><p className="mt-1 text-sm font-bold text-slate-700">{promotionForm.product || "Ningún producto seleccionado"}</p></div><input className="mt-4" placeholder="Buscar producto para la promo..." value={promoProductSearch} onChange={(e)=>setPromoProductSearch(e.target.value)}/><p className="mt-2 text-xs font-bold text-slate-500">Resultados: {filteredPromoProducts.length}</p><div className="mt-4 grid gap-3">{filteredPromoProducts.map((product)=><button key={product.id} type="button" onClick={()=>addProductToPromotion(product.name)} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-left text-sm font-bold text-slate-700"><span className="flex items-center gap-3"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white p-1">{(product.image?.startsWith?.("blob:") || product.image?.startsWith?.("data:")) ? <img src={product.image} alt={product.name} className="h-full w-full rounded-lg object-contain"/> : product.image ? <span className="text-2xl">{product.image}</span> : <span className="text-[9px] font-black text-slate-400">Sin imagen</span>}</span><span>{product.id} · {product.name}</span></span><span className="text-emerald-700">Agregar</span></button>)}</div></section></div>}

{(section === "Pedidos" || section === "Seguimiento") && <section className="demo-card p-6"><h2 className="text-2xl font-black">{section === "Seguimiento" ? "Seguimiento de órdenes" : "Pedidos"}</h2><p className="mt-1 text-sm font-semibold text-slate-600">Lista contraída: ID, municipio y botón Expandir/Contraer. Aquí cae también la orden creada desde el carrito demo.</p><div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"><input placeholder="Buscar pedido por ID..." value={orderSearch} onChange={(e)=>setOrderSearch(e.target.value)}/><div className="grid gap-3 md:grid-cols-[1fr_220px_160px]"><textarea className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold" placeholder="IDs para cambio masivo, separados por coma o salto de línea" value={bulkOrderIds} onChange={(e)=>setBulkOrderIds(e.target.value)}/><select value={bulkOrderStatus} onChange={(e)=>setBulkOrderStatus(e.target.value)}><option>Recibido</option><option>Pago confirmado</option><option>Preparando</option><option>En reparto</option><option>Entregado</option><option>Cancelado</option></select><button onClick={changeOrdersStatusBulk} className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">Cambiar grupo</button></div><p className="text-xs font-bold text-slate-500">Pega una lista como DO26062600001, DO26062600002 y aplica un estado a todos.</p></div><p className="mt-3 text-sm font-bold text-slate-500">Resultados: {filteredOrders.length}</p><div className="mt-5 grid gap-4">{filteredOrders.map((o, index)=>{ const open = viewOrderId === o.id; return <article key={o.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div className="flex flex-wrap items-center gap-3"><span className="text-xs font-black text-emerald-700">{o.id}</span><span className="text-sm font-bold text-slate-700">Bauta, Artemisa</span><button onClick={()=>setViewOrderId(open ? null : o.id)} className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-600">{open ? "Contraer" : "Expandir"}</button></div><span className="inline-flex min-h-7 items-center justify-center rounded-full bg-sky-50 px-3 py-1 text-center text-xs font-black leading-none text-sky-700">{o.status}</span></div>{open && <><div className="mt-4 grid gap-2 text-sm font-semibold text-slate-700 md:grid-cols-2"><p>Cliente: {o.customer}</p><p>Beneficiario: {o.beneficiary}</p><p>Productos: {index === 0 ? "Combo Familiar x1 + Kit Aseo x2" : index === 1 ? "Combo Desayuno x1 + Paquete Limpieza x1" : "Producto demo x1"}</p><p>Peso total reparto: {index === 0 ? "9 lb" : index === 1 ? "4 lb" : "2 lb"}</p><p>Total pagado: {formatMoney(o.total)}</p><p>Método/pago: {o.payment}</p><p>Proveedor: {index % 2 === 0 ? "Proveedor Bauta Alimentos" : "Proveedor Bauta Aseo"}</p><p>Repartidor: {o.courier}</p><p>Fecha pedido: 25/06/2026</p><p>Entrega estimada: 24-48h demo</p></div><div className="mt-4 flex flex-wrap items-center gap-2"><span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Cambiar estado</span><select className="max-w-56" value={o.status} onChange={(e)=>changeOrderStatus(o.id, e.target.value)}><option>Recibido</option><option>Pago confirmado</option><option>Preparando</option><option>En reparto</option><option>Entregado</option><option>Cancelado</option></select></div></>}</article>})}</div></section>}
{section === "Billeteras" && <section className="demo-card p-6"><h2 className="text-2xl font-black">Billeteras</h2>{walletTransactions.map(t=><p key={t.id}>{t.owner} · {t.type} · {formatMoney(t.amount)}</p>)}</section>}
{section === "Reportes" && <section className="space-y-8"><section className="demo-card p-6"><h2 className="text-2xl font-black">Proveedores en reportes</h2><p className="mt-1 text-sm font-semibold text-slate-600">Identificación rápida de proveedores dentro del análisis.</p><div className="mt-5 grid gap-4 md:grid-cols-3">{providerList.map((p)=><article key={p.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center gap-3"><div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white p-2">{p.image ? <img src={p.image} alt={p.name} className="h-full w-full rounded-xl object-contain"/> : <span className="text-[10px] font-black text-slate-400">Sin foto</span>}</div><div><p className="text-xs font-black text-emerald-700">{p.id}</p><h3 className="font-black text-slate-950">{p.name}</h3><p className="text-xs font-semibold text-slate-600">{p.category} · {p.municipality}</p></div></div></article>)}</div></section><IntelligencePanel /></section>}
</div></section></main>;
}
