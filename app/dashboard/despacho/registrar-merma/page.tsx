'use client'

import { useEffect, useState } from 'react'
import { fetchProducts, Product } from '@/lib/api'
import { RegisterLossModal } from '@/components/dashboard/RegisterLossModal'
import { Button } from '@/components/ui/Button'

export default function DespachoRegistrarMermaPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLossModalOpen, setIsLossModalOpen] = useState(false)

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchProducts()
      setProducts(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar productos')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleOpenLossModal = (product: Product) => {
    setSelectedProduct(product)
    setIsLossModalOpen(true)
  }

  const handleCloseLossModal = () => {
    setIsLossModalOpen(false)
    setSelectedProduct(null)
  }

  const handleLossRegistered = async () => {
    await loadProducts()
    handleCloseLossModal()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-teal-800">Registrar merma</h1>
        <Button variant="outline" onClick={loadProducts}>
          Actualizar
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-stone-600">Cargando productos...</p>
      ) : products.length === 0 ? (
        <p className="text-stone-600">No hay productos disponibles.</p>
      ) : (
        <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-teal-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 text-sm text-teal-800">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-stone-600">{product.stock}</td>
                  <td className="px-6 py-4">
                    <Button
                      variant="outline"
                      onClick={() => handleOpenLossModal(product)}
                      disabled={product.stock <= 0}
                      className="text-sm"
                    >
                      Registrar merma
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedProduct && (
        <RegisterLossModal
          isOpen={isLossModalOpen}
          onClose={handleCloseLossModal}
          product={selectedProduct}
          onLossRegistered={handleLossRegistered}
        />
      )}
    </div>
  )
}
