import Link from "next/link";
import { getCatalogMunicipalities } from "@/lib/catalog";

export default async function CatalogPage() {
  const catalogMunicipalities = await getCatalogMunicipalities();
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="badge-demo">Catálogo por rutas</span>
          <h1 className="mt-4 text-4xl font-black text-slate-950">Selecciona municipio</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Esta entrada carga datos reales desde la base de datos. Cada municipio y categoría filtra únicamente productos activos.
          </p>
        </div>
        <Link href="/carrito" className="btn-primary">Ver carrito</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {catalogMunicipalities.map((municipality) => (
          <Link key={municipality.slug} href={`/catalogo/${municipality.slug}`} className="demo-card p-5 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-600">Municipio</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">{municipality.name}</h2>
            <p className="mt-2 text-sm font-semibold text-slate-600">Ver productos reales disponibles por categoría.</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
