import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export async function POST(request: NextRequest) {
  console.log('NEXT API LOSS HIT')
  try {
    const body = await request.json()
    const auth = request.headers.get('authorization')
    const res = await fetch(`${BACKEND_URL}/inventory/loss`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(auth ? { Authorization: auth } : {}),
      },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { message: 'Error al conectar con el servidor. Comprueba que el backend esté en marcha.' },
      { status: 502 }
    )
  }
}
