import { getApiUrl } from './config'

// Obtener URL del API con validación
const API_BASE_URL = getApiUrl()

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
