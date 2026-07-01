import { prisma } from "@/lib/prisma";

export type CatalogProduct = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  provider: string;
  municipality: string;
  price: number;
  stock: number;
  image: string;
  badge: string;
  weight: string;
};

export type CatalogMunicipality = { name: string; slug: string };
export type CatalogCategory = { name: string; slug: string; count?: number; image?: string };

export const catalogCategoryDefinitions: CatalogCategory[] = [
  { name: "Mercado", slug: "mercado", image: "/assets/categories/categoria-alimentos.webp" },
  { name: "Aseo y cuidado personal", slug: "aseo-y-cuidado-personal", image: "/assets/categories/categoria-aseo-y-cuidado-personal.webp" },
  { name: "Bebidas", slug: "bebidas", image: "/assets/categories/categoria-bebidas.webp" },
  { name: "Electrodomésticos", slug: "electrodomesticos", image: "/assets/categories/categoria-electrodomesticos.webp" },
  { name: "Ferretería", slug: "ferreteria", image: "/assets/categories/categoria-ferreteria.webp" },
  { name: "Condimentos y especias", slug: "condimentos-y-especias", image: "/assets/categories/categoria-condimentos-y-especias.webp" },
  { name: "Perfumería", slug: "perfumeria", image: "/assets/categories/categoria-aseo-y-cuidado-personal.webp" },
];

function resolveCategorySlug(name: string) {
  const normalized = toRouteSlug(name);
  if (["alimentos", "combos-familiares", "hogar", "familia"].includes(normalized)) return "mercado";
  if (["aseo", "aseo-e-higiene"].includes(normalized)) return "aseo-y-cuidado-personal";
  return normalized;
}

function resolveCategoryName(slug: string, fallback: string) {
  return catalogCategoryDefinitions.find((category) => category.slug === slug)?.name ?? fallback;
}

export function toRouteSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function dollars(value: number) {
  return Math.round(value) / 100;
}

function cleanImage(image: string | null) {
  return image || "";
}

function mapProduct(product: {
  slug: string;
  name: string;
  brand: string | null;
  description: string;
  category: string;
  salePrice: number;
  stock: number;
  weight: string | null;
  unit: string | null;
  image: string | null;
  provider: { name: string };
  municipality: { name: string };
}): CatalogProduct {
  return {
    slug: product.slug,
    name: product.name,
    brand: product.brand || "",
    category: resolveCategoryName(resolveCategorySlug(product.category), product.category),
    description: product.description,
    provider: product.provider.name,
    municipality: product.municipality.name,
    price: dollars(product.salePrice),
    stock: product.stock,
    image: cleanImage(product.image),
    badge: "Disponible",
    weight: product.weight ? `${product.weight} ${product.unit || ""}`.trim() : "Unidad",
  };
}

export async function getCatalogMunicipalities(): Promise<CatalogMunicipality[]> {
  const municipalities = await prisma.municipality.findMany({
    where: { products: { some: { isActive: true } } },
    orderBy: { name: "asc" },
  });
  return municipalities.map((municipality) => ({ name: municipality.name, slug: municipality.slug || toRouteSlug(municipality.name) }));
}

export async function getCatalogCategories(): Promise<CatalogCategory[]> {
  const products = await prisma.product.findMany({ where: { isActive: true }, select: { category: true } });
  const counts = new Map<string, number>();
  for (const product of products) {
    const slug = resolveCategorySlug(product.category);
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }
  return catalogCategoryDefinitions.map((category) => ({ ...category, count: counts.get(category.slug) ?? 0 }));
}

export async function getMunicipalityBySlug(slug: string): Promise<CatalogMunicipality | null> {
  const municipality = await prisma.municipality.findFirst({ where: { slug } });
  if (!municipality) return null;
  return { name: municipality.name, slug: municipality.slug };
}

export async function getCategoryBySlug(slug: string): Promise<CatalogCategory | null> {
  const categories = await getCatalogCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getProductsForMunicipality(municipalitySlug: string): Promise<CatalogProduct[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true, municipality: { slug: municipalitySlug } },
    include: { provider: true, municipality: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map(mapProduct);
}

export async function getProductsForMunicipalityCategory(municipalitySlug: string, categorySlug: string): Promise<CatalogProduct[]> {
  const products = await getProductsForMunicipality(municipalitySlug);
  return products.filter((product) => resolveCategorySlug(product.category) === categorySlug);
}

export async function getCategoriesForMunicipality(municipalitySlug: string): Promise<CatalogCategory[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true, municipality: { slug: municipalitySlug } },
    select: { category: true },
  });
  const counts = new Map<string, number>();
  for (const product of products) {
    const slug = resolveCategorySlug(product.category);
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }
  return catalogCategoryDefinitions.map((category) => ({ ...category, count: counts.get(category.slug) ?? 0 }));
}

export async function getFeaturedProducts(limit = 8): Promise<CatalogProduct[]> {
  const ordered = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });
  const ids = ordered.map((item) => item.productId);
  const soldIndex = new Map(ids.map((id, index) => [id, index]));
  const soldProducts = ids.length
    ? await prisma.product.findMany({
        where: { id: { in: ids }, isActive: true },
        include: { provider: true, municipality: true },
      })
    : [];

  const sortedSoldProducts = soldProducts.sort((a, b) => (soldIndex.get(a.id) ?? 999) - (soldIndex.get(b.id) ?? 999));
  if (sortedSoldProducts.length >= limit) return sortedSoldProducts.map(mapProduct);

  const fallback = await prisma.product.findMany({
    where: { isActive: true, id: { notIn: sortedSoldProducts.map((product) => product.id) } },
    include: { provider: true, municipality: true },
    orderBy: [{ stock: "desc" }, { createdAt: "desc" }],
    take: limit - sortedSoldProducts.length,
  });

  return [...sortedSoldProducts, ...fallback].map(mapProduct);
}

export function getProductCategoryHref(product: Pick<CatalogProduct, "category" | "municipality" | "slug">) {
  return `/catalogo/${toRouteSlug(product.municipality)}/${resolveCategorySlug(product.category)}#producto-${product.slug}`;
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: { provider: true, municipality: true },
  });
  return product ? mapProduct(product) : null;
}
