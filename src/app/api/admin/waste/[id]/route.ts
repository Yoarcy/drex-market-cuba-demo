import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";

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

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const { id } = await params;

  try {
    const product = await prisma.$transaction(async (tx) => {
      const record = await tx.wasteRecord.findUniqueOrThrow({ where: { id } });
      if (record.deletedAt) throw new Error("ALREADY_DELETED");
      await tx.wasteRecord.update({ where: { id }, data: { deletedAt: new Date() } });
      const updatedProduct = await tx.product.update({
        where: { id: record.productId },
        data: { stock: { increment: record.quantity } },
        include: { provider: true, municipality: true },
      });
      await tx.inventoryMovement.create({
        data: {
          productId: record.productId,
          quantity: record.quantity,
          type: "WASTE_CANCELLED",
          reason: `Merma eliminada: ${record.cause} · Se devuelve al stock`,
        },
      });
      return updatedProduct;
    });
    return NextResponse.json({ ok: true, product: mapProduct(product) });
  } catch {
    return NextResponse.json({ error: "No se pudo eliminar la merma y devolver el stock." }, { status: 500 });
  }
}
