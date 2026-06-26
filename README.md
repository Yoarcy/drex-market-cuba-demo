# DREX Market Cuba Demo

Plataforma web demostrativa de portafolio para simular un marketplace hiperlocal por zonas en Cuba.

> **Modo demostración:** este proyecto no vende productos reales, no procesa pagos reales, no usa tarjetas reales, no permite retiros reales y no debe recibir datos personales reales.

## Objetivo

Demostrar capacidad técnica y de negocio construyendo una experiencia completa de e-commerce/marketplace:

- interfaz pública moderna y responsive
- registro/login demo de comprador
- selector de provincia y municipio
- catálogo por municipio
- carrito y checkout
- beneficiario en Cuba
- pasarela ficticia DemoPay
- órdenes y estados
- panel administrativo
- proveedores, repartidores y liquidaciones ficticias
- Saldo DREX tipo débito demo
- reportes y analítica comercial
- base de datos real con Prisma/SQLite

## Alcance MVP

- Provincia Artemisa cargada.
- Municipios visibles:
  - Artemisa
  - Alquízar
  - Bahía Honda
  - Bauta
  - Caimito
  - Candelaria
  - Guanajay
  - Güira de Melena
  - Mariel
  - San Antonio de los Baños
  - San Cristóbal
- Solo Bauta disponible inicialmente.
- Productos ficticios de comida, aseo y combos familiares.
- DemoPay con botones de prueba: aprobado, rechazado y pendiente.
- Panel admin visual con pedidos, productos, proveedores, billeteras y reportes.

## Registro/login de usuarios

El comprador y el beneficiario deben tener usuario y sesión iniciada para completar el flujo real.

- Visitante: puede ver inicio y catálogo demo.
- Usuario registrado: puede usar carrito, checkout, Saldo DREX y pedidos.
- Admin: usa `/admin/login` y no comparte navegación con la tienda pública.

## Imágenes de productos

Carpeta local de trabajo para imágenes:

```txt
public/assets/
```

Formato recomendado:

- JPG/JPEG para fotos.
- WebP para web optimizada.
- PNG solo para transparencias/logos demo.
- Tamaño ideal: 1200x1200 px.
- Mínimo aceptable: 800x800 px.
- Nombres tipo slug: minúsculas, sin espacios, sin acentos.

Ejemplos:

```txt
combo-familiar-bauta.jpg
kit-aseo-hogar.webp
combo-desayuno.jpg
```

## Saldo DREX

Saldo DREX es una billetera interna demostrativa tipo débito.

Reglas:

- No es dinero real.
- No es crédito.
- No es préstamo.
- No es criptomoneda.
- No se conecta a bancos.
- No permite retiros.
- Solo se puede usar saldo previamente cargado dentro de la demo.
- El balance nunca debe quedar negativo.
- Todo cambio de saldo debe crear una transacción auditable.

## Stack

- Next.js / React
- TypeScript
- Tailwind CSS
- Prisma
- SQLite para demo local

## Comandos planificados

```bash
npm install
npm install prisma @prisma/client
npx prisma migrate dev --name init
npm run dev
```

## Rutas principales

- `/` inicio
- `/login` login público de cliente/beneficiario demo
- `/registro` registro público demo
- `/catalogo` catálogo Bauta
- `/productos/[slug]` vista producto
- `/carrito` carrito
- `/checkout` comprador/beneficiario
- `/demopay` pasarela ficticia
- `/orden/[id]` comprobante
- `/mis-pedidos` estado de pedidos
- `/saldo-drex` billetera demo tipo débito
- `/admin/login` login administrativo separado
- `/admin` panel administrativo privado demo

## Separación de interfaces

La tienda pública no debe mostrar navegación administrativa ni permitir que el usuario común gestione productos, proveedores o estadísticas internas.

- Usuario/cliente: compra, carrito, beneficiario, DemoPay, Saldo DREX y pedidos.
- Admin: proveedores, productos, imágenes, precios, pedidos, estadísticas, billeteras y liquidaciones.

## Aviso ético/legal

Este proyecto es únicamente una demo técnica de portafolio. Los nombres, productos, proveedores, repartidores, órdenes, pagos y saldos son ficticios.
