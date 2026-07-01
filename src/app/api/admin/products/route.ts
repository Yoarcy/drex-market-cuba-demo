import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";

function slugify(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ñ/g, "n").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function cents(value: number | string) { return Math.round(Number(value || 0) * 100); }
function dollars(value: number) { return Math.round(value) / 100; }

function splitWeight(value: unknown) {
  const text = String(value || "").trim();
  const [weight = "", unit = "lb"] = text.split(/\s+/, 2);
  return { weight, unit: unit || "lb", label: text || "Unidad" };
}

function mapProduct(product: { id: string; slug: string; name: string; brand: string | null; description: string; category: string; providerCost: number; salePrice: number; stock: number; weight: string | null; unit: string | null; image: string | null; isActive: boolean; createdAt: Date; provider: { name: string }; municipality: { name: string } }) {
  const weightLabel = product.weight ? `${product.weight} ${product.unit || ""}`.trim() : "Unidad";
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand || "",
    weight: weightLabel,
    unit: product.unit || "lb",
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
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const products = await prisma.product.findMany({ where: { isActive: true }, include: { provider: true, municipality: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(products.map(mapProduct));
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
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
  const parsedWeight = splitWeight(body.weight);
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
      brand: body.brand || null,
      slug,
      description: body.description || "Producto disponible en DREX Market Cuba.",
      category: body.category || "Mercado",
      providerCost,
      salePrice,
      grossMargin: salePrice - providerCost,
      stock: Number(body.stock || 0),
      weight: parsedWeight.weight || null,
      unit: parsedWeight.weight ? parsedWeight.unit : null,
      image: body.image || "",
      isActive: true,
    },
    include: { provider: true, municipality: true },
  });
  return NextResponse.json(mapProduct(product), { status: 201 });
}
