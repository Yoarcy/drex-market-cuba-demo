export const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-CU", { style: "currency", currency: "USD" }).format(value);

export const municipalities = [
  "Artemisa",
  "Alquízar",
  "Bahía Honda",
  "Bauta",
  "Caimito",
  "Candelaria",
  "Guanajay",
  "Güira de Melena",
  "Mariel",
  "San Antonio de los Baños",
  "San Cristóbal",
].map((name) => ({
  name,
  available: name === "Bauta",
}));

export const providers = [
  {
    id: "PROV-BAU-001",
    name: "Proveedor Bauta Alimentos",
    municipality: "Bauta",
    province: "Artemisa",
    category: "Alimentos y combos",
    contact: "Operador Demo A",
    phone: "+53 5000 0101",
    status: "Activo",
  },
  {
    id: "PROV-BAU-002",
    name: "Proveedor Bauta Aseo",
    municipality: "Bauta",
    province: "Artemisa",
    category: "Aseo e higiene",
    contact: "Operador Demo B",
    phone: "+53 5000 0102",
    status: "Activo",
  },
  {
    id: "PROV-BAU-003",
    name: "Proveedor Combos Familiares",
    municipality: "Bauta",
    province: "Artemisa",
    category: "Combos familiares",
    contact: "Operador Demo C",
    phone: "+53 5000 0103",
    status: "Activo",
  },
];

export const products = [
  {
    id: "PRD-BAU-0001",
    slug: "combo-familiar-bauta",
    name: "Combo Familiar Bauta",
    brand: "DREX Demo",
    weight: "Combo familiar",
    category: "Combos familiares",
    description: "Arroz, frijoles, aceite, pasta, sazones y galletas. Producto ficticio para demo.",
    provider: "Proveedor Bauta Alimentos",
    municipality: "Bauta",
    price: 42,
    cost: 31,
    stock: 18,
    image: "🥘",
    imageFile: "combo-familiar-bauta.jpg",
    badge: "Más vendido",
  },
  {
    id: "PRD-BAU-0002",
    slug: "kit-aseo-hogar",
    name: "Kit Aseo Hogar",
    brand: "Hogar Demo",
    weight: "Kit variado",
    category: "Aseo",
    description: "Detergente, jabón, pasta dental, papel sanitario y desinfectante demo.",
    provider: "Proveedor Bauta Aseo",
    municipality: "Bauta",
    price: 29,
    cost: 20,
    stock: 24,
    image: "🧼",
    imageFile: "kit-aseo-hogar.jpg",
    badge: "Buen margen",
  },
  {
    id: "PRD-BAU-0003",
    slug: "combo-desayuno",
    name: "Combo Desayuno",
    brand: "DREX Demo",
    weight: "Pack desayuno",
    category: "Alimentos",
    description: "Café, leche en polvo demo, galletas, mermelada y panqué ficticio.",
    provider: "Proveedor Bauta Alimentos",
    municipality: "Bauta",
    price: 35,
    cost: 26,
    stock: 13,
    image: "☕",
    imageFile: "combo-desayuno.jpg",
    badge: "Popular",
  },
  {
    id: "PRD-BAU-0004",
    slug: "combo-bebe-demo",
    name: "Combo Bebé Demo",
    brand: "Familia Demo",
    weight: "Combo bebé",
    category: "Familia",
    description: "Toallitas, jabón suave, crema, compota ficticia y pañales demo.",
    provider: "Proveedor Combos Familiares",
    municipality: "Bauta",
    price: 58,
    cost: 43,
    stock: 9,
    image: "🧸",
    imageFile: "combo-bebe-demo.jpg",
    badge: "Premium",
  },
  {
    id: "PRD-BAU-0005",
    slug: "paquete-limpieza",
    name: "Paquete Limpieza",
    brand: "Hogar Demo",
    weight: "Pack limpieza",
    category: "Hogar",
    description: "Cloro, detergente, esponjas, aromatizante y bolsas. Datos ficticios.",
    provider: "Proveedor Bauta Aseo",
    municipality: "Bauta",
    price: 24,
    cost: 17,
    stock: 31,
    image: "🧽",
    imageFile: "paquete-limpieza.jpg",
    badge: "Oferta demo",
  },
  {
    id: "PRD-BAU-0006",
    slug: "combo-almuerzo",
    name: "Combo Almuerzo",
    brand: "DREX Demo",
    weight: "Combo almuerzo",
    category: "Alimentos",
    description: "Pollo demo, arroz, puré, aceite y vegetales. Inventario ficticio.",
    provider: "Proveedor Bauta Alimentos",
    municipality: "Bauta",
    price: 64,
    cost: 49,
    stock: 7,
    image: "🍗",
    imageFile: "combo-almuerzo.jpg",
    badge: "Alta demanda",
  },
];

export const orderItems = products.slice(0, 2).map((product, index) => ({
  ...product,
  quantity: index + 1,
}));

