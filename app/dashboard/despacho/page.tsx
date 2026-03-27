'use client'

import { useState, useEffect, useMemo } from 'react'
import { fetchInternalOrders, updateOrderStatus, InternalOrder } from '@/lib/api'
import { Button } from '@/components/ui/Button'

export type DespachoColumn = 'preparing' | 'ready' | 'done'

function getDespachoColumn(order: InternalOrder): DespachoColumn {
  switch (order.status) {
    case 'EN_PREPARACION':
      return 'preparing'
    case 'LISTO':
      return 'ready'
    case 'ENTREGADO':
    case 'RETIRADO':
    case 'CANCELADO':
    default:
      return 'done'
  }
}

function getOperationalBadgeLabel(status: string): string {
  switch (status) {
    case 'EN_PREPARACION':
      return 'EN PREPARACIÓN'
    case 'LISTO':
      return 'LISTO'
    case 'ENTREGADO':
      return 'ENTREGADO'
    case 'RETIRADO':
      return 'RETIRADO'
    case 'CANCELADO':
      return 'CANCELADO'
    default:
      return status
  }
}

function getOperationalBadgeClass(status: string): string {
  switch (status) {
    case 'EN_PREPARACION':
      return 'bg-teal-100 text-teal-800'
    case 'LISTO':
      return 'bg-amber-100 text-amber-800'
    case 'ENTREGADO':
    case 'RETIRADO':
      return 'bg-green-100 text-green-800'
    case 'CANCELADO':
      return 'bg-stone-200 text-stone-700'
    default:
      return 'bg-stone-100 text-stone-800'
  }
}

