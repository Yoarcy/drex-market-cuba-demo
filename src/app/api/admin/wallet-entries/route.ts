import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";

function cents(value: number | string) { return Math.round(Number(value || 0) * 100); }
function dollars(value: number) { return Math.round(value) / 100; }

type Entry = {
  id: string;
  kind: string;
  beneficiaryName: string | null;
  senderName: string | null;
  assignedToName: string | null;
  assignedToRole: string | null;
  amount: number;
  note: string | null;
  createdAt: Date;
};

function mapEntry(entry: Entry) {
  return {
    id: entry.id,
    kind: entry.kind,
    beneficiaryName: entry.beneficiaryName || "",
    senderName: entry.senderName || "",
    assignedToName: entry.assignedToName || "",
    assignedToRole: entry.assignedToRole || "",
    amount: dollars(entry.amount),
    note: entry.note || "",
    createdAt: entry.createdAt.toLocaleString("es-CU"),
    searchDate: entry.createdAt.toISOString().slice(0, 10),
  };
}

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const entries = await prisma.adminWalletEntry.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(entries.map(mapEntry));
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const body = await request.json().catch(() => ({}));
  const kind = String(body.kind || "").trim();
  const amount = cents(body.amount || 0);
  const beneficiaryName = String(body.beneficiaryName || "").trim();
  const senderName = String(body.senderName || "").trim();
  const assignedToName = String(body.assignedToName || "").trim();
  const assignedToRole = String(body.assignedToRole || "").trim();
  const note = String(body.note || "").trim();

  if (!kind || amount <= 0) return NextResponse.json({ error: "Falta tipo o cantidad." }, { status: 400 });
  if (kind === "TOPUP" && (!beneficiaryName || !senderName)) {
    return NextResponse.json({ error: "Pon beneficiario y quién puso el dinero." }, { status: 400 });
  }
  if (kind === "ADMIN_PAYMENT" && (!assignedToName || !assignedToRole)) {
    return NextResponse.json({ error: "Pon a quién se asigna la billetera y su rol." }, { status: 400 });
  }

  const entry = await prisma.adminWalletEntry.create({
    data: {
      kind,
      beneficiaryName: beneficiaryName || null,
      senderName: senderName || null,
      assignedToName: assignedToName || null,
      assignedToRole: assignedToRole || null,
      amount,
      note: note || null,
      createdBy: "admin",
    },
  });
  return NextResponse.json(mapEntry(entry), { status: 201 });
}
