import Link from "next/link";
import { notFound } from "next/navigation";
import { formatMoney, products } from "@/lib/demo-data";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <Link href="/catalogo" className="text-sm font-bold text-emerald-700">← Volver al catálogo</Link>
      <section className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="flex min-h-[420px] items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-50 via-sky-50 to-orange-50 text-9xl shadow-inner">
          {product.image}
        </div>
        <div className="demo-card p-8">
          <span className="badge-demo">{product.category}</span>
          <h1 className="mt-4 text-4xl font-black text-slate-950">{product.name}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{product.description}</p>
          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-bold text-slate-500">Proveedor asignado</p>
            <p className="mt-1 font-black text-slate-900">{product.provider}</p>
            <p className="mt-2 text-sm text-slate-500">Municipio: Bauta · Stock demo: {product.stock}</p>
          </div>
          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-4xl font-black text-emerald-700">{formatMoney(product.price)}</p>
            <Link href="/carrito" className="btn-primary">Agregar demo</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
