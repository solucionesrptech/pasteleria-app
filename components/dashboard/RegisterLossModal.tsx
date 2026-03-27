'use client'

import { useState } from 'react'
import { Product, registerLoss } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface RegisterLossModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
  onLossRegistered: () => void
}

export function RegisterLossModal({
  isOpen,
  onClose,
  product,
  onLossRegistered,
}: RegisterLossModalProps) {
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const quantityNum = parseInt(quantity, 10)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError('La cantidad debe ser mayor a 0')
      return
    }

    const reasonTrimmed = reason.trim()
    if (!reasonTrimmed) {
      setError('El motivo de la merma es obligatorio')
      return
    }

    if (product.stock < quantityNum) {
      setError(`Stock insuficiente. Disponible: ${product.stock}`)
      return
    }

    setSubmitting(true)

    try {
      await registerLoss({
        productId: product.id,
        quantity: quantityNum,
        reason: reasonTrimmed,
      })
      onLossRegistered()
      onClose()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Error al registrar la merma. Por favor, intenta nuevamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const quantityNum = parseInt(quantity, 10)
  const newStock = !isNaN(quantityNum) && quantityNum > 0 ? product.stock - quantityNum : product.stock

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
          Registrar merma: {product.name}
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
            label="Cantidad a dar de merma"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Ej: 2"
            required
            disabled={submitting}
          />

          {quantity && !isNaN(quantityNum) && quantityNum > 0 && (
            <p className="text-sm text-stone-600">
              Stock después:{' '}
              <span className={`font-bold ${newStock < 0 ? 'text-red-600' : 'text-teal-600'}`}>
                {newStock} unidades
              </span>
              {newStock < 0 && (
                <span className="block text-red-600 mt-1">No hay stock suficiente.</span>
              )}
            </p>
          )}

          <Input
            label="Motivo de la merma"
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ej: Producto vencido, dañado"
            required
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
              disabled={
                submitting ||
                !quantity ||
                isNaN(quantityNum) ||
                quantityNum <= 0 ||
                !reason.trim() ||
                (product.stock > 0 && quantityNum > product.stock)
              }
              className="flex-1"
            >
              {submitting ? 'Registrando...' : 'Registrar merma'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
