'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading || !user) return
    if (user.role === 'DESPACHO') {
      router.replace('/dashboard/despacho')
    } else {
      router.replace('/dashboard/inventario')
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <p className="text-stone-600">Redirigiendo...</p>
    </div>
  )
}
