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
 * Obtiene y valida la URL del backend API
 */
export function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  // En producción, la variable es obligatoria
  if (isProduction && !apiUrl) {
    throw new Error(
      'NEXT_PUBLIC_API_URL no está configurada. ' +
      'Esta variable es obligatoria en producción. ' +
      'Configúrala en las variables de entorno de tu plataforma de hosting.'
    )
  }

  // Si no está definida, usar fallback solo en desarrollo
  if (!apiUrl) {
    const fallback = 'http://localhost:3001/api'
    if (isDevelopment) {
      console.warn(
        `⚠️  NEXT_PUBLIC_API_URL no está configurada. ` +
        `Usando fallback: ${fallback}\n` +
        `Crea un archivo .env.local con: NEXT_PUBLIC_API_URL=${fallback}`
      )
      return fallback
    }
    throw new Error('NEXT_PUBLIC_API_URL no está configurada')
  }

  // Validar formato de URL
  if (!isValidUrl(apiUrl)) {
    throw new Error(
      `NEXT_PUBLIC_API_URL tiene un formato inválido: "${apiUrl}". ` +
      `Debe ser una URL válida que comience con http:// o https://`
    )
  }

  // En producción, requerir HTTPS
  if (isProduction && !apiUrl.startsWith('https://')) {
    console.warn(
      `⚠️  NEXT_PUBLIC_API_URL no usa HTTPS en producción: "${apiUrl}". ` +
      `Se recomienda usar HTTPS en producción por seguridad.`
    )
  }

  return apiUrl
}
