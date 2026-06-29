import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ñ/g, "n").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function cents(value: number | string) { return Math.round(Number(value || 0) * 100); }
function dollars(value: number) { return Math.round(value) / 100; }

function mapProduct(product: { id: string; slug: string; name: string; description: string; category: string; providerCost: number; salePrice: number; stock: number; image: string | null; isActive: boolean; createdAt: Date; provider: { name: string }; municipality: { name: string } }) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: "",
    weight: "Unidad",
    category: product.category,
    description: product.description,
    provider: product.provider.name,
    municipality: product.municipality.name,
    price: dollars(product.salePrice),
    cost: dollars(product.providerCost),
    stock: product.stock,
    image: product.image || "",
    imageFile: product.image ? "Base de datos" : "Sin imagen",
    badge: product.isActive ? "Activo" : "Inactivo",
    createdAt: product.createdAt.toLocaleString("es-CU"),
    priceHistory: [],
  };
}

export async function GET() {
  const products = await prisma.product.findMany({ where: { isActive: true }, include: { provider: true, municipality: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(products.map(mapProduct));
}

export async function POST(request: Request) {
  const body = await request.json();
  const municipality = await prisma.municipality.findFirstOrThrow({ where: { name: body.municipality || "Bauta" } });
  let provider = body.providerId
    ? await prisma.provider.findUnique({ where: { id: body.providerId }, include: { municipality: true } })
    : null;
  if (!provider && body.providerName) {
    provider = await prisma.provider.findFirst({ where: { name: body.providerName, municipalityId: municipality.id }, include: { municipality: true } });
  }
  if (!provider) {
    provider = await prisma.provider.create({
      data: {
        municipalityId: municipality.id,
        name: body.providerName || "Proveedor demo",
        contactName: "Creado automáticamente desde producto",
        phone: body.providerPhone || "",
        isActive: true,
      },
      include: { municipality: true },
    });
  }
  const salePrice = cents(body.price);
  const providerCost = cents(body.cost);
  const baseSlug = slugify(body.slug || body.name || "producto");
  let slug = baseSlug;
  let suffix = 2;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  const product = await prisma.product.create({
    data: {
      municipalityId: provider.municipalityId,
      providerId: provider.id,
      name: body.name,
      slug,
      description: body.description || "Producto agregado desde admin.",
      category: body.category || "Mercado",
      providerCost,
      salePrice,
      grossMargin: salePrice - providerCost,
      stock: Number(body.stock || 0),
      image: body.image || "",
      isActive: true,
    },
    include: { provider: true, municipality: true },
  });
  return NextResponse.json(mapProduct(product), { status: 201 });
}
