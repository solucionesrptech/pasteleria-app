'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'

export default function AdminLayout({
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
      if (user && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMINISTRADOR') {
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

  if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMINISTRADOR') {
    return null
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <aside className="fixed left-0 top-0 h-full w-64 bg-teal-800 text-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8">Admin</h2>
          <nav className="space-y-2">
            <Link
              href="/admin/dashboard"
              className="block px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Inicio
            </Link>
            <Link
              href="/admin/productos"
              className="block px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Productos
            </Link>
            <Link
              href="/admin/pedidos"
              className="block px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Pedidos
            </Link>
            <Link
              href="/admin/reportes"
              className="block px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Reportes
            </Link>
            <Link
              href="/admin/mermas"
              className="block px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Merma
            </Link>
          </nav>
        </div>
      </aside>

      <div className="ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-teal-800">Panel Administrativo</h1>
            <div className="flex items-center gap-4">
              <span className="text-stone-600">{user.email}</span>
              <Button variant="outline" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
