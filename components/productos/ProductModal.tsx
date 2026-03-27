'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Product, fetchProduct } from '@/lib/api'
import { useCart } from '@/contexts/CartContext'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
  onProductUpdated?: () => void
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product: initialProduct,
}) => {
  const [mounted, setMounted] = useState(false)
  const [product, setProduct] = useState<Product>(initialProduct)
  const [quantity, setQuantity] = useState(0)
  const [loading, setLoading] = useState(false)
  const { addItem, openCart } = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen && initialProduct.id) {
      setLoading(true)
      fetchProduct(initialProduct.id)
        .then((updatedProduct) => {
          if (updatedProduct) {
            setProduct(updatedProduct)
          }
        })
        .catch(() => {
          setProduct(initialProduct)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [isOpen, initialProduct.id, initialProduct])

  useEffect(() => {
    if (!isOpen) {
      setQuantity(0)
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const canAdd = product.stock > 0 && quantity > 0

  const handleIncrease = () => {
    if (quantity < product.stock) setQuantity(quantity + 1)
  }

  const handleDecrease = () => {
    if (quantity > 0) setQuantity(quantity - 1)
  }

  const handleAgregarAlCarrito = () => {
    if (!canAdd) return
    addItem(product, quantity)
    onClose()
    openCart()
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
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors duration-200 z-10"
          aria-label="Cerrar"
        >
          <span className="text-2xl">×</span>
        </button>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-stone-600">Cargando información del producto...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-64 md:h-80 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 md:h-80 bg-teal-100 rounded-lg flex items-center justify-center">
                  <span className="text-stone-400 text-sm">Sin imagen</span>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-teal-800 mb-2">
                {product.name}
              </h2>
              {product.description && (
                <p className="text-stone-600 text-sm mb-4">
                  {product.description}
                </p>
              )}

              <div className="mb-4">
                <span className="text-3xl font-bold text-teal-600">
                  {formatPrice(product.priceCLP)}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-sm text-stone-600 mb-2">
                  Disponible en tienda:
                </p>
                {product.stock > 0 ? (
                  <Badge variant="success" className="text-base px-3 py-1">
                    {product.stock} unidades
                  </Badge>
                ) : (
                  <Badge variant="error" className="text-base px-3 py-1">
                    Agotado
                  </Badge>
                )}
              </div>

              <div className="mb-6">
                <p className="text-sm text-stone-600 mb-3">Cantidad:</p>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={quantity === 0}
                    className="w-10 h-10 rounded-full bg-stone-200 hover:bg-stone-300 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center font-bold text-lg"
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold text-teal-800 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 rounded-full bg-stone-200 hover:bg-stone-300 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center font-bold text-lg"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>

              {quantity > 0 && (
                <div className="mb-6 p-4 bg-teal-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-700 font-semibold">Subtotal:</span>
                    <span className="text-2xl font-bold text-teal-600">
                      {formatPrice(product.priceCLP * quantity)}
                    </span>
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                onClick={handleAgregarAlCarrito}
                disabled={!canAdd}
                className="w-full"
              >
                {product.stock === 0
                  ? 'Producto Agotado'
                  : quantity === 0
                    ? 'Selecciona una cantidad'
                    : 'Agregar al carrito'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