export const demoOrders = [
  { id: "DMC-1001", customer: "Cliente exterior demo", beneficiary: "Mariela Pérez Demo", total: 100, status: "Entregado", payment: "DemoPay aprobado", courier: "Triciclo 01" },
  { id: "DMC-1002", customer: "Cliente frecuente demo", beneficiary: "Luis Rodríguez Demo", total: 71, status: "Preparando", payment: "Saldo DREX", courier: "Sin asignar" },
  { id: "DMC-1003", customer: "Cliente exterior demo", beneficiary: "Ana Torres Demo", total: 42, status: "En reparto", payment: "DemoPay aprobado", courier: "Triciclo 02" },
  { id: "DMC-1004", customer: "Cuenta demo", beneficiary: "Carlos Díaz Demo", total: 29, status: "Pago confirmado", payment: "DemoPay pendiente", courier: "Sin asignar" },
];

export const walletTransactions = [
  { id: "TX-001", owner: "Mariela Pérez Demo", type: "Recarga DemoPay", direction: "Entrada", amount: 75, balance: 75, status: "Completada" },
  { id: "TX-002", owner: "Mariela Pérez Demo", type: "Compra con débito", direction: "Salida", amount: 29, balance: 46, status: "Completada" },
  { id: "TX-003", owner: "Cliente exterior demo", type: "Transferencia interna", direction: "Salida", amount: 25, balance: 120, status: "Completada" },
  { id: "TX-004", owner: "Triciclo 01", type: "Pago reparto demo", direction: "Entrada", amount: 5, balance: 18, status: "Completada" },
];

export const demoSalesHistory = [
  { productSlug: "combo-familiar-bauta", productName: "Combo Familiar Bauta", last7Days: 18, previous7Days: 11, stock: 18, grossProfit: 198 },
  { productSlug: "kit-aseo-hogar", productName: "Kit Aseo Hogar", last7Days: 9, previous7Days: 12, stock: 24, grossProfit: 81 },
  { productSlug: "combo-desayuno", productName: "Combo Desayuno", last7Days: 14, previous7Days: 8, stock: 13, grossProfit: 126 },
  { productSlug: "combo-bebe-demo", productName: "Combo Bebé Demo", last7Days: 7, previous7Days: 3, stock: 9, grossProfit: 105 },
  { productSlug: "paquete-limpieza", productName: "Paquete Limpieza", last7Days: 6, previous7Days: 10, stock: 31, grossProfit: 42 },
  { productSlug: "combo-almuerzo", productName: "Combo Almuerzo", last7Days: 15, previous7Days: 6, stock: 7, grossProfit: 225 },
];

export const demandForecast = demoSalesHistory.map((item) => {
  const dailyAverage = Number((item.last7Days / 7).toFixed(2));
  const trend = item.last7Days - item.previous7Days;
  const projectedNext7Days = Math.max(0, Math.round(item.last7Days + trend * 0.6));
  const daysToStockout = dailyAverage > 0 ? Number((item.stock / dailyAverage).toFixed(1)) : 999;
  const risk = daysToStockout <= 4 ? "Alto" : daysToStockout <= 8 ? "Medio" : "Bajo";

  return {
    ...item,
    dailyAverage,
    trend,
    projectedNext7Days,
    daysToStockout,
    risk,
    recommendation:
      risk === "Alto"
        ? "Reponer inventario demo y avisar proveedor."
        : trend > 3
          ? "Promocionar como producto en crecimiento."
          : "Mantener monitoreo semanal.",
  };
});

export const productRecommendations = [
  {
    title: "Para familias que compran combos",
    reason: "Usuarios que agregaron Combo Familiar también seleccionaron aseo básico en 62% de las órdenes demo.",
    products: ["Combo Familiar Bauta", "Kit Aseo Hogar", "Combo Desayuno"],
  },
  {
    title: "Reposición inteligente",
    reason: "El sistema detecta alta rotación y bajo stock relativo en productos de comida.",
    products: ["Combo Almuerzo", "Combo Familiar Bauta"],
  },
  {
    title: "Compra con Saldo DREX",
    reason: "Beneficiarios con saldo disponible prefieren productos de menor ticket y alta necesidad.",
    products: ["Kit Aseo Hogar", "Paquete Limpieza"],
  },
];

export const analytics = {
  totalSales: 242,
  grossProfit: 63,
  averageTicket: 60.5,
  walletLoaded: 175,
  walletUsed: 54,
  circulatingBalance: 213,
  bestSeller: "Combo Familiar Bauta",
  mostProfitable: "Combo Almuerzo",
  topProvider: "Proveedor Bauta Alimentos",
  topMunicipality: "Bauta",
  predictedStockout: "Combo Almuerzo",
  recommendationEngine: "Reglas demo basadas en co-compra, tendencia semanal y saldo disponible",
};