const FULFILLMENT_LABELS: Record<string, string> = {
  DELIVERY: 'Delivery',
  PICKUP: 'Retiro en tienda',
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(price)
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleString('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

function OrderCard({
  order,
  onMarkDelivered,
  onMarkReady,
  updatingId,
}: {
  order: InternalOrder
  onMarkDelivered: (order: InternalOrder) => void
  onMarkReady?: (order: InternalOrder) => void
  updatingId: string | null
}) {
  const orderNumber = order.id.slice(-8).toUpperCase()
  const badgeLabel = getOperationalBadgeLabel(order.status)
  const badgeClass = getOperationalBadgeClass(order.status)
  const isReady = order.status === 'LISTO'
  const isDelivery = order.fulfillmentType === 'DELIVERY'
  const canMarkReady = onMarkReady && order.status === 'EN_PREPARACION'

  const handleMarkDeliveredClick = () => {
    const message = isDelivery
      ? '¿Confirmar entrega del pedido?'
      : '¿Confirmar retiro del pedido?'
    if (window.confirm(message)) {
      onMarkDelivered(order)
    }
  }

  const handleMarkReadyClick = () => {
    if (window.confirm('¿Confirmar que el pedido está listo?')) {
      onMarkReady?.(order)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow border border-stone-200 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-bold text-teal-800">
          Pedido #{orderNumber}
        </h3>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${badgeClass}`}>
          {badgeLabel}
        </span>
      </div>

      <div className="mt-2 space-y-1 text-sm text-stone-600">
        <p className="font-medium text-stone-800">{order.customerName}</p>
        <p>
          {FULFILLMENT_LABELS[order.fulfillmentType] ?? order.fulfillmentType}
          {order.fulfillmentType === 'DELIVERY' && order.deliveryAddress && (
            <span className="block text-stone-500 mt-0.5">{order.deliveryAddress}</span>
          )}
        </p>
        <p className="text-stone-500 text-xs">{formatDate(order.createdAt)}</p>
      </div>

      <div className="mt-3 pt-3 border-t border-stone-100">
        <ul className="space-y-0.5 text-sm text-stone-600">
          {order.items.map((item) => (
            <li key={item.id}>
              {item.productName} × {item.quantity} — {formatPrice(item.lineTotalCLP)}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm font-semibold text-teal-800">
          Total: {formatPrice(order.totalCLP)}
        </p>
      </div>

      {isReady && (
        <div className="mt-3 pt-3 border-t border-stone-100">
          <Button
            variant="primary"
            onClick={handleMarkDeliveredClick}
            disabled={updatingId === order.id}
            className="w-full"
          >
            {updatingId === order.id
              ? 'Actualizando...'
              : isDelivery
                ? 'Marcar entregado'
                : 'Marcar retirado'}
          </Button>
        </div>
      )}

      {canMarkReady && (
        <div className="mt-3 pt-3 border-t border-stone-100">
          <Button
            variant="outline"
            onClick={handleMarkReadyClick}
            disabled={updatingId === order.id}
            className="w-full"
          >
            {updatingId === order.id ? 'Actualizando...' : 'Marcar como listo'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default function DespachoPage() {
  const [orders, setOrders] = useState<InternalOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const { ordersPreparing, ordersReady, ordersDone } = useMemo(() => {
    const preparing: InternalOrder[] = []
    const ready: InternalOrder[] = []
    const done: InternalOrder[] = []
    for (const order of orders) {
      const col = getDespachoColumn(order)
      if (col === 'preparing') preparing.push(order)
      else if (col === 'ready') ready.push(order)
      else done.push(order)
    }
    return { ordersPreparing: preparing, ordersReady: ready, ordersDone: done }
  }, [orders])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchInternalOrders()
      setOrders(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar pedidos')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleMarkDelivered = async (order: InternalOrder) => {
    if (order.status !== 'LISTO') {
      console.warn('[Despacho] handleMarkDelivered rechazado: pedido no está LISTO', {
        orderId: order.id,
        orderStatus: order.status,
        fulfillmentType: order.fulfillmentType,
        nextStatus: order.fulfillmentType === 'DELIVERY' ? 'ENTREGADO' : 'RETIRADO',
      })
      setError('Solo se puede marcar entrega cuando el pedido está en estado LISTO.')
      return
    }
    const nextStatus = order.fulfillmentType === 'DELIVERY' ? 'ENTREGADO' : 'RETIRADO'
    console.log('[Despacho] Marcar entrega/retiro', {
      orderId: order.id,
      orderStatus: order.status,
      fulfillmentType: order.fulfillmentType,
      nextStatus,
    })
    try {
      setUpdatingId(order.id)
      await updateOrderStatus(order.id, nextStatus)
      await loadOrders()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar estado')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleMarkReady = async (order: InternalOrder) => {
    const nextStatus = 'LISTO'
    console.log('[Despacho] Marcar como listo', {
      orderId: order.id,
      orderStatus: order.status,
      fulfillmentType: order.fulfillmentType,
      nextStatus,
    })
    try {
      setUpdatingId(order.id)
      await updateOrderStatus(order.id, nextStatus)
      await loadOrders()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar estado')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-stone-600">Cargando pedidos...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-teal-800 mb-6">Panel de Despacho</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {orders.length === 0 && !error ? (
        <p className="text-stone-600">No hay pedidos en el flujo interno.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-stone-50 rounded-lg border border-stone-200 p-4 min-h-[200px]">
            <h2 className="text-lg font-semibold text-teal-800 mb-3">
              En preparación ({ordersPreparing.length})
            </h2>
            <div className="space-y-3">
              {ordersPreparing.length === 0 ? (
                <p className="text-stone-500 text-sm py-4">Ninguno</p>
              ) : (
                ordersPreparing.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onMarkDelivered={() => {}}
                    onMarkReady={handleMarkReady}
                    updatingId={updatingId}
                  />
                ))
              )}
            </div>
          </div>

          <div className="bg-stone-50 rounded-lg border border-stone-200 p-4 min-h-[200px]">
            <h2 className="text-lg font-semibold text-teal-800 mb-3">
              Listos ({ordersReady.length})
            </h2>
            <div className="space-y-3">
              {ordersReady.length === 0 ? (
                <p className="text-stone-500 text-sm py-4">Ninguno</p>
              ) : (
                ordersReady.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onMarkDelivered={handleMarkDelivered}
                    onMarkReady={undefined}
                    updatingId={updatingId}
                  />
                ))
              )}
            </div>
          </div>

          <div className="bg-stone-50 rounded-lg border border-stone-200 p-4 min-h-[200px]">
            <h2 className="text-lg font-semibold text-teal-800 mb-3">
              Finalizados ({ordersDone.length})
            </h2>
            <div className="space-y-3">
              {ordersDone.length === 0 ? (
                <p className="text-stone-500 text-sm py-4">Ninguno</p>
              ) : (
                ordersDone.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onMarkDelivered={() => {}}
                    onMarkReady={undefined}
                    updatingId={updatingId}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
