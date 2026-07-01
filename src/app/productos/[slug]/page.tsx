import Link from "next/link";
import { notFound } from "next/navigation";
import { formatMoney } from "@/lib/demo-data";
import { getProductsForMunicipality, getProductBySlug, getProductCategoryHref } from "@/lib/catalog";

export async function generateStaticParams() {
  const products = await getProductsForMunicipality("bauta");
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const categoryHref = getProductCategoryHref(product).split("#")[0];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <Link href={categoryHref} className="text-sm font-bold text-emerald-700">← Volver a la categoría</Link>
      <section className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="flex min-h-[420px] items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-50 via-sky-50 to-orange-50 text-9xl shadow-inner">
          {product.image?.startsWith?.("data:") ? <img src={product.image} alt={product.name} className="h-full w-full object-contain p-6" /> : product.image || <span className="text-base font-black text-slate-400">Sin imagen</span>}
        </div>
        <div className="demo-card p-8">
          <span className="badge-demo">{product.category}</span>
          <h1 className="mt-4 text-4xl font-black text-slate-950">{product.name}</h1>
          <div className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-600">
            <p className="text-emerald-700">Disponible</p>
            <p>Categoría: {product.category}</p>
            <p>Peso: {product.weight || "Unidad"}</p>
            <p>Stock: {product.stock}</p>
          </div>
          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-4xl font-black text-emerald-700">{formatMoney(product.price)}</p>
            <Link href="/carrito" className="btn-primary">Subir al carrito</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
