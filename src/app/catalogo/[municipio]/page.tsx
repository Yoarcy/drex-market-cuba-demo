import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogProductGrid } from "@/components/CatalogProductGrid";
import { getCatalogMunicipalities, getCategoriesForMunicipality, getMunicipalityBySlug, getProductsForMunicipality } from "@/lib/catalog";

export async function generateStaticParams() {
  const municipalities = await getCatalogMunicipalities();
  return municipalities.map((municipality) => ({ municipio: municipality.slug }));
}

export default async function MunicipalityCatalogPage({ params }: { params: Promise<{ municipio: string }> }) {
  const { municipio } = await params;
  const municipality = await getMunicipalityBySlug(municipio);
  if (!municipality) notFound();

  const categories = await getCategoriesForMunicipality(municipio);
  const routeProducts = await getProductsForMunicipality(municipio);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="badge-demo">{municipality.name} disponible</span>
          <h1 className="mt-4 text-4xl font-black text-slate-950">Catálogo local de {municipality.name}</h1>
          <p className="mt-2 max-w-2xl text-slate-600">Ruta filtrada por municipio. Desde aquí puedes entrar a una categoría para cargar solo ese grupo de productos.</p>
        </div>
        <Link href="/carrito" className="btn-primary">Ver carrito</Link>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-4">
        <Link href={`/catalogo/${municipio}`} className="category-filter-chip category-filter-chip-active">Todos ({routeProducts.length})</Link>
        {categories.map((category) => (
          <Link key={category.slug} href={`/catalogo/${municipio}/${category.slug}`} className="category-filter-chip">
            {category.name} ({category.count})
          </Link>
        ))}
      </div>

      <CatalogProductGrid products={routeProducts} />
    </main>
  );
}
