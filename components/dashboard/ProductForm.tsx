'use client'

import { useState, useEffect } from 'react'
import { Product, createProduct, updateProduct, CreateProductData, UpdateProductData } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface ProductFormProps {
  product: Product | null
  isEditing: boolean
  onClose: () => void
  onSaved: () => void
}

export function ProductForm({ product, isEditing, onClose, onSaved }: ProductFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [priceCLP, setPriceCLP] = useState('')
  const [stock, setStock] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [active, setActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (product && isEditing) {
      setName(product.name)
      setDescription(product.description || '')
      setPriceCLP(product.priceCLP.toString())
      setStock(product.stock.toString())
      setImageUrl(product.imageUrl || '')
      setActive(product.active)
    } else {
      // Reset form for new product
      setName('')
      setDescription('')
      setPriceCLP('')
      setStock('')
      setImageUrl('')
      setActive(true)
    }
  }, [product, isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('El nombre es requerido')
      return
    }

    const priceNum = parseInt(priceCLP, 10)
    const stockNum = parseInt(stock, 10)

    if (isNaN(priceNum) || priceNum < 0) {
      setError('El precio debe ser un número válido mayor o igual a 0')
      return
    }

    if (isNaN(stockNum) || stockNum < 0) {
      setError('El stock debe ser un número válido mayor o igual a 0')
      return
    }

    setSubmitting(true)

    try {
      if (isEditing && product) {
        const updateData: UpdateProductData = {
          name: name.trim(),
          description: description.trim() || undefined,
          priceCLP: priceNum,
          stock: stockNum,
          imageUrl: imageUrl.trim() || undefined,
          active,
        }
        await updateProduct(product.id, updateData)
      } else {
        const createData: CreateProductData = {
          name: name.trim(),
          description: description.trim() || undefined,
          priceCLP: priceNum,
          stock: stockNum,
          imageUrl: imageUrl.trim() || undefined,
          active,
        }
        await createProduct(createData)
      }

      onSaved()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Error al guardar producto. Por favor, intenta nuevamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 z-10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors duration-200"
          aria-label="Cerrar"
        >
          <span className="text-2xl">×</span>
        </button>

        <h2 className="text-2xl font-bold text-teal-800 mb-6">
          {isEditing ? 'Editar Producto' : 'Crear Producto'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label="Nombre del producto"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Torta de Chocolate"
            required
            disabled={submitting}
          />

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del producto..."
              rows={3}
              disabled={submitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Precio (CLP)"
              type="number"
              value={priceCLP}
              onChange={(e) => setPriceCLP(e.target.value)}
              placeholder="15990"
              required
              disabled={submitting}
              min="0"
            />

            <Input
              label="Stock inicial"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="10"
              required
              disabled={submitting}
              min="0"
            />
          </div>

          <Input
            label="URL de imagen (opcional)"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            disabled={submitting}
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              disabled={submitting}
              className="mr-2"
            />
            <label htmlFor="active" className="text-sm text-stone-700">
              Producto activo
            </label>
          </div>

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
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
