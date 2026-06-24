import { PrismaClient, UserRole, WalletDirection, WalletOwnerType, WalletTransactionType } from "@prisma/client";

const prisma = new PrismaClient();
const usd = (value: number) => Math.round(value * 100);
const slugify = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ñ/g, "n").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  await prisma.analyticsEvent.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.courierPayout.deleteMany();
  await prisma.workerPayout.deleteMany();
  await prisma.settlement.deleteMany();
  await prisma.walletAdjustment.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.walletTransfer.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.demoPayment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.service.deleteMany();
  await prisma.product.deleteMany();
  await prisma.courier.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.beneficiary.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.municipality.deleteMany();
  await prisma.province.deleteMany();

  const province = await prisma.province.create({ data: { name: "Artemisa", slug: "artemisa" } });
  const names = ["Artemisa", "Alquízar", "Bahía Honda", "Bauta", "Caimito", "Candelaria", "Guanajay", "Güira de Melena", "Mariel", "San Antonio de los Baños", "San Cristóbal"];
  await prisma.municipality.createMany({
    data: names.map((name) => ({
      provinceId: province.id,
      name,
      slug: slugify(name),
      isAvailable: name === "Bauta",
      message: name === "Bauta" ? "Disponible en esta demo." : "Servicio no disponible aún en este municipio. Estamos trabajando para llegar pronto.",
    })),
  });
  const bauta = await prisma.municipality.findFirstOrThrow({ where: { slug: "bauta" } });

  const admin = await prisma.user.create({ data: { name: "DREX Admin Demo", email: "admin@demo.local", phone: "+5350000001", passwordHash: "demo-hash", role: UserRole.ADMIN } });
  const customerUser = await prisma.user.create({ data: { name: "Cliente Exterior Demo", email: "cliente@demo.local", phone: "+5350000002", passwordHash: "demo-hash", role: UserRole.CUSTOMER } });
  const beneficiaryUser = await prisma.user.create({ data: { name: "Mariela Pérez Demo", email: "beneficiario@demo.local", phone: "+5350000003", passwordHash: "demo-hash", role: UserRole.BENEFICIARY } });

  const customer = await prisma.customer.create({ data: { userId: customerUser.id, country: "Exterior demo", notes: "Cuenta ficticia para compras demo." } });
  const beneficiary = await prisma.beneficiary.create({ data: { userId: beneficiaryUser.id, customerId: customer.id, municipalityId: bauta.id, name: "Mariela Pérez Demo", phone: "+5350000003", address: "Calle Demo 24 #102, Bauta", reference: "Casa azul ficticia", notes: "No usar datos reales." } });

  const providers = await Promise.all([
    prisma.provider.create({ data: { municipalityId: bauta.id, name: "Proveedor Bauta Alimentos", contactName: "Operador Demo A", phone: "+5351000001" } }),
    prisma.provider.create({ data: { municipalityId: bauta.id, name: "Proveedor Bauta Aseo", contactName: "Operador Demo B", phone: "+5351000002" } }),
    prisma.provider.create({ data: { municipalityId: bauta.id, name: "Proveedor Combos Familiares", contactName: "Operador Demo C", phone: "+5351000003" } }),
  ]);

  const productInput = [
    ["Combo Familiar Bauta", "Combos familiares", "Arroz, frijoles, aceite, pasta, sazones y galletas.", 3100, 4200, 18, providers[0].id, "🥘"],
    ["Kit Aseo Hogar", "Aseo", "Detergente, jabón, pasta dental, papel sanitario y desinfectante.", 2000, 2900, 24, providers[1].id, "🧼"],
    ["Combo Desayuno", "Alimentos", "Café, leche en polvo demo, galletas y mermelada.", 2600, 3500, 13, providers[0].id, "☕"],
    ["Combo Bebé Demo", "Familia", "Toallitas, jabón suave, crema y pañales demo.", 4300, 5800, 9, providers[2].id, "🧸"],
    ["Paquete Limpieza", "Hogar", "Cloro, detergente, esponjas y aromatizante.", 1700, 2400, 31, providers[1].id, "🧽"],
    ["Combo Almuerzo", "Alimentos", "Pollo demo, arroz, puré, aceite y vegetales.", 4900, 6400, 7, providers[0].id, "🍗"],
  ] as const;

  const products = [];
  for (const [name, category, description, cost, sale, stock, providerId, image] of productInput) {
    products.push(await prisma.product.create({ data: { municipalityId: bauta.id, providerId, name, slug: slugify(name), description, category, providerCost: cost, salePrice: sale, grossMargin: sale - cost, stock, image } }));
  }

  const courier1 = await prisma.courier.create({ data: { municipalityId: bauta.id, name: "Triciclo 01", phone: "+5352000001", vehicle: "Triciclo eléctrico demo" } });
  await prisma.courier.create({ data: { municipalityId: bauta.id, name: "Triciclo 02", phone: "+5352000002", vehicle: "Moto demo" } });

  const customerWallet = await prisma.wallet.create({ data: { ownerType: WalletOwnerType.CUSTOMER, userId: customerUser.id, balance: usd(120) } });
  const beneficiaryWallet = await prisma.wallet.create({ data: { ownerType: WalletOwnerType.BENEFICIARY, userId: beneficiaryUser.id, balance: usd(46) } });
  await prisma.wallet.create({ data: { ownerType: WalletOwnerType.COURIER, courierId: courier1.id, balance: usd(18) } });

  await prisma.walletTransaction.createMany({ data: [
    { walletId: beneficiaryWallet.id, type: WalletTransactionType.DEMO_TOPUP, amount: usd(75), direction: WalletDirection.CREDIT, description: "Carga DemoPay ficticia.", balanceAfter: usd(75), createdBy: admin.id },
    { walletId: beneficiaryWallet.id, type: WalletTransactionType.PURCHASE_PAYMENT, amount: usd(29), direction: WalletDirection.DEBIT, description: "Compra con Saldo DREX tipo débito.", balanceAfter: usd(46), createdBy: beneficiaryUser.id },
    { walletId: customerWallet.id, type: WalletTransactionType.TRANSFER_OUT, amount: usd(25), direction: WalletDirection.DEBIT, description: "Transferencia interna demo enviada.", balanceAfter: usd(120), createdBy: customerUser.id },
  ] });

  await prisma.walletTransfer.create({ data: { fromWalletId: customerWallet.id, toWalletId: beneficiaryWallet.id, amount: usd(25), note: "Transferencia interna demo. No es dinero real.", createdBy: customerUser.id, completedAt: new Date() } });

  const order1 = await prisma.order.create({ data: { code: "DMC-1001", customerId: customerUser.id, beneficiaryId: beneficiary.id, municipalityId: bauta.id, subtotal: usd(71), deliveryFee: usd(5), total: usd(76), paymentStatus: "APPROVED", orderStatus: "DELIVERED", deliveryStatus: "DELIVERED", notes: "Orden ficticia para reportes." } });
  await prisma.orderItem.createMany({ data: [
    { orderId: order1.id, productId: products[0].id, providerId: products[0].providerId, quantity: 1, unitPrice: products[0].salePrice, unitCost: products[0].providerCost, lineTotal: products[0].salePrice, grossProfit: products[0].grossMargin },
    { orderId: order1.id, productId: products[1].id, providerId: products[1].providerId, quantity: 1, unitPrice: products[1].salePrice, unitCost: products[1].providerCost, lineTotal: products[1].salePrice, grossProfit: products[1].grossMargin },
  ] });
  await prisma.delivery.create({ data: { orderId: order1.id, courierId: courier1.id, status: "DELIVERED", assignedAt: new Date(), deliveredAt: new Date(), notes: "Entrega demo completada." } });
  await prisma.demoPayment.create({ data: { orderId: order1.id, userId: customerUser.id, amount: usd(76), status: "APPROVED", reference: "DEMOPAY-DMC-1001", purpose: "order_payment" } });

  await prisma.settlement.createMany({ data: [
    { providerId: providers[0].id, orderId: order1.id, amount: usd(31), description: "Liquidación ficticia proveedor alimentos." },
    { courierId: courier1.id, orderId: order1.id, amount: usd(5), description: "Pago ficticio repartidor." },
  ] });
  await prisma.analyticsEvent.createMany({ data: [
    { type: "ORDER_CREATED", userId: customerUser.id, orderId: order1.id, amount: usd(76), metadata: "Bauta" },
    { type: "WALLET_TOPUP", userId: beneficiaryUser.id, amount: usd(75), metadata: "Saldo DREX demo" },
  ] });

  console.log("Seed demo creado", { province: province.name, available: bauta.name, order: order1.code });
}

main().finally(async () => prisma.$disconnect());
