# PROJECT_STATUS — DREX Market Cuba Demo

## Estado actual

Fase iniciada: **Fase 0 / Fase 1 visual base**

## Completado

- Carpeta creada en `/root/.openclaw/workspace/projects/drex-factory/drex-market-cuba-demo`.
- Proyecto Next.js inicializado.
- Documentación base creada.
- Prisma schema inicial creado para SQLite demo.
- UI pública inicial creada:
  - Inicio
  - Selector provincia/municipio
  - Catálogo
  - Vista producto
  - Carrito
  - Checkout
  - DemoPay
  - Confirmación de orden
  - Mis pedidos
  - Login
  - Registro
  - Saldo DREX
- UI admin inicial creada y separada de la tienda pública:
  - login admin `/admin/login`
  - Dashboard
  - pedidos recientes
  - analítica comercial
  - municipios
  - billeteras
  - formulario visual para agregar proveedores
  - formulario visual para agregar productos con imagen y precios
  - productos/proveedores
- Módulo de inteligencia demo agregado:
  - recomendaciones basadas en co-compra, tendencia semanal y saldo disponible
  - previsión de demanda
  - riesgo de agotamiento por producto
  - fórmula visible y comprobable en UI
- Verificación TypeScript de la app completada con `node node_modules/typescript/bin/tsc --noEmit` sin errores.

## Decisiones

- Nombre de billetera corregido a **Saldo DREX** para evitar confusión con crédito.
- Saldo DREX será tipo débito demo: solo saldo previamente cargado, sin balance negativo.
- DemoPay será pasarela ficticia sin datos de tarjeta.
- Artemisa se carga completa; solo Bauta disponible en MVP.
- La UI tiene prioridad de portafolio: debe verse comercial, moderna y responsive.
- Tienda pública y panel admin deben estar separados; el usuario no debe ver ni navegar funciones administrativas.

## Pendiente inmediato

- Reparar instalación npm/Next para generar binarios y `package-lock.json` correctamente.
- Validar build Next.js.
- Ejecutar `prisma generate` y `prisma migrate dev` cuando dependencias estén sanas.
- Conectar UI a base de datos real en vez de datos estáticos.
- Ajustar/validar `prisma/seed.ts` después de generar Prisma Client.

## Bloqueo actual

- `npm install` descarga paquetes pero queda incompleto/colgado hasta ser terminado por el sistema; no genera `.bin` ni `package-lock.json` de forma confiable.
- `next build` falla con `SIGBUS` en este entorno.
- TypeScript de la app sí pasa limpio; el bloqueo está en instalación/build, no en las pantallas creadas.
