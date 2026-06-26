"use client";

import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/demo-data";

type CartItem = {
  id: string;
  name: string;
  provider: string;
  image: string;
  price: number;
  unitLabel: string;
  unitWeightKg: number;
  quantity: number;
};

const initialItems: CartItem[] = [
  { id: "PRD-BAU-0001", name: "Combo Familiar Bauta", provider: "Proveedor Bauta Alimentos", image: "🥘", price: 42, unitLabel: "combo familiar", unitWeightKg: 8.4, quantity: 1 },
  { id: "PRD-BAU-0002", name: "Kit Aseo Hogar", provider: "Proveedor Bauta Aseo", image: "🧼", price: 29, unitLabel: "kit variado", unitWeightKg: 4.8, quantity: 2 },
  { id: "PRD-BAU-0007", name: "Leche líquida 1 litro", provider: "Proveedor Bauta Alimentos", image: "🥛", price: 6, unitLabel: "1 litro ≈ 1.10 kg con envase", unitWeightKg: 1.1, quantity: 3 },
];

function roundKg(value: number) {
  return Math.round(value * 100) / 100;
}

function deliveryBlocks(totalWeight: number) {
  if (totalWeight <= 0) return [];
  const fullBlocks = Math.floor(totalWeight / 20);
  const remainder = roundKg(totalWeight - fullBlocks * 20);
  const blocks = Array.from({ length: fullBlocks }, (_, index) => ({ label: `Mensajería ${index + 1}`, weight: 20 }));
  if (remainder > 0) blocks.push({ label: `Mensajería ${blocks.length + 1}`, weight: remainder });
  return blocks;
}

export function CartDemo() {
  const [items, setItems] = useState(initialItems);
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalWeight = roundKg(items.reduce((sum, item) => sum + item.unitWeightKg * item.quantity, 0));
    const blocks = deliveryBlocks(totalWeight);
    return { subtotal, totalWeight, blocks };
  }, [items]);

  function updateQuantity(id: string, nextQuantity: number) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, nextQuantity) } : item));
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="cart-page-shell">
      <section className="cart-hero-card">
        <div className="cart-title-animation" aria-hidden="true"><img src="/hero-truck/carr_transparent.png" alt="" /></div>
        <h1>Lista de la compra</h1>
        <p>Revisa productos, cantidades y peso estimado antes de confirmar el pedido. El peso define cuántas mensajerías se cobran.</p>
      </section>

      <section className="cart-layout">
        <div className="cart-list-panel">
          {items.length === 0 ? (
            <div className="cart-empty">El carrito está vacío.</div>
          ) : items.map((item) => {
            const itemWeight = roundKg(item.unitWeightKg * item.quantity);
            return (
              <article className="cart-item-card" key={item.id}>
                <div className="cart-item-image">{item.image}</div>
                <div className="cart-item-info">
                  <h2>{item.name}</h2>
                  <div className="cart-weight-line">Peso unidad: <b>{item.unitWeightKg} kg</b> <span>({item.unitLabel})</span></div>
                  <div className="cart-weight-line">Peso total producto: <b>{itemWeight} kg</b></div>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-control" aria-label={`Cantidad de ${item.name}`}>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <strong>{item.quantity}</strong>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className="cart-item-price">{formatMoney(item.price * item.quantity)}</div>
                  <button type="button" className="remove-item" onClick={() => removeItem(item.id)}>Quitar</button>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="cart-summary-panel">
          <h2>Resumen</h2>
          <div className="summary-row"><span>Subtotal productos</span><b>{formatMoney(totals.subtotal)}</b></div>
          <div className="summary-row"><span>Peso total</span><b>{totals.totalWeight} kg</b></div>
          <div className="delivery-cookie-note">
            <b>Nota de mensajería</b>
            <p>Por cada bloque de hasta 20 kg se cobra una mensajería. Si el pedido pasa de 20 kg, se separa en otro bloque automáticamente.</p>
          </div>
          <div className="delivery-blocks">
            {totals.blocks.length === 0 ? <p>Sin peso para calcular.</p> : totals.blocks.map((block) => (
              <div className="delivery-block" key={block.label}><span>{block.label}</span><b>{block.weight} kg</b></div>
            ))}
          </div>
          <button type="button" className="btn-primary cart-checkout">Continuar pedido</button>
        </aside>
      </section>
    </div>
  );
}
