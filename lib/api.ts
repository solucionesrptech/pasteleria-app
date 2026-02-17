const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

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
    })
    
    if (!response.ok) {
      throw new Error('Error al obtener productos')
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      throw new Error('Error al obtener producto')
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}
