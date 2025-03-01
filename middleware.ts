import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // Public paths that don't require authentication
  if (request.nextUrl.pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    )

    // RBAC checks
    const isProductionManager = payload.role === 'PRODUCTION_MANAGER'
    const isOperator = payload.role === 'OPERATOR'

    // Routes only for Production Manager
    if (request.nextUrl.pathname.startsWith('/api/work-orders/create') && !isProductionManager) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Routes only for Operator
    if (request.nextUrl.pathname.startsWith('/api/work-orders/update-status') && !isOperator) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.next()
  } catch (error) {
    console.error(error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/api/work-orders/:path*',
    '/login'
  ],
}