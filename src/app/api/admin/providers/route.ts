import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";

function mapProvider(provider: { id: string; name: string; contactName: string | null; phone: string | null; isActive: boolean; municipality: { name: string; province: { name: string } } }) {
  return {
    id: provider.id,
    name: provider.name,
    municipality: provider.municipality.name,
    province: provider.municipality.province.name,
    category: "Mercado",
    contact: provider.contactName || "Sin contacto",
    phone: provider.phone || "",
    status: provider.isActive ? "Activo" : "Inactivo",
    imageFile: "Base de datos",
  };
}

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const providers = await prisma.provider.findMany({ where: { isActive: true }, include: { municipality: { include: { province: true } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(providers.map(mapProvider));
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const body = await request.json();
  const municipality = await prisma.municipality.findFirstOrThrow({ where: { name: body.municipality || "Bauta" } });
  const provider = await prisma.provider.create({
    data: {
      municipalityId: municipality.id,
      name: body.name,
      contactName: body.contact || body.notes || "Sin notas",
      phone: body.phone || "",
      isActive: true,
    },
    include: { municipality: { include: { province: true } } },
  });
  return NextResponse.json(mapProvider(provider), { status: 201 });
}
