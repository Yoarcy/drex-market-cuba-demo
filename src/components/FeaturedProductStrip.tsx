"use client";

import Link from "next/link";
import { PointerEvent, useRef, useState } from "react";
import { formatMoney } from "@/lib/demo-data";
import type { CatalogProduct } from "@/lib/catalog";

type FeaturedItem = CatalogProduct & { href: string };

export default function FeaturedProductStrip({ products }: { products: FeaturedItem[] }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const [isDragging, setIsDragging] = useState(false);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const strip = stripRef.current;
    if (!strip) return;
    dragState.current = { active: true, startX: event.clientX, scrollLeft: strip.scrollLeft, moved: false };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const strip = stripRef.current;
    const drag = dragState.current;
    if (!strip || !drag.active) return;
    const walk = event.clientX - drag.startX;
    if (Math.abs(walk) <= 8) return;
    drag.moved = true;
    setIsDragging(true);
    strip.scrollLeft = drag.scrollLeft - walk;
  }

  function endDrag() {
    dragState.current.active = false;
    window.setTimeout(() => setIsDragging(false), 0);
  }

  function onClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!dragState.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    window.setTimeout(() => {
      dragState.current.moved = false;
    }, 0);
  }

  if (products.length === 0) return null;

  return (
    <div
      ref={stripRef}
      className={`featured-product-strip ${isDragging ? "is-dragging" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={onClickCapture}
    >
      {products.map((product) => (
        <Link key={product.slug} href={product.href} className="featured-product-card" draggable={false}>
          <div className="featured-product-image">
            {product.image?.startsWith?.("data:") ? <img src={product.image} alt={product.name} draggable={false} /> : <span>{product.image || "🛒"}</span>}
          </div>
          <div className="featured-product-info">
            <p>{product.category}</p>
            <h3>{product.name}</h3>
            <strong>{formatMoney(product.price)}</strong>
          </div>
        </Link>
      ))}
    </div>
  );
}
