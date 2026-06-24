import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "DREX Market Cuba Demo",
  description: "Marketplace hiperlocal demostrativo para portafolio. No procesa pagos reales.",
};

const nav = [
  ["Inicio", "/"],
  ["Catálogo", "/catalogo"],
  ["Saldo DREX", "/saldo-drex"],
  ["Mis pedidos", "/mis-pedidos"],
  ["Admin", "/admin"],
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between lg:px-8">
              <Link href="/" className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 text-xl font-black text-white shadow-lg shadow-emerald-200">D</span>
                <div>
                  <p className="text-lg font-black tracking-tight">DREX Market Cuba</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Demo portfolio</p>
                </div>
              </Link>
              <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-600">
                {nav.map(([label, href]) => (
                  <Link key={href} href={href} className="rounded-full px-4 py-2 transition hover:bg-emerald-50 hover:text-emerald-700">
                    {label}
                  </Link>
                ))}
                <Link href="/login" className="rounded-full bg-slate-950 px-4 py-2 text-white transition hover:bg-emerald-700">Entrar</Link>
              </nav>
            </div>
          </header>
          <div className="bg-amber-50 px-4 py-2 text-center text-sm font-semibold text-amber-800">
            Modo demostración: no use datos reales, no hay pagos reales, productos ficticios y DemoPay simulado.
          </div>
          {children}
          <footer className="border-t border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
            DREX Market Cuba Demo — plataforma técnica de portafolio. Sin ventas reales, sin tarjetas reales, sin retiros reales.
          </footer>
        </div>
      </body>
    </html>
  );
}
