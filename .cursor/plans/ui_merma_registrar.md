# Plan: Conectar "Registrar merma" en la UI

## Objetivo

Exponer la acción **Registrar merma** en el dashboard del pastelero y en la vista de productos del administrador, reutilizando el endpoint backend existente `POST /api/inventory/loss`, sin duplicar lógica y reutilizando el patrón del modal "Ajustar Stock".

---

## Estado actual

- **Backend:** Endpoint `POST /api/inventory/loss` implementado. Body: `{ productId, quantity, reason }`. Requiere JWT y rol PASTERO o ADMINISTRADOR. Responde con el producto actualizado (stock ya descontado).
- **Frontend API:** En [lib/api.ts](pasteleria-app/lib/api.ts) existe `adjustStock` (usa `/inventory/adjust`). **No existe** `registerLoss` ni llamada a `/inventory/loss`.
- **Dashboard pastelero:** [app/dashboard/inventario/page.tsx](pasteleria-app/app/dashboard/inventario/page.tsx) usa [InventoryTable](pasteleria-app/components/dashboard/InventoryTable.tsx) con un solo botón "Ajustar Stock" que abre [AdjustStockModal](pasteleria-app/components/dashboard/AdjustStockModal.tsx). Tras aplicar, se llama `loadProducts()` para refrescar.
- **Vista admin productos:** [app/admin/productos/page.tsx](pasteleria-app/app/admin/productos/page.tsx) muestra una tabla de solo lectura (Producto, Stock, Precio, Estado) **sin columna de acciones**. Texto: "Vista de consulta. Sin opciones de edición ni ajuste de stock."

---

## Cambios propuestos

### 1. API: función para registrar merma

- **Archivo:** [lib/api.ts](pasteleria-app/lib/api.ts) (sección inventario).
- **Añadir:**
  - Interfaz opcional para el body, por ejemplo: `RegisterLossData { productId: string; quantity: number; reason: string }`.
  - Función `registerLoss(data: RegisterLossData): Promise<Product>` que:
    - Haga `POST` a `${API_BASE_URL}/inventory/loss` con `body: JSON.stringify(data)` usando `authenticatedFetch` (para enviar el JWT).
    - En error, lea `errorData.message` o use `getFriendlyStatusMessage(status)` y lance `Error`.
    - En éxito, devuelva `response.json()` (producto actualizado).
- **Endpoint consumido:** `POST /api/inventory/loss` (con el prefijo que defina `getApiUrl()`).

### 2. Componente: modal "Registrar merma"

- **Crear:** [components/dashboard/RegisterLossModal.tsx](pasteleria-app/components/dashboard/RegisterLossModal.tsx).
- **Patrón:** Reutilizar la estructura de [AdjustStockModal.tsx](pasteleria-app/components/dashboard/AdjustStockModal.tsx): overlay, modal centrado, botón cerrar, formulario.
- **Props:** `isOpen`, `onClose`, `product: Product`, `onLossRegistered: () => void` (callback al cerrar tras éxito para refrescar listado).
- **Contenido:**
  - Título tipo "Registrar merma: {product.name}".
  - Mostrar stock actual (solo lectura).
  - Campo **Cantidad** (number, requerido, > 0). Validación en submit: `quantity > 0`.
  - Campo **Motivo** (text, requerido). Validación: no vacío tras trim.
  - Botones Cancelar y "Registrar merma" (submit).
- **Al confirmar:**
  - Llamar a `registerLoss({ productId: product.id, quantity, reason: reason.trim() })`.
  - Si va bien: llamar `onLossRegistered()` y `onClose()`.
  - Si falla: mostrar mensaje de error en el modal (sin cerrar).
- **Estilos:** Misma línea que el resto (Tailwind, teal/stone). Reutilizar `Input` y `Button` existentes.

### 3. Dashboard pastelero (inventario)

- **Archivo:** [app/dashboard/inventario/page.tsx](pasteleria-app/app/dashboard/inventario/page.tsx).
- **Cambios:**
  - Añadir estado para el modal de merma: por ejemplo `selectedProductForLoss` y `isLossModalOpen`.
  - Añadir handler `handleRegisterLoss = (product: Product) => { setSelectedProductForLoss(product); setIsLossModalOpen(true); }` y `handleLossRegistered = async () => { await loadProducts(); setSelectedProductForLoss(null); setIsLossModalOpen(false); }`.
  - Pasar a `InventoryTable` un nuevo callback, por ejemplo `onRegisterLoss={handleRegisterLoss}`.
  - Renderizar `RegisterLossModal` cuando `selectedProductForLoss` esté definido, con `product={selectedProductForLoss}`, `onClose` que limpie estado y cierre, y `onLossRegistered={handleLossRegistered}`.
