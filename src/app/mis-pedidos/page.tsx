"use client";

import { useState } from "react";
import { demoOrders, formatMoney } from "@/lib/demo-data";

type StoredOrder = {
  id: string;
  beneficiary: string;
  payment: string;
  status: string;
  total: number;
};

function loadLastOrder() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("drex-market-last-order");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredOrder;
  } catch {
    return null;
  }
}

export default function MyOrdersPage() {
  const [lastOrder] = useState<StoredOrder | null>(loadLastOrder);

  const orders = lastOrder ? [
    { ...lastOrder, courier: "Pendiente de asignar" },
    ...demoOrders,
  ] : demoOrders;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <h1 className="text-4xl font-black text-slate-950">Historial de compras</h1>
      <p className="mt-2 text-slate-600">Vista de cliente/beneficiario con estados de orden.</p>
      <div className="mt-8 grid gap-4">
        {orders.map((order) => (
          <article key={order.id} className="demo-card grid gap-4 p-5 md:grid-cols-[1fr_180px_180px] md:items-center">
            <div>
              <p className="text-sm font-black text-emerald-700">{order.id}</p>
              <h2 className="mt-1 text-xl font-black text-slate-950">{order.beneficiary}</h2>
              <p className="mt-1 text-sm text-slate-600">{order.payment} · Repartidor: {order.courier}</p>
            </div>
            <span className="rounded-full bg-sky-50 px-4 py-2 text-center text-sm font-black text-sky-700">{order.status}</span>
            <p className="text-right text-2xl font-black text-emerald-700">{formatMoney(order.total)}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
