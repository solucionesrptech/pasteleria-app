'use client'

import { Product } from '@/lib/api'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface InventoryTableProps {
  products: Product[]
  onAdjustStock: (product: Product) => void
  onRegisterLoss?: (product: Product) => void
}

export function InventoryTable({ products, onAdjustStock, onRegisterLoss }: InventoryTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600">No hay productos disponibles.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-teal-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
              Producto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
              Stock Actual
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
              Precio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-stone-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-stone-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-teal-800">{product.name}</div>
                  {product.description && (
                    <div className="text-sm text-stone-500 line-clamp-1">{product.description}</div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-lg font-semibold text-teal-600">{product.stock}</span>
                <span className="text-sm text-stone-500 ml-1">unidades</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-stone-700">
                  ${product.priceCLP.toLocaleString('es-CL')}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {product.stock > 5 ? (
                  <Badge variant="success">Disponible</Badge>
                ) : product.stock > 0 ? (
                  <Badge variant="warning">Stock Bajo</Badge>
                ) : (
                  <Badge variant="error">Agotado</Badge>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => onAdjustStock(product)}
                    className="text-sm"
                  >
                    Ajustar Stock
                  </Button>
                  {onRegisterLoss && (
                    <Button
                      variant="outline"
                      onClick={() => onRegisterLoss(product)}
                      className="text-sm"
                    >
                      Registrar merma
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
