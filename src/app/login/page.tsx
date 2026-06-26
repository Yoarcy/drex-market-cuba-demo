import Link from "next/link";

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
          <h2>Cliente Demo DREX</h2>
          <p className="profile-email">cliente@demo.local</p>
          <div className="profile-data-grid">
            <div><span>Nombre</span><b>Cliente Demo</b></div>
            <div><span>Teléfono</span><b>+53 5000 0000</b></div>
            <div><span>País</span><b>Exterior / Demo</b></div>
            <div><span>Rol</span><b>Comprador</b></div>
          </div>
          <div className="profile-note">Estos datos son ficticios. Después conectamos edición real, foto de perfil, direcciones, beneficiarios y seguridad.</div>
        </aside>

        <section className="login-panel-card">
          <h2>Iniciar sesión</h2>
          <p>Acceso demo para activar carrito, destino, pedidos y billetera.</p>
          <form className="login-form-demo">
            <label>Email<input placeholder="cliente@demo.local" type="email" /></label>
            <label>Contraseña<input placeholder="••••••••" type="password" /></label>
            <input className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" placeholder="No llenar: honeypot anti-bot" />
            <div className="security-note">Protecciones planificadas: hash de contraseña, rate limit, bloqueo temporal, honeypot y verificación demo.</div>
            <Link href="/catalogo" className="btn-primary login-main-button">Entrar como cliente demo</Link>
            <Link href="/registro" className="register-link">Crear cuenta demo</Link>
          </form>
        </section>
      </section>
    </main>
  );
}
