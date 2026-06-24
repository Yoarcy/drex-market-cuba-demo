import Link from "next/link";
import { formatMoney, walletTransactions } from "@/lib/demo-data";

export default function WalletPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <span className="badge-demo">Solo débito · Sin crédito</span>
      <h1 className="mt-4 text-4xl font-black text-slate-950">Saldo DREX</h1>
      <p className="mt-2 max-w-3xl text-slate-600">Billetera interna demostrativa tipo débito. Solo permite usar saldo previamente cargado dentro de esta plataforma demo. No representa dinero real y no permite retiros.</p>

      <section className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="demo-card p-6">
          <p className="text-sm font-bold text-slate-500">Saldo disponible beneficiario</p>
          <p className="mt-2 text-5xl font-black text-emerald-700">{formatMoney(46)}</p>
          <div className="mt-6 grid gap-3">
            <Link href="/demopay" className="btn-primary">Cargar saldo demo</Link>
            <button className="rounded-full bg-slate-950 px-5 py-4 font-black text-white">Transferir interno demo</button>
            <Link href="/catalogo" className="rounded-full border border-slate-200 px-5 py-4 text-center font-black text-slate-700">Comprar con saldo</Link>
          </div>
          <p className="mt-5 text-xs font-semibold text-slate-500">Regla contable: no se edita balance directo; todo movimiento crea transacción auditable.</p>
        </aside>

        <section className="demo-card p-6">
          <h2 className="text-2xl font-black">Historial de movimientos</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-slate-500"><tr><th className="py-3">ID</th><th>Dueño</th><th>Tipo</th><th>Dirección</th><th>Monto</th><th>Saldo</th><th>Estado</th></tr></thead>
              <tbody>
                {walletTransactions.map((tx) => (
                  <tr key={tx.id} className="border-t border-slate-100">
                    <td className="py-4 font-bold">{tx.id}</td><td>{tx.owner}</td><td>{tx.type}</td><td>{tx.direction}</td><td className="font-black">{formatMoney(tx.amount)}</td><td>{formatMoney(tx.balance)}</td><td><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{tx.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
