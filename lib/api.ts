import { getApiUrl, getBackendApiUrl } from './config'

// Obtener URL del API con validación
const API_BASE_URL = getApiUrl()

// Helper para manejar cookies
function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === 'undefined') return
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`
}

// Helper para obtener token (primero de cookies, luego de localStorage)
function getToken(): string | null {
  if (typeof window === 'undefined') return null
  
  // Intentar obtener de cookies primero
  const cookieToken = getCookie('auth_token')
  if (cookieToken) {
    return cookieToken
  }
  
  // Fallback a localStorage
  return localStorage.getItem('auth_token')
}

function getFriendlyStatusMessage(status: number): string {
  switch (status) {
    case 401:
      return 'Credenciales inválidas. Revisa tu email y contraseña.'
    case 403:
      return 'No tienes permiso para realizar esta acción.'
    case 404:
      return 'No se encontró el servicio. Verifica que la API esté en ejecución.'
    case 500:
      return 'Error en el servidor. Intenta más tarde.'
    default:
      return `Error ${status}. Intenta nuevamente.`
  }
}

// Helper para hacer requests autenticados
async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

export interface Product {
  id: string
  name: string
  description: string | null
  priceCLP: number
  imageUrl: string | null
  active: boolean
  stock: number
  createdAt: Date
  updatedAt: Date
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Error desconocido')
      console.error(`Error ${response.status}: ${errorText}`)
      throw new Error(`Error al obtener productos: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  } catch (error) {
    // Manejar errores de red (servidor no disponible, CORS, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Error de conexión: El backend no está disponible en', API_BASE_URL)
      console.error('Asegúrate de que el backend esté corriendo en el puerto 3001')
    } else {
      console.error('Error fetching products:', error)
    }
    return []
  }
}

export async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Error desconocido')
      console.error(`Error ${response.status}: ${errorText}`)
      throw new Error(`Error al obtener producto: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  } catch (error) {
    // Manejar errores de red (servidor no disponible, CORS, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Error de conexión: El backend no está disponible en', API_BASE_URL)
      console.error('Asegúrate de que el backend esté corriendo en el puerto 3001')
    } else {
      console.error('Error fetching product:', error)
    }
    return null
  }
}

export interface CreateOrderData {
  customerName: string
  customerEmail: string
  customerPhone: string
  fulfillmentType: 'DELIVERY' | 'PICKUP'
  deliveryAddress?: string
  zone?: string
  items: Array<{ productId: string; quantity: number }>
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  unitPriceCLP: number
  lineTotalCLP: number
  createdAt: Date
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  fulfillmentType: 'DELIVERY' | 'PICKUP'
  deliveryAddress?: string | null
  zone?: string | null
  totalCLP: number
  status: string
  publicToken: string
  createdAt: Date
  updatedAt: Date
  items: OrderItem[]
}

export interface InternalOrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPriceCLP: number
  lineTotalCLP: number
}

export interface InternalOrder {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  fulfillmentType: 'DELIVERY' | 'PICKUP'
  deliveryAddress?: string | null
  zone?: string | null
  totalCLP: number
  status: string
  publicToken: string
  createdAt: Date
  updatedAt: Date
  items: InternalOrderItem[]
}

export async function fetchInternalOrders(): Promise<InternalOrder[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/orders/internal`)
  if (!response.ok) {
    const text = await response.text()
    let errorMessage = `Error ${response.status}: ${response.statusText}`
    try {
      const errorData = text ? JSON.parse(text) : {}
      const msg = errorData.message
      if (typeof msg === 'string' && msg) errorMessage = msg
      else if (Array.isArray(msg) && msg.length > 0) errorMessage = msg.join('. ')
    } catch {
      if (text && text.length < 200) errorMessage = text
    }
    throw new Error(errorMessage)
  }
  return response.json()
}

