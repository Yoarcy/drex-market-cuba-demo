import { LoginForm } from "@/components/AuthForms";

export default function LoginPage() {
  return (
    <main className="profile-page-shell">
      <section className="profile-hero-card">
        <div>
          <span className="badge-demo">Perfil del cliente</span>
          <h1>Acceso y datos personales</h1>
          <p>Para comprar, usar el carrito, seleccionar destino o pagar, el usuario debe estar logueado. Esta pantalla prepara el perfil del cliente como en cualquier tienda online.</p>
        </div>
        <div className="login-required-card">
          <b>Sesión requerida</b>
          <p>Nada de compra, selección de municipio, carrito ni pago debe continuar sin iniciar sesión.</p>
        </div>
      </section>

      <section className="profile-layout">
        <aside className="profile-card-main">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">👤</div>
            <span className="profile-status">Demo sin verificar</span>
          </div>
          <h2>Cliente DREX</h2>
          <p className="profile-email">Inicia sesión o crea una cuenta</p>
          <div className="profile-data-grid">
            <div><span>Nombre</span><b>Según registro</b></div>
            <div><span>Teléfono</span><b>Según registro</b></div>
            <div><span>País</span><b>Configurable</b></div>
            <div><span>Rol</span><b>Comprador</b></div>
          </div>
          <div className="profile-note">La cuenta ya se guarda en la base de datos. Después conectamos edición real, foto de perfil, direcciones y beneficiarios.</div>
        </aside>

        <section className="login-panel-card">
          <h2>Iniciar sesión</h2>
          <p>Acceso real con usuario guardado en base de datos.</p>
          <LoginForm />
        </section>
      </section>
    </main>
  );
}
