import Link from "next/link";
import { formatMoney } from "@/lib/demo-data";

type Product = {
  slug: string;
  name: string;
  category: string;
  description: string;
  provider: string;
  price: number;
  stock: number;
  image: string;
  badge: string;
};

export function ProductCard({ product }: { product: Product }) {
  const isOut = product.stock <= 0;

  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-[20px] border shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition duration-200 ${isOut ? "border-red-300 bg-red-50" : "border-slate-200 bg-white hover:-translate-y-1 hover:shadow-xl"}`}>
      <div className={`flex aspect-[4/3] items-center justify-center text-6xl ${isOut ? "bg-red-100 opacity-70" : "bg-gradient-to-br from-emerald-50 via-sky-50 to-orange-50"}`}>
        {product.image?.startsWith?.("data:") ? <img src={product.image} alt={product.name} className="h-full w-full object-contain p-4" /> : product.image || <span className="text-sm font-black text-slate-400">Sin imagen</span>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">{product.category}</span>
          {isOut ? <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">agotado</span> : <span className="text-xs font-semibold text-orange-600">{product.badge}</span>}
        </div>
        <h3 className="text-[17px] font-extrabold text-slate-950">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{product.description}</p>
        <p className="mt-3 text-xs font-semibold text-slate-500">{product.provider}</p>
        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <p className={isOut ? "text-[22px] font-extrabold tracking-[-0.02em] text-red-700" : "text-[22px] font-extrabold tracking-[-0.02em] text-emerald-700"}>{formatMoney(product.price)}</p>
            <p className={isOut ? "text-xs font-black text-red-700" : "text-xs text-slate-500"}>Stock: {product.stock}</p>
          </div>
          {isOut ? (
            <button disabled className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">No disponible</button>
          ) : (
            <Link href={`/productos/${product.slug}`} className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600">Ver</Link>
          )}
        </div>
      </div>
    </article>
  );
}
