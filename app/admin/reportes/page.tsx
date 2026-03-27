'use client'

import { useState, useEffect } from 'react'
import { getSalesReport, SalesReportResponse, SalesReportRange } from '@/lib/api'

function formatCLP(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const RANGE_OPTIONS: { value: SalesReportRange; label: string }[] = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
]

const LABELS_BY_RANGE: Record<
  SalesReportRange,
  { sales: string; orders: string; units: string; empty: string; lossTitle: string; lossEmpty: string }
> = {
  daily: {
    sales: 'Ventas del día',
    orders: 'Pedidos pagados del día',
    units: 'Unidades vendidas del día',
    empty: 'No hay ventas registradas del día.',
    lossTitle: 'Mermas del día',
    lossEmpty: 'No hay mermas registradas del día.',
  },
  weekly: {
    sales: 'Ventas de la semana',
    orders: 'Pedidos pagados de la semana',
    units: 'Unidades vendidas de la semana',
    empty: 'No hay ventas registradas de la semana.',
    lossTitle: 'Mermas de la semana',
    lossEmpty: 'No hay mermas registradas de la semana.',
  },
  monthly: {
    sales: 'Ventas del mes',
    orders: 'Pedidos pagados del mes',
    units: 'Unidades vendidas del mes',
    empty: 'No hay ventas registradas del mes.',
    lossTitle: 'Mermas del mes',
    lossEmpty: 'No hay mermas registradas del mes.',
  },
}

function registeredByLabel(item: { userEmail?: string | null; userId?: string | null }): string {
  if (item.userEmail) return item.userEmail
  if (item.userId) return item.userId
  return '—'
}

export default function AdminReportesPage() {
  const [range, setRange] = useState<SalesReportRange>('monthly')
  const [data, setData] = useState<SalesReportResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadReport = (r: SalesReportRange) => {
    setLoading(true)
    setError(null)
    getSalesReport(r)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar el reporte'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadReport(range)
  }, [])

  const handleRangeChange = (newRange: SalesReportRange) => {
    setRange(newRange)
    loadReport(newRange)
  }

  if (loading && !data) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-teal-800 mb-6">Reporte de ventas</h2>
        <div className="flex gap-2 mb-6">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled
              className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-stone-500 text-sm font-medium"
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="text-stone-600">Cargando...</p>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-teal-800 mb-6">Reporte de ventas</h2>
        <div className="flex gap-2 mb-6">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled
              className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-stone-500 text-sm font-medium"
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  const summary = data?.summary ?? { totalSalesCLP: 0, paidOrdersCount: 0, unitsSold: 0 }
  const products = data?.products ?? []
  const isEmpty = summary.paidOrdersCount === 0
  const lossSummary = data?.lossSummary ?? { totalUnitsLost: 0, count: 0, estimatedCostCLP: 0 }
  const losses = data?.losses ?? []
  const isLossEmpty = lossSummary.count === 0
  const labels = LABELS_BY_RANGE[range]

  return (
    <div>
      <h2 className="text-xl font-semibold text-teal-800 mb-6">Reporte de ventas</h2>

      <div className="flex flex-wrap gap-2 mb-6">
        {RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleRangeChange(opt.value)}
            disabled={loading}
            className={`px-4 py-2 rounded-lg border text-sm font-medium ${
              range === opt.value
                ? 'border-teal-600 bg-teal-50 text-teal-800'
                : 'border-gray-200 bg-white text-stone-700 hover:bg-stone-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-stone-500">{labels.sales}</h3>
          <p className="mt-1 text-2xl font-semibold text-teal-800">{formatCLP(summary.totalSalesCLP)}</p>
        </div>
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-stone-500">{labels.orders}</h3>
          <p className="mt-1 text-2xl font-semibold text-teal-800">{summary.paidOrdersCount}</p>
        </div>
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-stone-500">{labels.units}</h3>
          <p className="mt-1 text-2xl font-semibold text-teal-800">{summary.unitsSold}</p>
        </div>
      </div>

      {isEmpty ? (
        <div className="p-8 bg-white rounded-lg border border-gray-200 text-center text-stone-600">
          {labels.empty}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <h3 className="px-6 py-4 text-sm font-medium text-teal-800 border-b border-gray-200">
            Detalle por producto
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Cantidad vendida
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Total vendido
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((row) => (
                  <tr key={row.productId}>
                    <td className="px-6 py-4 text-sm text-teal-800">{row.productName}</td>
                    <td className="px-6 py-4 text-sm text-stone-600 text-right">{row.quantitySold}</td>
                    <td className="px-6 py-4 text-sm text-stone-600 text-right">{formatCLP(row.totalSalesCLP)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-10">
        <h3 className="text-lg font-semibold text-teal-800 mb-4">{labels.lossTitle}</h3>
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-sm font-medium text-stone-500">Unidades perdidas</h4>
            <p className="mt-1 text-2xl font-semibold text-teal-800">{lossSummary.totalUnitsLost}</p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-sm font-medium text-stone-500">Registros de merma</h4>
            <p className="mt-1 text-2xl font-semibold text-teal-800">{lossSummary.count}</p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-sm font-medium text-stone-500">Costo estimado merma</h4>
            <p className="mt-1 text-2xl font-semibold text-teal-800">{formatCLP(lossSummary.estimatedCostCLP)}</p>
          </div>
        </div>
        {isLossEmpty ? (
          <div className="p-8 bg-white rounded-lg border border-gray-200 text-center text-stone-600">
            {labels.lossEmpty}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <h4 className="px-6 py-4 text-sm font-medium text-teal-800 border-b border-gray-200">
              Detalle de mermas
            </h4>
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Costo est.
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {losses.map((row, idx) => (
                    <tr key={`${row.productId}-${row.createdAt}-${idx}`}>
                      <td className="px-6 py-4 text-sm text-stone-600 whitespace-nowrap">
                        {new Date(row.createdAt).toLocaleDateString('es-CL', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-teal-800">{row.productName}</td>
                      <td className="px-6 py-4 text-sm text-stone-600 text-right">{row.quantity}</td>
                      <td className="px-6 py-4 text-sm text-stone-600">{row.reason ?? '—'}</td>
                      <td className="px-6 py-4 text-sm text-stone-600">{registeredByLabel(row)}</td>
                      <td className="px-6 py-4 text-sm text-stone-600 text-right">{formatCLP(row.estimatedCostCLP)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
