'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir automáticamente a la página de inventario
    router.replace('/dashboard/inventario')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <p className="text-stone-600">Redirigiendo...</p>
    </div>
  )
}
