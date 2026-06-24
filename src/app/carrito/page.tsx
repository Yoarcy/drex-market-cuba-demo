import Link from "next/link";
import { formatMoney, orderItems } from "@/lib/demo-data";

export default function CartPage() {
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 5;
  const total = subtotal + delivery;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <h1 className="text-4xl font-black text-slate-950">Carrito demo</h1>
      <p className="mt-2 text-slate-600">Productos ficticios seleccionados para beneficiario en Bauta.</p>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="demo-card p-5 md:col-span-2">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-600">Destino de la compra</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Bauta, Artemisa</h2>
          <p className="mt-2 text-sm text-slate-600">La compra va dirigida a un beneficiario en Cuba. La dirección exacta se confirma en checkout.</p>
        </div>
        <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-black text-emerald-700">Zona disponible</p>
          <p className="mt-2 text-sm font-semibold text-emerald-800">Bauta está activo en esta demo. Otros municipios de Artemisa aparecen como próximamente.</p>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          {orderItems.map((item) => (
            <article key={item.slug} className="demo-card flex gap-4 p-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-5xl">{item.image}</div>
              <div className="flex-1">
                <h2 className="text-xl font-black text-slate-950">{item.name}</h2>
                <p className="mt-1 text-sm text-slate-600">{item.provider}</p>
                <p className="mt-2 text-sm font-bold text-slate-500">Cantidad demo: {item.quantity}</p>
              </div>
              <p className="font-black text-emerald-700">{formatMoney(item.price * item.quantity)}</p>
            </article>
          ))}
        </section>
        <aside className="demo-card h-fit p-6">
          <h2 className="text-2xl font-black">Resumen</h2>
          <div className="mt-5 space-y-3 text-sm font-semibold text-slate-600">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
            <div className="flex justify-between"><span>Delivery Bauta</span><span>{formatMoney(delivery)}</span></div>
            <div className="border-t border-slate-200 pt-3 text-lg font-black text-slate-950"><div className="flex justify-between"><span>Total demo</span><span>{formatMoney(total)}</span></div></div>
          </div>
          <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-xs font-bold text-amber-800">
            Para comprar, el usuario debe estar registrado y logueado. Este MVP lo muestra visualmente y luego se conectará a sesión real.
          </div>
          <Link href="/checkout" className="btn-primary mt-6 w-full">Continuar checkout</Link>
          <Link href="/catalogo" className="mt-3 flex justify-center rounded-full border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">Seguir comprando</Link>
        </aside>
      </div>
    </main>
  );
}