export async function updateOrderStatus(orderId: string, status: string): Promise<InternalOrder> {
  const response = await authenticatedFetch(`${API_BASE_URL}/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  if (!response.ok) {
    const text = await response.text()
    let errorMessage = `Error ${response.status}: ${response.statusText}`
    try {
      const errorData = text ? JSON.parse(text) : {}
      const msg = errorData.message
      if (typeof msg === 'string' && msg) errorMessage = msg
      else if (Array.isArray(msg) && msg.length > 0) errorMessage = msg.join('. ')
    } catch {
      if (text && text.length < 200) errorMessage = text
    }
    throw new Error(errorMessage)
  }
  return response.json()
}

export async function createOrder(orderData: CreateOrderData): Promise<Order> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const text = await response.text()
      let errorMessage = `Error ${response.status}: ${response.statusText}`
      try {
        const errorData = text ? JSON.parse(text) : {}
        const msg = errorData.message
        const err = errorData.error
        if (Array.isArray(msg) && msg.length > 0) {
          errorMessage = msg.join('. ')
        } else if (typeof msg === 'string' && msg) {
          errorMessage = msg
        } else if (typeof err === 'string' && err) {
          errorMessage = err
        }
      } catch {
        if (text && text.length < 200) errorMessage = text
      }
      console.error(`Error al crear orden: ${errorMessage}`)
      throw new Error(errorMessage)
    }

    return response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Error de conexión: El backend no está disponible en', API_BASE_URL)
      console.error('Asegúrate de que el backend esté corriendo en el puerto 3001')
      throw new Error('Error de conexión con el servidor. Por favor, intenta nuevamente.')
    } else if (error instanceof Error) {
      throw error
    } else {
      console.error('Error desconocido al crear orden:', error)
      throw new Error('Error desconocido al crear la orden')
    }
  }
}

// ==================== AUTENTICACIÓN ====================

export interface User {
  id: string
  email: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginData {
  email: string
  password: string
}

export type LoginResult = { success: true; user: User; token: string } | { success: false; error: string }

export async function login(loginData: LoginData): Promise<LoginResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(async () => {
        const errorText = await response.text().catch(() => '')
        return { message: errorText || undefined }
      })

      const rawMessage = errorData?.message
      let errorMessage: string
      if (typeof rawMessage === 'string' && rawMessage.trim()) {
        errorMessage =
          rawMessage.length > 500 || rawMessage.trim().startsWith('<')
            ? getFriendlyStatusMessage(response.status)
            : rawMessage.trim()
      } else if (Array.isArray(rawMessage) && rawMessage.length > 0) {
        errorMessage = (rawMessage as string[]).join('. ')
      } else {
        errorMessage = getFriendlyStatusMessage(response.status)
      }
      return { success: false, error: errorMessage }
    }

    const data = await response.json()

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.token)
      setCookie('auth_token', data.token, 7) // 7 días
    }

    return { success: true, user: data.user, token: data.token }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { success: false, error: 'Error de conexión con el servidor. Por favor, intenta nuevamente.' }
    }
    return { success: false, error: 'Error desconocido al iniciar sesión' }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = getToken()
    if (!token) {
      return null
    }

    const response = await authenticatedFetch(`${API_BASE_URL}/auth/me`)

    if (!response.ok) {
      // 401 o 5xx: tratar como sesión inválida para no romper la app
      if (response.status === 401 || response.status >= 500) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
          deleteCookie('auth_token')
        }
        return null
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error al obtener usuario actual:', error)
    return null
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    deleteCookie('auth_token')
  }
}

// ==================== REPORTES ====================

export interface SalesReportSummary {
  totalSalesCLP: number
  paidOrdersCount: number
  unitsSold: number
}

export interface SalesReportProduct {
  productId: string
  productName: string
  quantitySold: number
  totalSalesCLP: number
}

export type SalesReportRange = 'daily' | 'weekly' | 'monthly'

export interface LossSummary {
  totalUnitsLost: number
  count: number
  estimatedCostCLP: number
}

export interface LossItem {
  createdAt: string
  productId: string
  productName: string
  quantity: number
  reason: string | null
  userId: string | null
  userEmail: string | null
  estimatedCostCLP: number
}

export interface SalesReportResponse {
  range: string
  summary: SalesReportSummary
  products: SalesReportProduct[]
  lossSummary?: LossSummary
  losses?: LossItem[]
}

export async function getSalesReport(range: SalesReportRange): Promise<SalesReportResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/reports/sales?range=${range}`)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: '' }))
    const msg = errorData?.message || getFriendlyStatusMessage(response.status)
    throw new Error(msg)
  }
  return response.json()
}

// ==================== INVENTARIO ====================

export interface AdjustStockData {
  productId: string
  quantity: number
  reason?: string
}

export async function adjustStock(data: AdjustStockData): Promise<Product> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/inventory/adjust`, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(async () => {
        const errorText = await response.text().catch(() => 'Error desconocido')
        return { message: errorText }
      })
      
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Error desconocido al ajustar stock')
  }
}

export interface RegisterLossData {
  productId: string
  quantity: number
  reason: string
}

export async function registerLoss(data: RegisterLossData): Promise<Product> {
  const response = await authenticatedFetch(`${getBackendApiUrl()}/inventory/loss`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: '' }))
    const msg = errorData?.message || getFriendlyStatusMessage(response.status)
    throw new Error(msg)
  }
  return response.json()
}

export interface InventoryMovement {
  id: string
  productId: string
  type: string
  quantity: number
  reason: string | null
  userId: string | null
  createdAt: Date
  product: {
    id: string
    name: string
  }
  user?: {
    id: string
    email: string
  } | null
}

export async function getInventoryMovements(
  productId?: string,
  type?: string,
  dateFrom?: string,
  dateTo?: string,
): Promise<InventoryMovement[]> {
  try {
    const params = new URLSearchParams()
    if (productId) params.set('productId', productId)
    if (type) params.set('type', type)
    if (dateFrom) params.set('dateFrom', dateFrom)
    if (dateTo) params.set('dateTo', dateTo)
    const query = params.toString()
    const url = query
      ? `${getBackendApiUrl()}/inventory/movements?${query}`
      : `${getBackendApiUrl()}/inventory/movements`

    const response = await authenticatedFetch(url)

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error al obtener movimientos de inventario:', error)
    return []
  }
}

export async function getLowStockProducts(threshold: number = 5): Promise<Product[]> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/inventory/low-stock?threshold=${threshold}`)

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error)
    return []
  }
}

// ==================== PRODUCTOS (CRUD) ====================

export interface CreateProductData {
  name: string
  description?: string
  priceCLP: number
  stock: number
  imageUrl?: string
  active?: boolean
}

export interface UpdateProductData {
  name?: string
  description?: string
  priceCLP?: number
  stock?: number
  imageUrl?: string
  active?: boolean
}

export async function createProduct(data: CreateProductData): Promise<Product> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(async () => {
        const errorText = await response.text().catch(() => 'Error desconocido')
        return { message: errorText }
      })
      
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Error desconocido al crear producto')
  }
}

export async function updateProduct(id: string, data: UpdateProductData): Promise<Product> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(async () => {
        const errorText = await response.text().catch(() => 'Error desconocido')
        return { message: errorText }
      })
      
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Error desconocido al actualizar producto')
  }
}

export async function deleteProduct(id: string): Promise<Product> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(async () => {
        const errorText = await response.text().catch(() => 'Error desconocido')
        return { message: errorText }
      })
      
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Error desconocido al eliminar producto')
  }
}
