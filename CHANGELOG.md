# CHANGELOG

## 2026-06-24

### Added

- Proyecto `DREX Market Cuba Demo` creado.
- README inicial con aviso de demo técnica.
- PROJECT_STATUS inicial.
- Prisma schema base con entidades de marketplace, órdenes, DemoPay, Saldo DREX, transferencias internas, liquidaciones y analítica.
- UI pública completa inicial:
  - inicio
  - selector de Artemisa/Bauta
  - catálogo
  - producto
  - carrito
  - checkout
  - DemoPay
  - comprobante
  - mis pedidos
  - login/registro demo
  - Saldo DREX
- UI admin inicial:
  - dashboard
  - pedidos
  - analítica
  - billeteras
  - productos/proveedores
- Módulo de inteligencia comercial demo:
  - recomendaciones de productos
  - previsión de demanda
  - riesgo de agotamiento
  - fórmula visible basada en ventas demo, tendencia y stock
- Separación inicial de interfaces:
  - navegación pública sin acceso admin
  - login admin separado en `/admin/login`
  - panel admin con formularios visuales para proveedores y productos con imágenes/precios

### Changed

- Billetera renombrada conceptualmente a `Saldo DREX`.
- Regla corregida: solo débito, no crédito, no préstamos, no saldo negativo.

### Notes

- No hay pagos reales.
- No hay productos reales.
- No usar datos personales reales.
