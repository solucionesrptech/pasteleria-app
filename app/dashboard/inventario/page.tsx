'use client'

import { useState, useEffect } from 'react'
import { fetchProducts, adjustStock, getLowStockProducts, Product } from '@/lib/api'
import { InventoryTable } from '@/components/dashboard/InventoryTable'
import { AdjustStockModal } from '@/components/dashboard/AdjustStockModal'
import { RegisterLossModal } from '@/components/dashboard/RegisterLossModal'

export default function InventarioPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [lossProduct, setLossProduct] = useState<Product | null>(null)
  const [isLossModalOpen, setIsLossModalOpen] = useState(false)
  const [showLowStock, setShowLowStock] = useState(false)

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

  const handleAdjustStock = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleStockAdjusted = async () => {
    await loadProducts()
    handleCloseModal()
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
    await loadProducts()
    handleCloseLossModal()
  }

  const handleToggleLowStock = async () => {
    if (!showLowStock) {
      try {
        setLoading(true)
        const lowStockProducts = await getLowStockProducts(5)
        setProducts(lowStockProducts)
        setShowLowStock(true)
      } catch (error) {
        console.error('Error al cargar productos con stock bajo:', error)
      } finally {
        setLoading(false)
      }
    } else {
      await loadProducts()
      setShowLowStock(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-teal-800">Gestión de Inventario</h2>
        <div className="flex gap-4">
          <button
            onClick={handleToggleLowStock}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              showLowStock
                ? 'bg-teal-600 text-white'
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
          >
            {showLowStock ? 'Mostrar Todos' : 'Stock Bajo (≤5)'}
          </button>
          <button
            onClick={loadProducts}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            Actualizar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-stone-600">Cargando productos...</p>
        </div>
      ) : (
        <InventoryTable
          products={products}
          onAdjustStock={handleAdjustStock}
          onRegisterLoss={handleRegisterLoss}
        />
      )}

      {lossProduct && (
        <RegisterLossModal
          isOpen={isLossModalOpen}
          onClose={handleCloseLossModal}
          product={lossProduct}
          onLossRegistered={handleLossRegistered}
        />
      )}

      {selectedProduct && (
        <AdjustStockModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
          onStockAdjusted={handleStockAdjusted}
        />
      )}
    </div>
  )
}
