# DREX Market Cuba Demo — propuesta Prisma + seed

Demo profesional para portfolio Next.js. Todo el contenido es ficticio: usuarios, teléfonos, pagos, proveedores, productos, repartidores y órdenes.

## Archivos incluidos

- `prisma/schema.prisma` — modelo de datos implementable con PostgreSQL.
- `prisma/seed.ts` — seed demo para Artemisa/Bauta, catálogo, usuarios, órdenes, billetera y analytics.

## Objetivo del demo

Mostrar un marketplace cubano enfocado en entregas locales:

- Provincia Artemisa cargada completa.
- Solo `Bauta` aparece como municipio disponible.
- El resto de municipios quedan en modo “próximamente”.
- Compra desde cliente exterior hacia beneficiario en Cuba.
- Pago demo con `DemoPay` y/o saldo interno.
- Billetera interna tipo débito: el usuario solo puede gastar saldo existente.
- Transferencias internas entre usuarios.
- Ledger auditable en `wallet_transactions`.
- Panel admin con métricas básicas de conversión, órdenes y wallet.

## Decisiones de diseño

### 1. Base de datos

Se propone PostgreSQL porque encaja mejor con Prisma en producción/demo desplegable:

- enums nativos,
- campos `Json`,
- arrays `String[]` para tags/permisos,
- buen camino a Neon, Supabase o Railway.

Para desarrollo local se puede usar Docker Postgres o una base cloud gratuita. Si se desea SQLite, habría que cambiar arrays a tablas relacionales o strings JSON.

### 2. Auth

`User.role` soporta:

- `CUSTOMER` — comprador o cliente exterior.
- `ADMIN` — operador del demo.
- `BENEFICIARY` — receptor en Cuba.

Perfiles separados:

- `CustomerProfile`
- `AdminProfile`
- `BeneficiaryProfile`

Esto permite que el UI sea claro y evita mezclar datos de comprador, administrador y receptor.

### 3. Cobertura Cuba/Artemisa

`Province` y `Municipality` permiten crecer a otras provincias después.

El seed carga los 11 municipios de Artemisa:

- Alquízar
- Artemisa
- Bahía Honda
- Bauta ✅ disponible
- Caimito
- Candelaria
- Guanajay
- Güira de Melena
- Mariel
- San Antonio de los Baños
- San Cristóbal

Solo Bauta tiene `isAvailable = true`.

### 4. Billetera interna tipo débito

Modelos principales:

- `Wallet`
- `WalletTransaction`
- `InternalTransfer`
- `DemoPayment`

Reglas recomendadas en la capa de servicio:

1. Nunca permitir `balanceCents < 0`.
2. Toda operación de wallet debe crear una fila en `WalletTransaction`.
3. `amountCents` siempre positivo.
4. `direction` define si es `CREDIT` o `DEBIT`.
5. `balanceAfterCents` guarda el saldo después de la operación para auditoría.
6. Usar transacciones DB (`prisma.$transaction`) para pagos, recargas y transferencias.

No es crédito. No hay préstamos, deuda ni límite negativo.

### 5. DemoPay

`DemoPayment` simula un proveedor de pago para portfolio:

- recarga ficticia de wallet,
- pago de orden desde wallet,
- referencias demo únicas,
- `cardLast4` falso para UI.

No procesa dinero real.

### 6. Analytics

`AnalyticsEvent` permite alimentar dashboard admin:

- visitas,
- vistas de producto,
- checkout iniciado,
- intentos DemoPay,
- órdenes creadas/entregadas,
- recargas,
- transferencias internas.

## Datos que crea el seed

- Admin demo: `admin@drexmarket.demo`
- Cliente demo: `cliente@drexmarket.demo`
- Beneficiaria demo: `beneficiario@drexmarket.demo`
- 2 proveedores ficticios en Bauta.
- 2 productos demo.
- 1 repartidor demo.
- 1 orden entregada.
- 1 recarga DemoPay.
- 1 pago de orden con wallet.
- 1 transferencia interna.
- Eventos analytics para mostrar dashboard.

## Integración sugerida en Next.js

Rutas mínimas para portfolio:

- `/` landing + selector de municipio.
- `/market/bauta` catálogo.
- `/products/[slug]` detalle.
- `/checkout` flujo DemoPay/wallet.
- `/wallet` saldo, recargas demo y transferencias.
- `/orders` historial cliente/beneficiario.
- `/admin` dashboard operativo.
- `/admin/orders` gestión de órdenes.
- `/admin/analytics` métricas.

Servicios recomendados:

- `lib/prisma.ts` singleton Prisma Client.
- `services/wallet.ts` para `topUpWallet`, `payOrderWithWallet`, `transferInternal`.
- `services/orders.ts` para crear/actualizar órdenes.
- `services/analytics.ts` para registrar eventos.

## Próximos pasos implementables

1. Añadir dependencias en el proyecto real:
   - `prisma`
   - `@prisma/client`
2. Configurar `.env` con `DATABASE_URL`.
3. Añadir en `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

4. Ejecutar migración/seed en entorno demo:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

5. Implementar transacciones de wallet siempre con `prisma.$transaction`.

## Nota de seguridad

El schema y seed son para demo portfolio. Antes de producción real habría que añadir:

- auth real con hash seguro o provider externo,
- validación server-side estricta,
- idempotencia para pagos,
- controles antifraude,
- logs operativos,
- políticas de privacidad,
- manejo legal de datos personales.
