'use client'

import { useState } from 'react'
import { Product, adjustStock } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface AdjustStockModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
  onStockAdjusted: () => void
}

export function AdjustStockModal({
  isOpen,
  onClose,
  product,
  onStockAdjusted,
}: AdjustStockModalProps) {
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const quantityNum = parseInt(quantity, 10)
    if (isNaN(quantityNum) || quantityNum === 0) {
      setError('La cantidad debe ser un número diferente de 0')
      return
    }

    setSubmitting(true)

    try {
      await adjustStock({
        productId: product.id,
        quantity: quantityNum,
        reason: reason.trim() || undefined,
      })

      onStockAdjusted()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Error al ajustar stock. Por favor, intenta nuevamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const newStock = product.stock + (parseInt(quantity, 10) || 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors duration-200"
          aria-label="Cerrar"
        >
          <span className="text-2xl">×</span>
        </button>

        <h2 className="text-2xl font-bold text-teal-800 mb-4">
          Ajustar Stock: {product.name}
        </h2>

        <div className="mb-4 p-4 bg-teal-50 rounded-lg">
          <p className="text-sm text-stone-600 mb-1">Stock actual:</p>
          <p className="text-2xl font-bold text-teal-600">{product.stock} unidades</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label="Cantidad a ajustar"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Ej: +10 o -5"
            required
            disabled={submitting}
            error={error && error.includes('cantidad') ? error : undefined}
          />

          <div className="text-sm text-stone-600">
            <p>
              {quantity && !isNaN(parseInt(quantity, 10)) && (
                <>
                  Stock después del ajuste:{' '}
                  <span className={`font-bold ${newStock < 0 ? 'text-red-600' : 'text-teal-600'}`}>
                    {newStock} unidades
                  </span>
                </>
              )}
            </p>
            {newStock < 0 && (
              <p className="text-red-600 mt-1">⚠️ El stock no puede ser negativo</p>
            )}
          </div>

          <Input
            label="Razón del ajuste (opcional)"
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ej: Reposición de inventario"
            disabled={submitting}
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={submitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting || newStock < 0 || !quantity || parseInt(quantity, 10) === 0}
              className="flex-1"
            >
              {submitting ? 'Aplicando...' : 'Aplicar Ajuste'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
