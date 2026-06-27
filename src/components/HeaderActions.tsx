"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LocationModal } from "@/components/LocationModal";
import { ProfileMenu } from "@/components/ProfileMenu";

export function HeaderActions() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <nav className="header-actions" aria-label="Accesos rápidos">
      {!isAdmin && (
        <>
          <Link href="/carrito" className="header-icon-link" aria-label="Carrito" data-tooltip="Carrito">
            <img src="/assets/icons/03_cart.png" alt="Carrito" />
          </Link>
          <Link href="/saldo-drex" className="header-icon-link" aria-label="Billetera virtual" data-tooltip="Billetera">
            <img src="/assets/icons/04_wallet.png" alt="Billetera" />
          </Link>
          <LocationModal />
        </>
      )}
      <ProfileMenu />
    </nav>
  );
}
