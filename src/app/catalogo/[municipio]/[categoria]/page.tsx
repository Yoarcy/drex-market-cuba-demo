import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogProductGrid } from "@/components/CatalogProductGrid";
import { getCatalogCategories, getCatalogMunicipalities, getCategoriesForMunicipality, getCategoryBySlug, getMunicipalityBySlug, getProductsForMunicipalityCategory } from "@/lib/catalog";

export async function generateStaticParams() {
  const [municipalities, categories] = await Promise.all([getCatalogMunicipalities(), getCatalogCategories()]);
  return municipalities.flatMap((municipality) =>
    categories.map((category) => ({ municipio: municipality.slug, categoria: category.slug })),
  );
}

export default async function CategoryCatalogPage({ params }: { params: Promise<{ municipio: string; categoria: string }> }) {
  const { municipio, categoria } = await params;
  const municipality = await getMunicipalityBySlug(municipio);
  const category = await getCategoryBySlug(categoria);
  if (!municipality || !category) notFound();

  const categories = await getCategoriesForMunicipality(municipio);
  const routeProducts = await getProductsForMunicipalityCategory(municipio, categoria);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="badge-demo">{municipality.name} · {category.name}</span>
          <h1 className="mt-4 text-4xl font-black text-slate-950">{category.name}</h1>
          <p className="mt-2 max-w-2xl text-slate-600">Esta ruta carga únicamente productos reales de {category.name} para {municipality.name}.</p>
        </div>
        <Link href="/carrito" className="btn-primary">Ver carrito</Link>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-4">
        <Link href={`/catalogo/${municipio}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50">Todos</Link>
        {categories.map((item) => (
          <Link key={item.slug} href={`/catalogo/${municipio}/${item.slug}`} className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${item.slug === categoria ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"}`}>
            {item.name} ({item.count})
          </Link>
        ))}
      </div>

      <CatalogProductGrid products={routeProducts} />
    </main>
  );
}
