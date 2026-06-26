import { products } from "@/lib/demo-data";

export type DemoProduct = (typeof products)[number];

export function toRouteSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const catalogMunicipalities = Array.from(new Set(products.map((product) => product.municipality))).map((name) => ({
  name,
  slug: toRouteSlug(name),
}));

export const catalogCategories = Array.from(new Set(products.map((product) => product.category))).map((name) => ({
  name,
  slug: toRouteSlug(name),
}));

export function getMunicipalityBySlug(slug: string) {
  return catalogMunicipalities.find((municipality) => municipality.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return catalogCategories.find((category) => category.slug === slug);
}

export function getProductsForMunicipality(municipalitySlug: string) {
  const municipality = getMunicipalityBySlug(municipalitySlug);
  if (!municipality) return [];
  return products.filter((product) => product.municipality === municipality.name);
}

export function getProductsForMunicipalityCategory(municipalitySlug: string, categorySlug: string) {
  const municipality = getMunicipalityBySlug(municipalitySlug);
  const category = getCategoryBySlug(categorySlug);
  if (!municipality || !category) return [];
  return products.filter((product) => product.municipality === municipality.name && product.category === category.name);
}

export function getCategoriesForMunicipality(municipalitySlug: string) {
  const municipalityProducts = getProductsForMunicipality(municipalitySlug);
  return Array.from(new Set(municipalityProducts.map((product) => product.category))).map((name) => ({
    name,
    slug: toRouteSlug(name),
    count: municipalityProducts.filter((product) => product.category === name).length,
  }));
}
