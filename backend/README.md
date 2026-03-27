# Pastelería Bella - API (Backend)

API NestJS con arquitectura en capas: DTO → BLL (Service) → DAL (Repository) → Prisma → PostgreSQL.

## Arquitectura

```
Request
  ↓
Controller (solo delegación, sin lógica de negocio)
  ↓
DTO (validación con class-validator)
  ↓
BLL / Service (reglas de negocio y orquestación)
  ↓
DAL / Repository (solo consultas Prisma)
  ↓
Prisma → PostgreSQL
```

- **Controller**: recibe request, valida con DTO, llama al Service.
- **DTO**: define contrato de entrada y valida con class-validator / class-transformer.
- **Service (BLL)**: reglas de negocio, validaciones de dominio, orquestación.
- **Repository (DAL)**: únicamente consultas y escrituras vía Prisma.

## Módulos

| Módulo      | Descripción |
|------------|-------------|
| `inventory` | Movimientos de inventario (IN, OUT, ADJUST). |
| `products`  | CRUD productos, búsqueda, validar existencia. |
| `orders`   | Pedidos manuales, listar, obtener por id. |
| `reports`  | Tickets de pedidos, ventas por producto, ventas en pesos (daily/weekly/monthly). |
| `admin`    | Capacidades del perfil ADMINISTRADOR y RBAC. |

## Perfil ADMINISTRADOR y RBAC

- **Rol**: `ADMINISTRADOR` (enum `UserRole` en Prisma).
- **Permisos**: ver/crear/buscar productos, crear pedidos manuales, ver pedidos, ver reportes (tickets, ventas por producto, ventas en pesos).
- **Estructura RBAC**: `src/common/constants/roles.ts`, `common/decorators/roles.decorator.ts`, `common/guards/roles.guard.ts`. Para proteger rutas: usar `@UseGuards(RolesGuard)` y `@Roles(AppRole.ADMINISTRADOR)`. Requiere que `req.user` esté definido (p. ej. por un `JwtAuthGuard` previo).

## Endpoints

### Products
- `GET /api/products` — Listar productos.
- `GET /api/products/search?q=` — Buscar por nombre o criterio.
- `GET /api/products/check/:id` — Validar si existe producto.
- `GET /api/products/:id` — Obtener producto.
- `POST /api/products` — Crear producto.

### Orders
- `POST /api/orders/manual` — Crear pedido manual (items con productId y quantity).
- `GET /api/orders?status=` — Listar pedidos (filtro opcional por estado).
- `GET /api/orders/:id` — Obtener pedido.

### Reports
- `GET /api/reports/orders/tickets?range=daily|weekly|monthly&date=&status=` — Tickets del pedido.
- `GET /api/reports/sales/by-product?range=daily|weekly|monthly&date=` — Ventas por producto.
- `GET /api/reports/sales/by-amount?range=daily|weekly|monthly&date=` — Ventas en pesos (total CLP + cantidad de pedidos).

### Admin
- `GET /api/admin/capabilities` — Lista de permisos del rol ADMINISTRADOR.

## Setup

```bash
cd backend
cp .env.example .env
# Editar .env con tu DATABASE_URL

npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

- API: http://localhost:3001/api  
- Swagger: http://localhost:3001/api/docs  

**Nota**: Si ya existía la tabla `users` con `role` como string, la migración a enum `UserRole` puede requerir ajuste manual (conversión de valores o migración en dos pasos).

## Qué falta para cerrar el flujo del administrador

1. **Auth**: Módulo de autenticación (JWT o sesión) que establezca `req.user` (incluido `role`) para poder usar `RolesGuard` en rutas de admin.
2. **Aplicar RBAC**: Añadir `@UseGuards(JwtAuthGuard, RolesGuard)` y `@Roles(AppRole.ADMINISTRADOR)` en los controllers de products, orders y reports (o en rutas concretas) cuando auth esté implementado.
3. **Frontend**: Pantallas de administrador que consuman estos endpoints (listado de productos, búsqueda, crear producto, crear pedido manual, reportes con selector de rango).
4. **Validación de stock en pedidos**: Opcionalmente, al confirmar un pedido o al crearlo, restar stock vía módulo `inventory` (movimiento OUT) y rechazar si no hay stock suficiente.

## Dependencias entre módulos

- **orders** → **products** (validar que productos existan al crear pedido).
- **reports** → **orders** (y OrderItem vía Prisma); no depende de products/reports como módulos NestJS, solo del repositorio de reportes que usa Prisma.
- **admin** → importa products, orders, reports para centralizar capacidades; no contiene lógica de negocio propia.
- **inventory** → independiente; reutilizable para descontar stock cuando se implemente la validación de stock en pedidos.
