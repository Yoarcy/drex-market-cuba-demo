"use client";

import Link from "next/link";
import { PointerEvent, useRef, useState } from "react";

type CategoryStripItem = {
  name: string;
  href: string;
  image: string;
};

export default function CategoryStrip({ categories }: { categories: CategoryStripItem[] }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const [isDragging, setIsDragging] = useState(false);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const strip = stripRef.current;
    if (!strip) return;
    dragState.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: strip.scrollLeft,
      moved: false,
    };
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

  return (
    <div
      ref={stripRef}
      className={`category-strip ${isDragging ? "is-dragging" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={onClickCapture}
    >
      {categories.map((category) => (
        <Link key={category.name} href={category.href} className="category-image-button" draggable={false} aria-label={`Ver categoría ${category.name}`}>
          <img src={category.image} alt={category.name} loading="lazy" draggable={false} />
          <span>{category.name}</span>
        </Link>
      ))}
    </div>
  );
}
