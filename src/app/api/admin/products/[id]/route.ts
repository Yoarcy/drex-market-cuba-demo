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
  return { weight, unit: unit || "lb" };
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const body = await request.json();
  const current = await prisma.product.findUniqueOrThrow({ where: { id } });
  const requestedSlug = slugify(body.slug || body.name || current.slug);
  let slug = requestedSlug;
  let suffix = 2;
  while (await prisma.product.findFirst({ where: { slug, NOT: { id } } })) {
    slug = `${requestedSlug}-${suffix}`;
    suffix += 1;
  }
  const salePrice = cents(body.price ?? dollars(current.salePrice));
  const providerCost = cents(body.cost ?? dollars(current.providerCost));
  const parsedWeight = splitWeight(body.weight ?? (current.weight ? `${current.weight} ${current.unit || ""}` : ""));
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name || current.name,
      brand: body.brand ?? current.brand,
      slug,
      description: body.description || current.description,
      category: body.category || current.category,
      providerCost,
      salePrice,
      grossMargin: salePrice - providerCost,
      stock: Number(body.stock ?? current.stock),
      weight: parsedWeight.weight || null,
      unit: parsedWeight.weight ? parsedWeight.unit : null,
      image: body.image || current.image,
    },
    include: { provider: true, municipality: true },
  });
  return NextResponse.json(mapProduct(product));
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true, mode: "deleted" });
  } catch {
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ ok: true, mode: "deactivated" });
  }
}
