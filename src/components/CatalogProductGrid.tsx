import { ProductCard } from "@/components/ProductCard";
import type { CatalogProduct } from "@/lib/catalog";

export function CatalogProductGrid({ products }: { products: CatalogProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="demo-card p-6 text-sm font-bold text-slate-600">
        No hay productos reales cargados para esta ruta todavía.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => <ProductCard key={product.slug} product={product} />)}
    </div>
  );
}
