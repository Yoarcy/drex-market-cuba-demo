import type { Metadata } from "next";
import Link from "next/link";
import { LocationModal } from "@/components/LocationModal";
import "./globals.css";

export const metadata: Metadata = {
  title: "DREX Market Cuba Demo",
  description: "Marketplace hiperlocal demostrativo para portafolio. No procesa pagos reales.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/drex-market-mark.svg",
  },
};

const nav = [
  ["Home", "/"],
  ["Catalog", "/catalogo"],
  ["Cart", "/carrito"],
  ["Saldo DREX / Wallet", "/saldo-drex"],
  ["Orders", "/mis-pedidos"],
  ["User/Login", "/login"],
  ["Admin Panel", "/admin/login"],
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen bg-[linear-gradient(180deg,#F0FDFA_0%,#F6F8FB_38%,#FFFFFF_100%)] text-slate-900">
          <header className="public-header sticky top-0 z-50 min-h-[72px] border-b border-slate-200 bg-white/58 shadow-sm shadow-slate-900/5 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/50">
            <input id="public-menu-toggle" type="checkbox" className="peer/public-menu hidden" />
            <div className="mx-auto grid h-[72px] max-w-7xl grid-cols-[56px_1fr_56px] items-center px-4 lg:px-8">
              <label htmlFor="public-menu-toggle" className="menu-trigger" aria-label="Abrir menú">
                <span className="menu-icon" aria-hidden="true" />
              </label>
              <Link href="/" className="brand-center header-logo-title" aria-label="DREX Market Cuba Demo">
                <img src="/drex-market-mark.svg" alt="Logo DREX" className="brand-header-mark" />
                <span className="brand-text-lockup"><span className="brand-line"><b>DREX</b><strong>Market</strong></span><span className="brand-subline">Cuba Demo</span></span>
              </Link>
              <nav className="header-actions" aria-label="Accesos rápidos">
                <Link href="/carrito" className="header-icon-link" aria-label="Carrito" data-tooltip="Carrito"><img src="/icons/03_cart.png" alt="Carrito" /></Link>
                <Link href="/saldo-drex" className="header-icon-link" aria-label="Billetera virtual" data-tooltip="Billetera"><img src="/icons/04_wallet.png" alt="Billetera" /></Link>
                <LocationModal />
                <Link href="/login" className="header-icon-link" aria-label="Perfil o login" data-tooltip="Perfil"><img src="/icons/18_user_login.png" alt="Perfil" /></Link>
              </nav>
            </div>
            <label htmlFor="public-menu-toggle" className="drawer-backdrop" aria-hidden="true" />
            <aside className="public-drawer">
              <div className="drawer-title"><img src="/drex-market-mark.svg" alt="DREX" className="drawer-logo-mark" /><div><strong>DREX Market</strong><p>Cuba Demo</p></div></div>
              <nav className="drawer-nav">
                {nav.map(([label, href], index) => (
                  <Link key={href} href={href}><span>{String(index + 1).padStart(2, "0")}</span>{label}</Link>
                ))}
              </nav>
            </aside>
          </header>

          <div className="bg-amber-50 px-4 py-2 text-center text-sm font-semibold text-amber-800">
            Modo demostración: no use datos reales, no hay pagos reales, productos ficticios y DemoPay simulado.
          </div>
          {children}
          <footer className="footer-dark border-t border-white/10 bg-slate-950 px-4 py-8 text-center text-sm font-semibold text-slate-300">
            <div className="footer-actions" aria-label="Contacto y ayuda">
              <a href="#" className="footer-icon-link" aria-label="WhatsApp"><img src="/icons/21_whatsapp_transparent.png" alt="WhatsApp" /></a>
              <a href="#" className="footer-icon-link" aria-label="Correo"><img src="/icons/22_correo_transparent.png" alt="Correo" /></a>
              <a href="#" className="footer-icon-link" aria-label="Preguntas frecuentes"><img src="/icons/23_preguntas_frecuentes_transparent.png" alt="Preguntas frecuentes" /></a>
            </div>
            <div>DREX Market Cuba Demo — experiencia pública separada del panel administrativo. Sin ventas reales, sin tarjetas reales, sin retiros reales.</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
