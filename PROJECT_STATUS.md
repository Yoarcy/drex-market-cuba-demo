# PROJECT_STATUS — DREX Market Cuba Demo

## Estado actual

Fase actual: **integración demo con SQLite/Prisma + pulido visual público/admin**.

Rama de trabajo activa: `feature/sqlite-cart-orders-admin`.

## Completado

- Proyecto Next.js funcional en `/root/.openclaw/workspace/projects/drex-factory/drex-market-cuba-demo`.
- Documentación base creada.
- Prisma configurado para SQLite demo.
- Migración inicial creada en `prisma/migrations/`.
- Base local `prisma/dev.db` usada solo para desarrollo; no se versiona.
- UI pública inicial creada:
  - Inicio
  - Selector provincia/municipio
  - Catálogo
  - Catálogo por municipio/categoría
  - Vista producto
  - Carrito
  - Checkout
  - DemoPay
  - Confirmación de orden
  - Mis pedidos
  - Login/registro demo
  - Saldo DREX
- Header público con menú hamburguesa React nuevo:
  - abre/cierra con botón
  - cierra con click fuera
  - cierra con `Esc`
  - cierra al tocar enlace
  - animación de aparición/escala
  - blur fuerte en panel
- Popup de perfil/login convencional:
  - login usuario/correo + contraseña
  - recuperar contraseña
  - crear cuenta
  - foto/avatar editable
- Carrito interactivo con cantidades, eliminación, peso total y aviso de bloques de 20 kg para mensajería.
- UI admin inicial separada de tienda pública:
  - login admin `/admin/login`
  - dashboard
  - pedidos recientes
  - analítica comercial
  - municipios
  - billeteras
  - proveedores
  - productos con imagen/precio/stock
- APIs admin iniciales conectadas a Prisma:
  - `GET /api/admin/orders`
  - `GET/POST /api/admin/products`
  - `GET/POST /api/admin/providers`
  - `DELETE /api/admin/providers/[id]`
- Módulo de inteligencia demo agregado:
  - recomendaciones basadas en co-compra, tendencia semanal y saldo disponible
  - previsión de demanda
  - riesgo de agotamiento por producto
  - fórmula visible y comprobable en UI

## Verificación técnica reciente

- `node node_modules/typescript/bin/tsc --noEmit` pasa sin errores.
- `npm run lint` pasa sin errores; quedan warnings normales por uso de `<img>`.
- `npm run build` compila correctamente con Next 15.5.19.
- Servidor real probado en puerto `3001`.
- Rutas verificadas con respuesta `200`:
  - `/`
  - `/catalogo`
  - `/carrito`
  - `/admin`
  - `/mis-pedidos`
  - `/api/admin/products`
  - `/api/admin/providers`
  - `/api/admin/orders`

## Decisiones

- Nombre de billetera: **Saldo DREX**.
- Saldo DREX será tipo débito demo: solo saldo previamente cargado, sin balance negativo.
- DemoPay será pasarela ficticia sin datos de tarjeta.
- Artemisa se carga completa; solo Bauta disponible en MVP.
- La UI tiene prioridad de portafolio: debe verse comercial, moderna y responsive.
- Tienda pública y panel admin deben estar separados; el usuario común no debe ver ni navegar funciones administrativas.
- No versionar logs, archivos `.pid`, previews locales ni `prisma/dev.db`.

## Pendiente inmediato recomendado

1. Validar visualmente el menú hamburguesa en pantalla/teléfono.
2. Continuar conexión real de carrito/órdenes a SQLite.
3. Pulir admin para que productos/proveedores/órdenes usen Prisma de forma consistente.
4. Añadir seed demo controlado si hace falta para mostrar datos estables.
5. Revisar warnings de `<img>` más adelante si se desea optimización con `next/image`.

## Bloqueos actuales

- No hay bloqueo técnico crítico detectado.
- El proyecto compila, TypeScript pasa y lint no tiene errores.
