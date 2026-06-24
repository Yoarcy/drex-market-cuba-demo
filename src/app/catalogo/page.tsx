import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/demo-data";

export default function CatalogPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="badge-demo">Bauta disponible</span>
          <h1 className="mt-4 text-4xl font-black text-slate-950">Catálogo local de Bauta</h1>
          <p className="mt-2 max-w-2xl text-slate-600">Productos ficticios filtrados por municipio y proveedor. La arquitectura permite activar otros municipios después.</p>
        </div>
        <Link href="/carrito" className="btn-primary">Ver carrito demo</Link>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-4">
        {["Todos", "Alimentos", "Aseo", "Combos familiares"].map((filter) => (
          <button key={filter} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50">{filter}</button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => <ProductCard key={product.slug} product={product} />)}
      </div>
    </main>
  );
}
