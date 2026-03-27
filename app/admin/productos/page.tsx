'use client'

import { useState, useEffect } from 'react'
import { fetchProducts, Product } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { RegisterLossModal } from '@/components/dashboard/RegisterLossModal'

function formatCLP(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lossProduct, setLossProduct] = useState<Product | null>(null)
  const [isLossModalOpen, setIsLossModalOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const list = await fetchProducts()
        if (!cancelled) setProducts(list)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error al cargar productos')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-teal-800 mb-6">Productos e inventario</h2>
        <p className="text-stone-600">Cargando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-teal-800 mb-6">Productos e inventario</h2>
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  const handleRegisterLoss = (product: Product) => {
    setLossProduct(product)
    setIsLossModalOpen(true)
  }

  const handleCloseLossModal = () => {
    setIsLossModalOpen(false)
    setLossProduct(null)
  }

  const handleLossRegistered = async () => {
    try {
      const list = await fetchProducts()
      setProducts(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar')
    }
    handleCloseLossModal()
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-teal-800 mb-2">Productos e inventario</h2>
      <p className="text-sm text-stone-600 mb-6">Vista de consulta. Puedes registrar mermas desde la columna Acciones.</p>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-stone-500">
                    No hay productos.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 text-sm text-teal-800">{p.name}</td>
                    <td className="px-6 py-4 text-sm text-stone-600 text-right">{p.stock}</td>
                    <td className="px-6 py-4 text-sm text-stone-600 text-right">{formatCLP(p.priceCLP)}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          p.active ? 'bg-teal-100 text-teal-800' : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {p.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="outline"
                        onClick={() => handleRegisterLoss(p)}
                        className="text-sm"
                      >
                        Registrar merma
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {lossProduct && (
        <RegisterLossModal
          isOpen={isLossModalOpen}
          onClose={handleCloseLossModal}
          product={lossProduct}
          onLossRegistered={handleLossRegistered}
        />
      )}
    </div>
  )
}
