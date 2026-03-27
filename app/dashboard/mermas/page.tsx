'use client'

import { useState, useEffect } from 'react'
import { getInventoryMovements, InventoryMovement } from '@/lib/api'

function registeredByLabel(movement: InventoryMovement): string {
  if (movement.user?.email) return movement.user.email
  if (movement.userId) return movement.userId
  return '—'
}

export default function MermasPage() {
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getInventoryMovements(undefined, 'LOSS')
      .then((data) => {
        if (!cancelled) setMovements(data.filter((m) => m.type === 'LOSS'))
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error al cargar mermas')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-teal-800 mb-6">Historial de mermas</h2>
        <p className="text-stone-600">Cargando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-teal-800 mb-6">Historial de mermas</h2>
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  if (movements.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-teal-800 mb-6">Historial de mermas</h2>
        <div className="p-8 bg-white rounded-lg border border-gray-200 text-center text-stone-600">
          No hay mermas registradas.
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-teal-800 mb-6">Historial de mermas</h2>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Motivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Registrado por
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {movements.map((row) => (
                <tr key={row.id}>
                  <td className="px-6 py-4 text-sm text-stone-600 whitespace-nowrap">
                    {new Date(row.createdAt).toLocaleDateString('es-CL', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-teal-800">{row.product.name}</td>
                  <td className="px-6 py-4 text-sm text-stone-600 text-right">{row.quantity}</td>
                  <td className="px-6 py-4 text-sm text-stone-600">{row.reason ?? '—'}</td>
                  <td className="px-6 py-4 text-sm text-stone-600">{registeredByLabel(row)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
