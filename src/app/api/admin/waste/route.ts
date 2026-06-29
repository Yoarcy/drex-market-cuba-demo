import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";

function cents(value: number | string) { return Math.round(Number(value || 0) * 100); }
function dollars(value: number) { return Math.round(value) / 100; }

type WasteWithProduct = {
  id: string;
  productId: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  cause: string;
  payer: string;
  responsible: string;
  chargeAmount: number;
  createdAt: Date;
  product?: { image: string | null } | null;
};

function mapWaste(record: WasteWithProduct) {
  return {
    id: record.id,
    productId: record.productId,
    productName: record.productName,
    productImage: record.productImage || record.product?.image || "",
    quantity: record.quantity,
    cause: record.cause,
    payer: record.payer,
    responsible: record.responsible,
    chargeAmount: dollars(record.chargeAmount),
    createdAt: record.createdAt.toLocaleString("es-CU"),
  };
}

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
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const records = await prisma.wasteRecord.findMany({
    where: { deletedAt: null },
    include: { product: { select: { image: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(records.map(mapWaste));
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const body = await request.json();
  const productId = String(body.productId || "");
  const quantity = Math.max(0, Math.floor(Number(body.quantity || 0)));
  const cause = String(body.cause || "").trim();
  const payer = String(body.payer || "").trim();
  const responsible = String(body.responsible || "").trim() || "DREX";

  if (!productId || !quantity || !cause || !payer) {
    return NextResponse.json({ error: "Faltan datos de la merma." }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUniqueOrThrow({
        where: { id: productId },
        include: { provider: true, municipality: true },
      });
      if (quantity > product.stock) throw new Error("INSUFFICIENT_STOCK");

      const updatedProduct = await tx.product.update({
        where: { id: product.id },
        data: { stock: product.stock - quantity },
        include: { provider: true, municipality: true },
      });
      await tx.inventoryMovement.create({
        data: {
          productId: product.id,
          quantity: -quantity,
          type: "WASTE",
          reason: `${cause} · Paga: ${payer} · Responsable: ${responsible}`,
        },
      });
      const record = await tx.wasteRecord.create({
        data: {
          productId: product.id,
          productName: product.name,
          productImage: product.image || "",
          quantity,
          cause,
          payer,
          responsible,
          chargeAmount: cents(body.chargeAmount ?? dollars(product.providerCost) * quantity),
        },
        include: { product: { select: { image: true } } },
      });
      return { record, product: updatedProduct };
    });

    return NextResponse.json({ record: mapWaste(result.record), product: mapProduct(result.product) }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") {
      return NextResponse.json({ error: "La merma no puede ser mayor que el stock actual." }, { status: 409 });
    }
    return NextResponse.json({ error: "No se pudo registrar la merma." }, { status: 500 });
  }
}
