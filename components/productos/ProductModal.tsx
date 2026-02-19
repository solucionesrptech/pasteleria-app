'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Product, fetchProduct, createOrder, CreateOrderData } from '@/lib/api'
import { PaymentSuccessModal } from './PaymentSuccessModal'

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
  onProductUpdated
}) => {
  const [mounted, setMounted] = useState(false)
  const [product, setProduct] = useState<Product>(initialProduct)
  const [quantity, setQuantity] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Formulario de datos del cliente
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [fulfillmentType, setFulfillmentType] = useState<'DELIVERY' | 'PICKUP'>('PICKUP')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [zone, setZone] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Actualizar producto desde BD cuando se abre el modal
  useEffect(() => {
    if (isOpen && initialProduct.id) {
      setLoading(true)
      fetchProduct(initialProduct.id)
        .then((updatedProduct) => {
          if (updatedProduct) {
            setProduct(updatedProduct)
          }
        })
        .catch((error) => {
          console.error('Error al obtener producto actualizado:', error)
          // Si falla, usar el producto inicial
          setProduct(initialProduct)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [isOpen, initialProduct.id, initialProduct])

  // Resetear cantidad y estado de pago cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setQuantity(0)
      setShowPaymentSuccess(false)
      setError(null)
      setCustomerName('')
      setCustomerEmail('')
      setCustomerPhone('')
      setFulfillmentType('PICKUP')
      setDeliveryAddress('')
      setZone('')
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

  const totalPrice = product.priceCLP * quantity
  const canBuy = product.stock > 0 && quantity > 0

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleDecrease = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1)
    }
  }

  const handleComprar = async () => {
    // Validar formulario
    if (!customerName.trim()) {
      setError('El nombre es requerido')
      return
    }
    if (!customerEmail.trim()) {
      setError('El email es requerido')
      return
    }
    if (!customerPhone.trim()) {
      setError('El teléfono es requerido')
      return
    }
    if (fulfillmentType === 'DELIVERY' && !deliveryAddress.trim()) {
      setError('La dirección es requerida para delivery')
      return
    }

    setError(null)
    setSubmitting(true)

    try {
      const orderData: CreateOrderData = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        fulfillmentType,
        deliveryAddress: fulfillmentType === 'DELIVERY' ? deliveryAddress.trim() : undefined,
        zone: fulfillmentType === 'DELIVERY' && zone.trim() ? zone.trim() : undefined,
        items: [
          {
            productId: product.id,
            quantity,
          },
        ],
      }

      await createOrder(orderData)

      // Actualizar stock del producto después de compra exitosa
      const updatedProduct = await fetchProduct(product.id)
      if (updatedProduct) {
        setProduct(updatedProduct)
        // Notificar al componente padre para refrescar la lista
        if (onProductUpdated) {
          onProductUpdated()
        }
      }

      // Mostrar modal de pago exitoso
      setShowPaymentSuccess(true)
    } catch (error) {
      console.error('Error al crear orden:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Error al procesar la compra. Por favor, intenta nuevamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleClosePaymentSuccess = () => {
    setShowPaymentSuccess(false)
    onClose()
  }

  // Si se muestra el modal de pago exitoso, no mostrar el modal de compra
  if (showPaymentSuccess) {
    return (
      <PaymentSuccessModal
        product={product}
        quantity={quantity}
        total={totalPrice}
        onClose={handleClosePaymentSuccess}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
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
            {/* Imagen del Producto */}
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

            {/* Información del Producto */}
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

              {/* Stock Disponible */}
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

              {/* Selector de Cantidad */}
              <div className="mb-6">
                <p className="text-sm text-stone-600 mb-3">Cantidad:</p>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={quantity === 0 || submitting}
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
                    disabled={quantity >= product.stock || submitting}
                    className="w-10 h-10 rounded-full bg-stone-200 hover:bg-stone-300 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center font-bold text-lg"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              {quantity > 0 && (
                <div className="mb-6 p-4 bg-teal-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-700 font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-teal-600">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              )}

              {/* Formulario de Datos del Cliente */}
              {quantity > 0 && (
                <div className="mb-6 space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold text-teal-800 mb-4">Datos de contacto</h3>
                  
                  <Input
                    label="Nombre completo"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    required
                    disabled={submitting}
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Ej: juan@example.com"
                    required
                    disabled={submitting}
                  />

                  <Input
                    label="Teléfono"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ej: +56912345678"
                    required
                    disabled={submitting}
                  />

                  {/* Tipo de entrega */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Tipo de entrega
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="fulfillmentType"
                          value="PICKUP"
                          checked={fulfillmentType === 'PICKUP'}
                          onChange={(e) => setFulfillmentType(e.target.value as 'PICKUP' | 'DELIVERY')}
                          disabled={submitting}
                          className="mr-2"
                        />
                        <span className="text-stone-700">Retiro en tienda</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="fulfillmentType"
                          value="DELIVERY"
                          checked={fulfillmentType === 'DELIVERY'}
                          onChange={(e) => setFulfillmentType(e.target.value as 'PICKUP' | 'DELIVERY')}
                          disabled={submitting}
                          className="mr-2"
                        />
                        <span className="text-stone-700">Delivery</span>
                      </label>
                    </div>
                  </div>

                  {/* Campos de delivery */}
                  {fulfillmentType === 'DELIVERY' && (
                    <>
                      <Input
                        label="Dirección"
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Ej: Av. Providencia 123"
                        required
                        disabled={submitting}
                      />

                      <Input
                        label="Zona (opcional)"
                        type="text"
                        value={zone}
                        onChange={(e) => setZone(e.target.value)}
                        placeholder="Ej: Santiago Centro"
                        disabled={submitting}
                      />
                    </>
                  )}
                </div>
              )}

              {/* Mensaje de error */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Botón Comprar */}
              <Button
                variant="primary"
                onClick={handleComprar}
                disabled={!canBuy || submitting || (quantity > 0 && (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()))}
                className="w-full"
              >
                {submitting ? 'Procesando...' : product.stock === 0 ? 'Producto Agotado' : quantity === 0 ? 'Selecciona una cantidad' : 'Comprar'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
