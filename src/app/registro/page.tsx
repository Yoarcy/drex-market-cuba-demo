import { RegisterForm } from "@/components/AuthForms";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
      <section className="demo-card p-8">
        <span className="badge-demo">Registro comprador</span>
        <h1 className="mt-4 text-4xl font-black text-slate-950">Crear cuenta</h1>
        <p className="mt-2 text-slate-600">El comprador ya queda registrado en la base de datos y puede iniciar sesión antes del flujo completo.</p>
        <RegisterForm />
      </section>
    </main>
  );
}
