'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { createOrder, CreateOrderData } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Header } from '@/components/shared/Header'
import { PaymentSuccessModal } from '@/components/productos/PaymentSuccessModal'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalCLP, clearCart, openCart } = useCart()
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [fulfillmentType, setFulfillmentType] = useState<'DELIVERY' | 'PICKUP'>('PICKUP')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [zone, setZone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<{
    items: { productName: string; quantity: number; lineTotalCLP: number }[]
    totalCLP: number
  } | null>(null)

  useEffect(() => {
    if (items.length === 0 && !successData) {
      router.replace('/')
    }
  }, [items.length, successData, router])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (items.length === 0) return
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

    setSubmitting(true)
    try {
      const orderData: CreateOrderData = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        fulfillmentType,
        deliveryAddress: fulfillmentType === 'DELIVERY' ? deliveryAddress.trim() : undefined,
        zone: fulfillmentType === 'DELIVERY' && zone.trim() ? zone.trim() : undefined,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      }
      await createOrder(orderData)
      const summaryItems = items.map((i) => ({
        productName: i.product.name,
        quantity: i.quantity,
        lineTotalCLP: i.product.priceCLP * i.quantity,
      }))
      setSuccessData({ items: summaryItems, totalCLP })
      clearCart()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pedido. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseSuccess = () => {
    setSuccessData(null)
    router.push('/')
  }

  if (items.length === 0 && !successData) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Header />
        <p className="text-stone-600">Redirigiendo...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-teal-800 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-teal-800 mb-4">Datos de contacto</h2>
              <Input
                label="Nombre completo"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                required
                disabled={submitting}
              />
              <div className="mt-4">
                <Input
                  label="Email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Ej: juan@example.com"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="mt-4">
                <Input
                  label="Teléfono"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ej: +56912345678"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-teal-800 mb-4">Tipo de entrega</h2>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="fulfillmentType"
                    value="PICKUP"
                    checked={fulfillmentType === 'PICKUP'}
                    onChange={(e) => setFulfillmentType(e.target.value as 'DELIVERY' | 'PICKUP')}
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
                    onChange={(e) => setFulfillmentType(e.target.value as 'DELIVERY' | 'PICKUP')}
                    disabled={submitting}
                    className="mr-2"
                  />
                  <span className="text-stone-700">Delivery</span>
                </label>
              </div>
              {fulfillmentType === 'DELIVERY' && (
                <div className="mt-4 space-y-4">
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
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={submitting || items.length === 0}
              className="w-full"
            >
              {submitting ? 'Procesando...' : 'Confirmar pedido'}
            </Button>
          </form>

          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-lg font-semibold text-teal-800 mb-4">Resumen del pedido</h2>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-stone-700">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-teal-700">
                    {formatPrice(item.product.priceCLP * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-stone-200 flex justify-between items-center font-bold text-teal-800">
              <span>Total</span>
              <span>{formatPrice(totalCLP)}</span>
            </div>
            <button
              type="button"
              onClick={openCart}
              className="mt-4 text-sm text-teal-600 hover:text-teal-700"
            >
              Editar carrito
            </button>
          </div>
        </div>
      </main>

      {successData && (
        <PaymentSuccessModal
          items={successData.items}
          totalCLP={successData.totalCLP}
          onClose={handleCloseSuccess}
        />
      )}
    </div>
  )
}
