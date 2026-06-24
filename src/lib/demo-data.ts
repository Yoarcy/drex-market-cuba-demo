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

export const products = [
  {
    slug: "combo-familiar-bauta",
    name: "Combo Familiar Bauta",
    category: "Combos familiares",
    description: "Arroz, frijoles, aceite, pasta, sazones y galletas. Producto ficticio para demo.",
    provider: "Proveedor Bauta Alimentos",
    price: 42,
    cost: 31,
    stock: 18,
    image: "🥘",
    badge: "Más vendido",
  },
  {
    slug: "kit-aseo-hogar",
    name: "Kit Aseo Hogar",
    category: "Aseo",
    description: "Detergente, jabón, pasta dental, papel sanitario y desinfectante demo.",
    provider: "Proveedor Bauta Aseo",
    price: 29,
    cost: 20,
    stock: 24,
    image: "🧼",
    badge: "Buen margen",
  },
  {
    slug: "combo-desayuno",
    name: "Combo Desayuno",
    category: "Alimentos",
    description: "Café, leche en polvo demo, galletas, mermelada y panqué ficticio.",
    provider: "Proveedor Bauta Alimentos",
    price: 35,
    cost: 26,
    stock: 13,
    image: "☕",
    badge: "Popular",
  },
  {
    slug: "combo-bebe-demo",
    name: "Combo Bebé Demo",
    category: "Familia",
    description: "Toallitas, jabón suave, crema, compota ficticia y pañales demo.",
    provider: "Proveedor Combos Familiares",
    price: 58,
    cost: 43,
    stock: 9,
    image: "🧸",
    badge: "Premium",
  },
  {
    slug: "paquete-limpieza",
    name: "Paquete Limpieza",
    category: "Hogar",
    description: "Cloro, detergente, esponjas, aromatizante y bolsas. Datos ficticios.",
    provider: "Proveedor Bauta Aseo",
    price: 24,
    cost: 17,
    stock: 31,
    image: "🧽",
    badge: "Oferta demo",
  },
  {
    slug: "combo-almuerzo",
    name: "Combo Almuerzo",
    category: "Alimentos",
    description: "Pollo demo, arroz, puré, aceite y vegetales. Inventario ficticio.",
    provider: "Proveedor Bauta Alimentos",
    price: 64,
    cost: 49,
    stock: 7,
    image: "🍗",
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
