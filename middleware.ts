import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proteger rutas del dashboard
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    // Si no hay token, redirigir a login
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verificar token (validación básica, la validación real se hace en el backend)
    // Por ahora solo verificamos que existe
    // En producción, podrías validar el JWT aquí también
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