- **Archivo:** [components/dashboard/InventoryTable.tsx](pasteleria-app/components/dashboard/InventoryTable.tsx).
  - Añadir prop opcional `onRegisterLoss?: (product: Product) => void`.
  - En la columna "Acciones", añadir un segundo botón "Registrar merma" que llame a `onRegisterLoss(product)` cuando la prop exista. Mantener el botón "Ajustar Stock" como está.
  - Evitar duplicar estilos: misma familia de botones (por ejemplo `variant="outline"` o secundario para merma).

### 4. Vista admin (productos / inventario)

- **Archivo:** [app/admin/productos/page.tsx](pasteleria-app/app/admin/productos/page.tsx).
- **Cambios:**
  - Añadir estado para el modal de merma: producto seleccionado y abierto/cerrado del modal.
  - Añadir columna **Acciones** en la tabla con un botón "Registrar merma" por fila (solo esa acción; no es necesario "Ajustar Stock" en esta vista si no se desea en el alcance).
  - Al hacer clic en "Registrar merma", abrir `RegisterLossModal` con ese producto.
  - En `onLossRegistered`, volver a cargar la lista (mismo `fetchProducts` que ya usa la página) y cerrar el modal.
- **Alternativa:** Reutilizar `InventoryTable` en la página de admin pasando solo `onRegisterLoss` (y sin `onAdjustStock` si se quiere que admin solo tenga merma). Así la opción "Registrar merma" queda en las dos pantallas con el mismo componente. La decisión puede ser: en admin usar la misma tabla con una sola acción "Registrar merma" para no duplicar tabla.

Recomendación: en admin mantener la tabla actual (diseño ya existente) y solo añadir columna "Acciones" con el botón "Registrar merma" y el mismo `RegisterLossModal`. Así no se cambia el layout a tabla de dashboard y se evita lógica duplicada de modal/API.

---

## Resumen de archivos

| Acción   | Archivo |
|----------|--------|
| Modificar | [lib/api.ts](pasteleria-app/lib/api.ts) – añadir `registerLoss` y tipo del body |
| Crear    | [components/dashboard/RegisterLossModal.tsx](pasteleria-app/components/dashboard/RegisterLossModal.tsx) |
| Modificar | [components/dashboard/InventoryTable.tsx](pasteleria-app/components/dashboard/InventoryTable.tsx) – botón y prop `onRegisterLoss` |
| Modificar | [app/dashboard/inventario/page.tsx](pasteleria-app/app/dashboard/inventario/page.tsx) – estado, handlers y `RegisterLossModal` |
| Modificar | [app/admin/productos/page.tsx](pasteleria-app/app/admin/productos/page.tsx) – columna Acciones, estado, modal y refresh |

---

## Comportamiento esperado (resumen)

1. **Pantallas donde aparece:** Dashboard inventario (pastelero) y Productos e inventario (admin).
2. **Acción:** Botón "Registrar merma" por producto. Al hacer clic se abre el modal con ese producto.
3. **Modal:** Cantidad (número > 0) y Motivo (obligatorio). Al confirmar se llama a `POST /api/inventory/loss`. Éxito: cerrar y refrescar listado; error: mostrar mensaje en el modal.
4. **Refresco:** Tras registrar merma se vuelve a cargar la lista de productos (`fetchProducts` / `loadProducts`) para que el stock mostrado sea el actualizado.
5. **Endpoint:** El frontend consumirá únicamente `POST /api/inventory/loss` (con la base URL configurada en el proyecto).

---

## Entrega esperada al finalizar

1. **Pantallas:** "Registrar merma" visible en: (1) Dashboard / inventario (pastelero), (2) Productos e inventario (admin).
2. **Componente:** Modal nuevo `RegisterLossModal` (reutilizando patrón de `AdjustStockModal`).
3. **Endpoint:** `POST /api/inventory/loss` consumido desde `registerLoss()` en `lib/api.ts`.
4. **Refresco:** Tras éxito se cierra el modal y se vuelve a cargar la lista de productos en ambas páginas, mostrando el stock actualizado.
5. **Archivos:** Los listados en la tabla de la sección "Resumen de archivos".
