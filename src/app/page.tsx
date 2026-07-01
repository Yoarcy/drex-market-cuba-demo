import CategoryStrip from "@/components/CategoryStrip";
import FeaturedProductStrip from "@/components/FeaturedProductStrip";
import { getCategoriesForMunicipality, getFeaturedProducts, getProductCategoryHref } from "@/lib/catalog";

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([
    getCategoriesForMunicipality("bauta"),
    getFeaturedProducts(8),
  ]);
  const homeCategories = categories.map((category) => ({
    name: category.name,
    href: `/catalogo/bauta/${category.slug}`,
    image: category.image || "/assets/categories/categoria-alimentos.webp",
  }));
  const featured = featuredProducts.map((product) => ({ ...product, href: getProductCategoryHref(product) }));

  return (
    <main>
      <section className="hero-shell relative overflow-hidden px-4 py-14 md:py-[76px] lg:px-8"><div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl"/><div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl"/><div className="relative mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div className="hero-copy-card">
          <div className="yoa-cart-lane" aria-hidden="true">
            <div className="yoa-cart-run">
              <img className="yoa-cart-img" src="/assets/hero/truck/carr_transparent.png" alt="" />
            </div>
          </div>
          <h1 className="mt-5 max-w-3xl text-[34px] font-extrabold leading-[1.08] tracking-[-0.04em] text-slate-950 md:text-[52px] md:leading-[1.02]">
            Compra para familiares en Cuba con proveedores y reparto por municipio.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Explora productos disponibles en Bauta, arma tu carrito y consulta el estado de tu pedido desde una experiencia rápida, clara y organizada.
          </p>
        </div>
        <div className="demo-card hero-carousel-card overflow-hidden p-0">
          <div className="hero-carousel" aria-label="Tira automática de imágenes DREX Market">
            <div className="hero-carousel-track">
              <img src="/assets/hero/hero-01.png" alt="DREX Market producto 1" />
              <img src="/assets/hero/hero-02.png" alt="DREX Market producto 2" />
              <img src="/assets/hero/hero-03.png" alt="DREX Market producto 3" />
              <img src="/assets/hero/hero-04.png" alt="DREX Market producto 4" />
            </div>
            <div className="hero-carousel-dots"><span /><span /><span /><span /></div>
          </div>
        </div>
      </div></section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8" aria-label="Categorías principales">
        <CategoryStrip categories={homeCategories} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8" aria-label="Productos destacados">
        <div className="mb-5">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-600">Productos destacados</p>
          <h2 className="mt-3 text-2xl font-black text-slate-950">Productos destacados en Bauta</h2>
          <p className="mt-2 max-w-2xl text-slate-600">Una selección rápida para descubrir productos populares y armar tu compra con menos pasos.</p>
        </div>
        <FeaturedProductStrip products={featured} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8" aria-label="Compra en 3 pasos">
        <div className="mb-5">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-600">Proceso de compra</p>
          <h2 className="mt-3 text-2xl font-black text-slate-950">Compra en 3 pasos</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["1", "Elige el municipio", "Selecciona tu provincia y municipio disponible."],
            ["2", "Agrega productos", "Explora categorías, revisa productos destacados y arma tu carrito."],
            ["3", "Compra y sigue tu pedido", "Completa los datos del beneficiario, elige método de pago y consulta el estado."],
          ].map(([number, title, text]) => (
            <article key={number} className="demo-card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-black text-emerald-700">{number}</div>
              <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
