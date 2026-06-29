import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";

function dollars(value: number) { return Math.round(value) / 100; }

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const orders = await prisma.order.findMany({
    include: { customer: true, beneficiary: true, delivery: { include: { courier: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders.map((order) => ({
    id: order.code,
    customer: order.customer.name,
    beneficiary: order.beneficiary.name,
    total: dollars(order.total),
    status: order.orderStatus.replaceAll("_", " "),
    payment: order.paymentStatus.replaceAll("_", " "),
    courier: order.delivery?.courier?.name || "Sin asignar",
  })));
}
