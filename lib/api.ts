import { getApiUrl } from './config'

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
      const errorData = await response.json().catch(async () => {
        const errorText = await response.text().catch(() => 'Error desconocido')
        return { message: errorText }
      })
      
      const errorMessage = errorData.message || `Error ${response.status}: ${response.statusText}`
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

export async function login(loginData: LoginData): Promise<AuthResponse> {
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
        const errorText = await response.text().catch(() => 'Error desconocido')
        return { message: errorText }
      })
      
      const errorMessage = errorData.message || `Error ${response.status}: ${response.statusText}`
      throw new Error(errorMessage)
    }

    const data = await response.json()
    
    // Guardar token en localStorage y cookies
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.token)
      setCookie('auth_token', data.token, 7) // 7 días
    }

    return data
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Error de conexión con el servidor. Por favor, intenta nuevamente.')
    } else if (error instanceof Error) {
      throw error
    } else {
      throw new Error('Error desconocido al iniciar sesión')
    }
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
      if (response.status === 401) {
        // Token inválido, limpiar
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
}

export async function getInventoryMovements(productId?: string): Promise<InventoryMovement[]> {
  try {
    const url = productId 
      ? `${API_BASE_URL}/inventory/movements?productId=${productId}`
      : `${API_BASE_URL}/inventory/movements`
    
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
