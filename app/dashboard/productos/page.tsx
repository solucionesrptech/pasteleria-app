'use client'

import { useState, useEffect } from 'react'
import { fetchProducts, createProduct, updateProduct, deleteProduct, Product } from '@/lib/api'
import { ProductForm } from '@/components/dashboard/ProductForm'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const allProducts = await fetchProducts()
      setProducts(allProducts)
    } catch (error) {
      console.error('Error al cargar productos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedProduct(null)
    setIsEditing(false)
    setIsFormOpen(true)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsEditing(true)
    setIsFormOpen(true)
  }

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar "${product.name}"?`)) {
      return
    }

    try {
      await deleteProduct(product.id)
      await loadProducts()
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      alert('Error al eliminar producto. Por favor, intenta nuevamente.')
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedProduct(null)
    setIsEditing(false)
  }

  const handleProductSaved = async () => {
    await loadProducts()
    handleCloseForm()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-teal-800">Gestión de Productos</h2>
        <Button variant="primary" onClick={handleCreate}>
          Crear Producto
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-stone-600">Cargando productos...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-stone-600">No hay productos disponibles.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-teal-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-stone-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-teal-800">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-stone-500 line-clamp-1">{product.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-stone-700">
                      ${product.priceCLP.toLocaleString('es-CL')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-teal-600">{product.stock}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.active ? (
                      <Badge variant="success">Activo</Badge>
                    ) : (
                      <Badge variant="error">Inactivo</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(product)}
                        className="text-sm"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDelete(product)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          isEditing={isEditing}
          onClose={handleCloseForm}
          onSaved={handleProductSaved}
        />
      )}
    </div>
  )
}
