/** @type {import('next').NextConfig} */
function normalizePublicApiUrl(raw) {
  if (raw == null || raw === '') return ''
  const cleaned = String(raw).trim().replace(/\r\n|\r|\n/g, '')
  return cleaned
}

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const fromEnv = normalizePublicApiUrl(process.env.NEXT_PUBLIC_API_URL)
    const apiUrl = fromEnv || 'http://localhost:3001/api'
    return [
      { source: '/api/:path*', destination: `${apiUrl}/:path*` },
    ]
  },
}

module.exports = nextConfig
