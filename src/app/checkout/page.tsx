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
      <span className="badge-demo">Checkout protegido demo</span>
      <h1 className="mt-4 text-4xl font-black text-slate-950">Datos de compra y entrega</h1>
      <p className="mt-2 text-slate-600">Formulario visual de portafolio. No introduzca datos reales.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="demo-card p-6">
          <h2 className="text-2xl font-black">Comprador ficticio</h2>
          <div className="mt-5 grid gap-4">
            <Field label="Nombre" placeholder="Cliente exterior demo" />
            <Field label="Email" placeholder="cliente@demo.local" />
            <Field label="Teléfono" placeholder="+00 000 000 000" />
          </div>
          <div className="mt-5 rounded-2xl bg-sky-50 p-4 text-sm font-semibold text-sky-800">
            Seguridad demo: sesión requerida, validación, rate limit, honeypot anti-bot y bloqueo por intentos fallidos.
          </div>
        </section>

        <section className="demo-card p-6">
          <h2 className="text-2xl font-black">Beneficiario en Cuba</h2>
          <div className="mt-5 grid gap-4">
            <Field label="Nombre" placeholder="Mariela Pérez Demo" />
            <Field label="Teléfono" placeholder="+53 5000 0000" />
            <Field label="Dirección" placeholder="Calle demo, Bauta" />
            <Field label="Referencia" placeholder="Casa azul, frente al parque demo" />
            <label className="space-y-2"><span>Notas</span><textarea placeholder="Llamar antes de entregar. Datos ficticios." rows={4} /></label>
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
