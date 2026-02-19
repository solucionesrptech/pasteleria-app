'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, user, loading, logout } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login')
        return
      }

      // Verificar que el usuario tenga rol PRODUCCION o SUPER_ADMIN
      if (user && user.role !== 'PRODUCCION' && user.role !== 'SUPER_ADMIN') {
        router.push('/')
        return
      }
    }
  }, [isAuthenticated, user, loading, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-600">Cargando...</p>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (user.role !== 'PRODUCCION' && user.role !== 'SUPER_ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-teal-800 text-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
          <nav className="space-y-2">
            <Link
              href="/dashboard/inventario"
              className="block px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Inventario
            </Link>
            <Link
              href="/dashboard/productos"
              className="block px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Productos
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-teal-800">Panel de Control</h1>
            <div className="flex items-center gap-4">
              <span className="text-stone-600">{user.email}</span>
              <Button variant="outline" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
