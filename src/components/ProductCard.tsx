"use client";

import Link from "next/link";
import { useState } from "react";
import { formatMoney } from "@/lib/demo-data";

type Product = {
  slug: string;
  name: string;
  brand?: string;
  category: string;
  description: string;
  provider: string;
  price: number;
  stock: number;
  image: string;
  badge: string;
  weight?: string;
};

export function ProductCard({ product }: { product: Product }) {
  const isOut = product.stock <= 0;
  const [showDetails, setShowDetails] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const cartHref = `/carrito?producto=${encodeURIComponent(product.slug)}&cantidad=${quantity}`;

  function changeQuantity(next: number) {
    setQuantity(Math.max(1, Math.min(product.stock || 1, next)));
  }

  return (
    <>
      <article
        id={`producto-${product.slug}`}
        role="button"
        tabIndex={0}
        onClick={() => setShowDetails(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") setShowDetails(true);
        }}
        className={`group scroll-mt-28 flex h-full cursor-pointer flex-col overflow-hidden rounded-[20px] border shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition duration-200 ${isOut ? "border-red-300 bg-red-50" : "border-slate-200 bg-white hover:-translate-y-1 hover:shadow-xl"}`}
      >
        <div className={`flex aspect-[4/3] items-center justify-center text-6xl ${isOut ? "bg-red-100 opacity-70" : "bg-gradient-to-br from-emerald-50 via-sky-50 to-orange-50"}`}>
          {product.image?.startsWith?.("data:") ? <img src={product.image} alt={product.name} className="h-full w-full object-contain p-4" /> : product.image || <span className="text-sm font-black text-slate-400">Sin imagen</span>}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">{product.category}</span>
            {isOut ? <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">agotado</span> : <span className="text-xs font-semibold text-orange-600">{product.badge}</span>}
          </div>
          <h3 className="text-[17px] font-extrabold text-slate-950">{product.name}</h3>
          {product.brand ? <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-slate-400">{product.brand}</p> : null}
          <p className="mt-2 text-sm font-black text-emerald-700">Disponible</p>
          <p className="mt-1 text-xs font-bold text-slate-500">Peso: {product.weight || "Unidad"}</p>
          <div className="mt-auto pt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className={isOut ? "text-[22px] font-extrabold tracking-[-0.02em] text-red-700" : "text-[22px] font-extrabold tracking-[-0.02em] text-emerald-700"}>{formatMoney(product.price)}</p>
                <p className={isOut ? "text-xs font-black text-red-700" : "text-xs text-slate-500"}>Stock: {product.stock}</p>
              </div>
              {!isOut && (
                <div className="flex items-center rounded-full border border-orange-200 bg-orange-50 p-1 shadow-sm" onClick={(event) => event.stopPropagation()}>
                  <button type="button" onClick={() => changeQuantity(quantity - 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-black text-orange-700 shadow-sm">−</button>
                  <span className="w-9 text-center text-sm font-black text-slate-900">{quantity}</span>
                  <button type="button" onClick={() => changeQuantity(quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-black text-orange-700 shadow-sm">+</button>
                </div>
              )}
            </div>
            {isOut ? (
              <button disabled className="w-full rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">No disponible</button>
            ) : (
              <Link onClick={(event) => event.stopPropagation()} href={cartHref} className="block w-full rounded-2xl bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 px-4 py-3 text-center text-sm font-black text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:shadow-xl">Subir al carrito</Link>
            )}
          </div>
        </div>
      </article>

      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:items-center" onClick={() => setShowDetails(false)}>
          <div className="w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex min-h-48 items-center justify-center bg-gradient-to-br from-emerald-50 via-sky-50 to-orange-50 p-5 text-7xl">
              {product.image?.startsWith?.("data:") ? <img src={product.image} alt={product.name} className="max-h-56 w-full object-contain" /> : product.image || <span className="text-sm font-black text-slate-400">Sin imagen</span>}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="badge-demo">{product.category}</span>
                  <h2 className="mt-3 text-2xl font-black text-slate-950">{product.name}</h2>
                  {product.brand ? <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-slate-400">Marca: {product.brand}</p> : null}
                </div>
                <button type="button" onClick={() => setShowDetails(false)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-black text-slate-600">×</button>
              </div>
              <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">{product.description || "Producto disponible en DREX Market Cuba."}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-black text-slate-600">
                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">{formatMoney(product.price)}</div>
                <div className="rounded-2xl bg-orange-50 p-3 text-orange-700">Peso: {product.weight || "Unidad"}</div>
                <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">Stock: {product.stock}</div>
              </div>
              {!isOut && (
                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="flex items-center rounded-full border border-orange-200 bg-orange-50 p-1 shadow-sm">
                    <button type="button" onClick={() => changeQuantity(quantity - 1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-black text-orange-700 shadow-sm">−</button>
                    <span className="w-12 text-center text-base font-black text-slate-900">{quantity}</span>
                    <button type="button" onClick={() => changeQuantity(quantity + 1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-black text-orange-700 shadow-sm">+</button>
                  </div>
                  <Link href={cartHref} className="flex-1 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 px-5 py-3 text-center text-sm font-black text-white shadow-lg shadow-orange-500/25">Subir al carrito</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
