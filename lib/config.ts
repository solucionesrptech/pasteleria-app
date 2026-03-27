/**
 * Configuración y validación de variables de entorno
 */

// En Next.js, NODE_ENV puede no estar definido en desarrollo
// Consideramos desarrollo si no es explícitamente 'production'
const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = !isProduction

/**
 * Valida que una URL tenga el formato correcto
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * URL base del backend Nest (ej. http://localhost:3001/api). Usar para llamadas directas al backend.
 */
export function getBackendApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (isProduction && !apiUrl) {
    throw new Error(
      'NEXT_PUBLIC_API_URL no está configurada. ' +
      'Esta variable es obligatoria en producción. ' +
      'Configúrala en las variables de entorno de tu plataforma de hosting.'
    )
  }
  const fallback = 'http://localhost:3001/api'
  const resolved = apiUrl || (isDevelopment ? fallback : '')
  if (isDevelopment && !apiUrl) {
    console.warn(
      `⚠️  NEXT_PUBLIC_API_URL no está configurada. Usando fallback: ${fallback}. ` +
      `Crea un archivo .env.local con: NEXT_PUBLIC_API_URL=${fallback}`
    )
  }
  if (isProduction && !resolved) {
    throw new Error('NEXT_PUBLIC_API_URL no está configurada')
  }
  if (resolved && !isValidUrl(resolved)) {
    throw new Error(
      `NEXT_PUBLIC_API_URL tiene un formato inválido: "${resolved}". ` +
      `Debe ser una URL válida que comience con http:// o https://`
    )
  }
  if (isProduction && resolved && !resolved.startsWith('https://')) {
    console.warn(
      `⚠️  NEXT_PUBLIC_API_URL no usa HTTPS en producción: "${resolved}". ` +
      `Se recomienda usar HTTPS en producción por seguridad.`
    )
  }
  return resolved || 'http://localhost:3001/api'
}

/**
 * Obtiene la URL base para llamadas API.
 * En el navegador usa la misma origen (/api) para que Next.js reenvíe al backend (rewrites).
 * En el servidor usa la URL del backend directamente.
 */
export function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin + '/api'
  }
  return getBackendApiUrl()
}
