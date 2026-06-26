"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

function createDemoOrderId() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const dateKey = `${yy}${mm}${dd}`;
  const storageKey = `drex-order-seq-${dateKey}`;
  const nextNumber = Number(localStorage.getItem(storageKey) || "0") + 1;
  localStorage.setItem(storageKey, String(nextNumber));
  return `DO${dateKey}${String(nextNumber).padStart(5, "0")}`;
}

export function CartDemo() {
  const router = useRouter();
  const [buyerName] = useState(() => {
    if (typeof window === "undefined") return "Cliente DREX";
    try {
      const profile = JSON.parse(localStorage.getItem("drex-market-profile") || "{}");
      return `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "Cliente DREX";
    } catch { return "Cliente DREX"; }
  });
  const [items, setItems] = useState(initialItems);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card">("wallet");
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
        <div className="cart-title-animation" aria-hidden="true"><img src="/assets/hero/truck/carr_transparent.png" alt="" /></div>
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
          <div className="cart-summary-actions">
            <Link href="/" className="cart-keep-shopping">Seguir comprando</Link>
            <button type="button" className="btn-primary cart-checkout" onClick={() => setCheckoutOpen(true)} disabled={items.length === 0}>Hacer compra</button>
          </div>
        </aside>
      </section>

          {checkoutOpen && (
        <section className="checkout-demo-panel" aria-label="Proceso de compra simulado">
          <div className="checkout-demo-head">
            <div>
              <span className="badge">Compra demo</span>
              <h2>Datos para completar el pedido</h2>
              <p>Simulación completa: comprador, beneficiario, entrega y método de pago. No uses datos bancarios reales.</p>
            </div>
            <button type="button" className="checkout-close" onClick={() => setCheckoutOpen(false)} aria-label="Cerrar compra">×</button>
          </div>

            <form className="checkout-demo-form" onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const orderId = createDemoOrderId();
              const order = {
                id: orderId,
                customer: buyerName,
                beneficiary: String(form.get("beneficiary") || "Beneficiario DREX"),
                phone: String(form.get("beneficiaryPhone") || ""),
                province: String(form.get("province") || "Artemisa"),
                municipality: String(form.get("municipality") || "Bauta"),
                address: String(form.get("address") || ""),
                payment: paymentMethod === "wallet" ? "Billetera virtual" : "Tarjeta bancaria",
                total: totals.subtotal,
                status: "Pagado · En preparación",
              };
              localStorage.setItem("drex-market-last-order", JSON.stringify(order));
              localStorage.setItem("drex-market-cart-paid", "true");
              setItems([]);
              router.push("/mis-pedidos");
            }}>
              <div className="registered-buyer-card">
                <span>Comprador registrado</span>
                <b>{buyerName}</b>
                <small>Estos datos salen del perfil iniciado. Aquí solo se completa el beneficiario.</small>
              </div>
              <div className="checkout-grid">
                <label>Beneficiario en Cuba<input name="beneficiary" placeholder="Nombre de quien recibe" required /></label>
                <label>Teléfono del beneficiario<input name="beneficiaryPhone" placeholder="+53 5XXX XXXX" required /></label>
                <label>Provincia<input name="province" defaultValue="Artemisa" required /></label>
                <label>Municipio<input name="municipality" defaultValue="Bauta" required /></label>
              </div>
              <label>Dirección de entrega<textarea name="address" placeholder="Calle, número, reparto, referencia cercana" required /></label>

              <div className="payment-method-box">
                <h3>Método de pago</h3>
                <div className="payment-buttons-row">
                  <button type="button" className={`payment-option ${paymentMethod === "wallet" ? "active" : ""}`} onClick={() => setPaymentMethod("wallet")}>Billetera virtual</button>
                  <button type="button" className={`payment-option ${paymentMethod === "card" ? "active" : ""}`} onClick={() => setPaymentMethod("card")}>Tarjeta bancaria</button>
                </div>
                {paymentMethod === "wallet" ? (
                  <p>Se descontará de tu saldo DemoPay/DREX Wallet. Si no tienes saldo suficiente, queda como pago pendiente demo.</p>
                ) : (
                  <p>Pago simulado con tarjeta bancaria. No se piden números reales; solo se muestra el flujo comercial.</p>
                )}
              </div>

              <button type="submit" className="btn-primary checkout-finish-button">Confirmar compra demo</button>
            </form>
        </section>
      )}
    </div>
  );
}
