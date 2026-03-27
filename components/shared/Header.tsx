'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { CartDrawer } from '@/components/cart/CartDrawer'

export function Header() {
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuth()
  const { totalItems, openCart } = useCart()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    router.push('/')
  }

  const canAccessDashboard = user && (user.role === 'PRODUCCION' || user.role === 'SUPER_ADMIN')

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity duration-200">
            <img
              src="/images/logo/logo.png"
              alt="Pastelería Bella Logo"
              className="h-16 w-auto"
            />
            <div>
              <h1 className="text-3xl font-bold text-teal-600">Pastelería Bella</h1>
              <p className="text-stone-600 text-sm mt-1">Deliciosos pasteles y tortas artesanales</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-stone-700 hover:text-teal-600 transition-colors duration-200">
              Inicio
            </Link>
            <a href="#productos" className="text-stone-700 hover:text-teal-600 transition-colors duration-200">
              Productos
            </a>
            <a href="#valores" className="text-stone-700 hover:text-teal-600 transition-colors duration-200">
              Nosotros
            </a>
            <a href="#contacto" className="text-stone-700 hover:text-teal-600 transition-colors duration-200">
              Contacto
            </a>

            <button
              onClick={openCart}
              className="relative p-2 text-stone-700 hover:text-teal-600 transition-colors duration-200"
              aria-label="Ver carrito"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
            
            {/* Botón Usuario */}
            <div className="relative">
              {!isAuthenticated ? (
                <Link 
                  href="/login"
                  className="text-stone-700 hover:text-teal-600 transition-colors duration-200"
                >
                  Iniciar Sesión
                </Link>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-stone-700 hover:text-teal-600 transition-colors duration-200"
                  >
                    <span>{user?.email || 'Usuario'}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 z-20">
                        <div className="py-1">
                          {canAccessDashboard && (
                            <Link
                              href="/dashboard"
                              className="block px-4 py-2 text-sm text-stone-700 hover:bg-teal-50 transition-colors duration-200"
                              onClick={() => setShowUserMenu(false)}
                            >
                              Dashboard
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-teal-50 transition-colors duration-200"
                          >
                            Cerrar Sesión
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
      <CartDrawer />
    </header>
  )
}
