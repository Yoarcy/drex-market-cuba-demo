import { prisma } from "@/lib/prisma";

export type CatalogProduct = {
  slug: string;
  name: string;
  category: string;
  description: string;
  provider: string;
  municipality: string;
  price: number;
  stock: number;
  image: string;
  badge: string;
};

export type CatalogMunicipality = { name: string; slug: string };
export type CatalogCategory = { name: string; slug: string; count?: number };

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
  description: string;
  category: string;
  salePrice: number;
  stock: number;
  image: string | null;
  provider: { name: string };
  municipality: { name: string };
}): CatalogProduct {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    description: product.description,
    provider: product.provider.name,
    municipality: product.municipality.name,
    price: dollars(product.salePrice),
    stock: product.stock,
    image: cleanImage(product.image),
    badge: "Disponible",
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
  return Array.from(new Set(products.map((product) => product.category))).map((name) => ({ name, slug: toRouteSlug(name) }));
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
  return products.filter((product) => toRouteSlug(product.category) === categorySlug);
}

export async function getCategoriesForMunicipality(municipalitySlug: string): Promise<CatalogCategory[]> {
  const products = await getProductsForMunicipality(municipalitySlug);
  return Array.from(new Set(products.map((product) => product.category))).map((name) => ({
    name,
    slug: toRouteSlug(name),
    count: products.filter((product) => product.category === name).length,
  }));
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: { provider: true, municipality: true },
  });
  return product ? mapProduct(product) : null;
}
