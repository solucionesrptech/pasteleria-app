'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/Button'

export function CartDrawer() {
  const {
    items,
    totalCLP,
    totalItems,
    closeCart,
    updateQuantity,
    removeItem,
    isCartOpen,
    showAddedFeedback,
    clearAddedFeedback,
  } = useCart()

  useEffect(() => {
    if (!showAddedFeedback) return
    const t = setTimeout(() => clearAddedFeedback(), 2500)
    return () => clearTimeout(t)
  }, [showAddedFeedback, clearAddedFeedback])

  if (!isCartOpen) return null

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={closeCart}
        aria-hidden="true"
      />
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h2 className="text-xl font-bold text-teal-800">Carrito ({totalItems})</h2>
          <button
            onClick={closeCart}
            className="text-stone-400 hover:text-stone-600 transition-colors duration-200 p-1"
            aria-label="Cerrar carrito"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        {showAddedFeedback && (
          <div className="px-4 py-2 bg-teal-50 border-b border-teal-100">
            <p className="text-sm text-teal-800">Producto agregado al carrito</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-stone-600 text-center py-8">Tu carrito está vacío</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const lineTotal = item.product.priceCLP * item.quantity
                return (
                  <li
                    key={item.product.id}
                    className="flex gap-4 pb-4 border-b border-stone-100 last:border-0"
                  >
                    <div className="w-16 h-16 shrink-0 bg-stone-100 rounded-lg overflow-hidden">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-teal-800 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-stone-600">
                        {formatPrice(item.product.priceCLP)} × {item.quantity}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-sm font-bold"
                          aria-label="Disminuir"
                        >
                          −
                        </button>
                        <span className="text-stone-700 font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock}
                          className="w-7 h-7 rounded-full bg-stone-200 hover:bg-stone-300 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold"
                          aria-label="Aumentar"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="ml-2 text-sm text-red-600 hover:text-red-700"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-teal-700">
                        {formatPrice(lineTotal)}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-stone-200 p-4 space-y-3">
            <div className="flex justify-between items-center text-lg font-bold text-teal-800">
              <span>Total</span>
              <span>{formatPrice(totalCLP)}</span>
            </div>
            <Link href="/checkout" onClick={closeCart} className="block">
              <Button variant="primary" className="w-full">
                Ir al checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
