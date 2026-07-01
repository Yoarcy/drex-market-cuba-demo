import Link from "next/link";

const Field = ({ label, placeholder }: { label: string; placeholder: string }) => (
  <label className="space-y-2">
    <span>{label}</span>
    <input placeholder={placeholder} />
  </label>
);

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <span className="badge-demo">Checkout protegido</span>
      <h1 className="mt-4 text-4xl font-black text-slate-950">Datos de compra y entrega</h1>
      <p className="mt-2 text-slate-600">Completa los datos del comprador, beneficiario y entrega para preparar el pedido.</p>
      <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm font-bold text-sky-800">
        Requisito de flujo: el comprador debe tener cuenta creada y sesión iniciada antes de confirmar la compra.
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="demo-card p-6">
          <h2 className="text-2xl font-black">Comprador</h2>
          <div className="mt-5 grid gap-4">
            <Field label="Nombre" placeholder="Nombre del comprador" />
            <Field label="Email" placeholder="correo@ejemplo.com" />
            <Field label="Teléfono" placeholder="+00 000 000 000" />
          </div>
          <div className="mt-5 rounded-2xl bg-sky-50 p-4 text-sm font-semibold text-sky-800">
            Seguridad activa: sesión requerida, validación, rate limit, honeypot anti-bot y bloqueo por intentos fallidos.
          </div>
        </section>

        <section className="demo-card p-6">
          <h2 className="text-2xl font-black">Beneficiario en Cuba</h2>
          <div className="mt-5 grid gap-4">
            <Field label="Nombre" placeholder="Nombre de quien recibe" />
            <Field label="Teléfono" placeholder="+53 5000 0000" />
            <Field label="Dirección" placeholder="Calle, número y reparto" />
            <Field label="Referencia" placeholder="Casa, color, punto cercano" />
            <label className="space-y-2"><span>Notas</span><textarea placeholder="Llamar antes de entregar." rows={4} /></label>
          </div>
        </section>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/demopay" className="btn-primary">Pagar con DemoPay</Link>
        <Link href="/saldo-drex" className="btn-dark">Usar Saldo DREX</Link>
      </div>
    </main>
  );
}
