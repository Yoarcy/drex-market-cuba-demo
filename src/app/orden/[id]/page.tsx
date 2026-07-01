import Link from "next/link";
import { formatMoney, orderItems } from "@/lib/demo-data";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + 5;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <section className="demo-card p-8">
        <span className="badge-demo">Orden creada</span>
        <h1 className="mt-4 text-4xl font-black text-slate-950">Comprobante {id}</h1>
        <p className="mt-2 text-slate-600">Pago aprobado. Orden registrada para Bauta.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["Pago confirmado", "Preparando", "Repartidor pendiente"].map((status) => (
            <div key={status} className="rounded-2xl bg-emerald-50 p-4 text-center font-black text-emerald-800">{status}</div>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-slate-200 p-5">
          <h2 className="text-xl font-black">Beneficiario</h2>
          <p className="mt-2 text-slate-600">Mariela Pérez · Bauta, Artemisa · Dirección de entrega registrada</p>
        </div>
        <div className="mt-6 space-y-3">
          {orderItems.map((item) => (
            <div key={item.slug} className="flex justify-between rounded-2xl bg-slate-50 p-4 font-bold">
              <span>{item.quantity} × {item.name}</span><span>{formatMoney(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between rounded-2xl bg-slate-950 p-4 text-xl font-black text-white"><span>Total</span><span>{formatMoney(total)}</span></div>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/mis-pedidos" className="btn-primary">Ver estado</Link>
          <Link href="/admin" className="btn-dark">Gestionar en admin</Link>
        </div>
      </section>
    </main>
  );
}
