'use client'

import { Button } from '@/components/ui/Button'

export interface PaymentSuccessItem {
  productName: string
  quantity: number
  lineTotalCLP: number
}

interface PaymentSuccessModalProps {
  items: PaymentSuccessItem[]
  totalCLP: number
  onClose: () => void
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  items,
  totalCLP,
  onClose,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">✓</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-teal-800 text-center mb-6">
          ¡Pedido realizado exitosamente!
        </h2>

        <div className="space-y-3 mb-6">
          {items.map((item, index) => (
            <div key={index} className="p-4 bg-teal-50 rounded-lg">
              <p className="font-semibold text-teal-800">{item.productName}</p>
              <p className="text-sm text-stone-600">
                {item.quantity} unidad{item.quantity !== 1 ? 'es' : ''} · {formatPrice(item.lineTotalCLP)}
              </p>
            </div>
          ))}
          <div className="p-4 bg-teal-50 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-sm text-stone-600">Total pagado:</p>
              <p className="text-2xl font-bold text-teal-600">
                {formatPrice(totalCLP)}
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-stone-500 text-center mb-6">
          Recibirás un correo de confirmación con los detalles de tu pedido.
        </p>

        <Button variant="primary" onClick={onClose} className="w-full">
          Cerrar
        </Button>
      </div>
    </div>
  )
}
