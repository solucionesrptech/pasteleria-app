/** @type {import('next').NextConfig} */
function normalizePublicApiUrl(raw) {
  if (raw == null || raw === '') return ''
  const cleaned = String(raw).trim().replace(/\r\n|\r|\n/g, '').replace(/\/+$/, '')
  return cleaned
}

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const fromEnv = normalizePublicApiUrl(
      process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL,
    )
    if (process.env.VERCEL && !fromEnv) {
      console.warn(
        '[next.config] Sin BACKEND_API_URL ni NEXT_PUBLIC_API_URL: /api/* se reescribe a localhost y fallará en producción.',
      )
    }
    const apiUrl = fromEnv || 'http://localhost:3001/api'
    // beforeFiles: el proxy corre ANTES de resolver app/api/* (evita 404 en /api/auth/* en Vercel).
    return {
      beforeFiles: [
        { source: '/api/:path*', destination: `${apiUrl}/:path*` },
      ],
    }
  },
}

module.exports = nextConfig
