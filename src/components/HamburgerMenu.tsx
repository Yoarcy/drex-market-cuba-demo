"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useEffect, useRef, useState } from "react";

const publicNav = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Carrito", href: "/carrito" },
  { label: "Saldo DREX", href: "/saldo-drex" },
  { label: "Mis pedidos", href: "/mis-pedidos" },
  { label: "Usuario / Entrar", href: "/login" },
  { label: "Panel admin", href: "/admin/login" },
];

const adminNav = [
  { label: "Inicio", href: "/", icon: "inicio.png" },
  { label: "Dashboard", href: "/admin#Dashboard", icon: "dashboard.png" },
  { label: "Proveedores", href: "/admin#Proveedores", icon: "proveedores.png" },
  { label: "Productos", href: "/admin#Productos", icon: "productos.png" },
  { label: "Merma", href: "/admin#Merma", icon: "merma.png" },
  { label: "Promociones", href: "/admin#Promociones", icon: "promo.png" },
  { label: "Pedidos", href: "/admin#Pedidos", icon: "pedidos.png" },
  { label: "Seguimiento", href: "/admin#Seguimiento", icon: "seguimiento.png" },
  { label: "Billeteras", href: "/admin#Billeteras", icon: "billeteras.png" },
  { label: "Reportes", href: "/admin#Reportes", icon: "reportes.png" },
];

export function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const nav = isAdmin ? adminNav : publicNav;

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isAdmin && href.startsWith("/admin#")) {
      event.preventDefault();
      const hash = href.split("#")[1];
      window.location.hash = hash;
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
    setOpen(false);
  };
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <div className="hamburger-menu-shell" data-open={open ? "true" : "false"}>
      <button
        type="button"
        className="hamburger-trigger"
        aria-label={open ? "Cerrar menú hamburguesa" : "Abrir menú hamburguesa"}
        aria-expanded={open}
        ref={triggerRef}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="hamburger-lines" aria-hidden="true" />
      </button>

      <div className="hamburger-overlay" onClick={() => setOpen(false)}>
        <aside ref={panelRef} className="hamburger-panel" aria-label="Menú principal" onClick={(event) => event.stopPropagation()}>
          <div className="hamburger-title">
            <img src="/assets/brand/drex-market-mark.svg" alt="DREX" className="hamburger-logo" />
            <div>
              <strong>DREX Market</strong>
              <p>Cuba Demo</p>
            </div>
          </div>

          <nav className="hamburger-nav">
            {nav.map((item, index) => (
              <Link key={item.href} href={item.href} onClick={(event) => handleNavClick(event, item.href)}>
                {"icon" in item && item.icon ? <img src={`/assets/admin/icons/${item.icon}`} alt="" aria-hidden="true" /> : <span>{String(index + 1).padStart(2, "0")}</span>}
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
