"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const nav = [
  ["Home", "/"],
  ["Catalog", "/catalogo"],
  ["Cart", "/carrito"],
  ["Saldo DREX / Wallet", "/saldo-drex"],
  ["Orders", "/mis-pedidos"],
  ["User/Login", "/login"],
  ["Admin Panel", "/admin/login"],
];

export function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <div className="hamburger-menu-shell" data-open={open ? "true" : "false"}>
      <button
        type="button"
        className="hamburger-trigger"
        aria-label={open ? "Cerrar menú hamburguesa" : "Abrir menú hamburguesa"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="hamburger-lines" aria-hidden="true" />
      </button>

      <div className="hamburger-overlay" onClick={() => setOpen(false)}>
        <aside className="hamburger-panel" aria-label="Menú principal" onClick={(event) => event.stopPropagation()}>
          <div className="hamburger-title">
            <img src="/assets/brand/drex-market-mark.svg" alt="DREX" className="hamburger-logo" />
            <div>
              <strong>DREX Market</strong>
              <p>Cuba Demo</p>
            </div>
          </div>

          <nav className="hamburger-nav">
            {nav.map(([label, href], index) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {label}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
