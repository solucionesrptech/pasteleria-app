'use client'

import { Button } from '@/components/ui/Button'
import { Product } from '@/lib/api'

interface PaymentSuccessModalProps {
  product: Product
  quantity: number
  total: number
  onClose: () => void
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  product,
  quantity,
  total,
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
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10">
        {/* Ícono de éxito */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">✓</span>
          </div>
        </div>

        {/* Mensaje de éxito */}
        <h2 className="text-2xl font-bold text-teal-800 text-center mb-6">
          ¡Pago realizado exitosamente!
        </h2>

        {/* Información del pedido */}
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-teal-50 rounded-lg">
            <p className="text-sm text-stone-600 mb-1">Producto:</p>
            <p className="font-semibold text-teal-800">{product.name}</p>
          </div>

          <div className="p-4 bg-teal-50 rounded-lg">
            <p className="text-sm text-stone-600 mb-1">Cantidad:</p>
            <p className="font-semibold text-teal-800">{quantity} unidad{quantity !== 1 ? 'es' : ''}</p>
          </div>

          <div className="p-4 bg-teal-50 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-sm text-stone-600">Total pagado:</p>
              <p className="text-2xl font-bold text-teal-600">
                {formatPrice(total)}
              </p>
            </div>
          </div>
        </div>

        {/* Nota */}
        <p className="text-sm text-stone-500 text-center mb-6">
          Recibirás un correo de confirmación con los detalles de tu pedido.
        </p>

        {/* Botón Cerrar */}
        <Button
          variant="primary"
          onClick={onClose}
          className="w-full"
        >
          Cerrar
        </Button>
      </div>
    </div>
  )
}
