/**
 * Configuración y validación de variables de entorno
 */

// En Next.js, NODE_ENV puede no estar definido en desarrollo
// Consideramos desarrollo si no es explícitamente 'production'
const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = !isProduction

/**
 * Limpia NEXT_PUBLIC_API_URL: espacios, saltos de línea o pegados por error en .env / panel de hosting.
 */
function normalizePublicApiUrl(raw: string | undefined): string | undefined {
  if (raw == null || raw === '') return undefined
  const cleaned = raw.trim().replace(/\r\n|\r|\n/g, '').replace(/\/+$/, '')
  return cleaned === '' ? undefined : cleaned
}

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
 * En el navegador solo existe NEXT_PUBLIC_*; en Node se puede usar BACKEND_API_URL (no expuesta al cliente).
 */
export function getBackendApiUrl(): string {
  const isBrowser = typeof window !== 'undefined'
  const apiUrl = normalizePublicApiUrl(
    isBrowser
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL,
  )
  if (isProduction && !apiUrl) {
    throw new Error(
      isBrowser
        ? 'NEXT_PUBLIC_API_URL no está configurada. ' +
          'Es obligatoria en producción para llamadas al backend desde el navegador.'
        : 'BACKEND_API_URL o NEXT_PUBLIC_API_URL no está configurada. ' +
          'Al menos una es obligatoria en producción en el servidor.',
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
    throw new Error(
      isBrowser
        ? 'NEXT_PUBLIC_API_URL no está configurada'
        : 'BACKEND_API_URL o NEXT_PUBLIC_API_URL no está configurada',
    )
  }
  if (resolved && !isValidUrl(resolved)) {
    throw new Error(
      `La URL del backend tiene un formato inválido: "${resolved}". ` +
      `Debe comenzar con http:// o https://`,
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
