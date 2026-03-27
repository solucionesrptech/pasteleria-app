'use client'

import Link from 'next/link'

export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-teal-800 mb-6">Panel Administrativo</h2>
      <p className="text-stone-600 mb-8">
        Gestiona productos, pedidos, reportes y mermas desde los accesos del menú.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/productos"
          className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-teal-500 hover:shadow transition-colors duration-200"
        >
          <h3 className="font-medium text-teal-800">Productos</h3>
          <p className="text-sm text-stone-600 mt-1">Administrar catálogo de productos</p>
        </Link>
        <Link
          href="/admin/pedidos"
          className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-teal-500 hover:shadow transition-colors duration-200"
        >
          <h3 className="font-medium text-teal-800">Pedidos</h3>
          <p className="text-sm text-stone-600 mt-1">Ver y gestionar pedidos</p>
        </Link>
        <Link
          href="/admin/reportes"
          className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-teal-500 hover:shadow transition-colors duration-200"
        >
          <h3 className="font-medium text-teal-800">Reportes</h3>
          <p className="text-sm text-stone-600 mt-1">Tickets y ventas</p>
        </Link>
        <Link
          href="/admin/mermas"
          className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-teal-500 hover:shadow transition-colors duration-200"
        >
          <h3 className="font-medium text-teal-800">Merma</h3>
          <p className="text-sm text-stone-600 mt-1">Historial de pérdidas de inventario</p>
        </Link>
      </div>
    </div>
  )
}
