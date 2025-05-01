import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Refresh session if expired - this will update the session cookie if needed
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error

    // Public paths that don't require authentication
    const isPublicPath = 
      req.nextUrl.pathname.startsWith('/auth') ||
      req.nextUrl.pathname === '/favicon.ico'

    // Handle auth state
    if (!session && !isPublicPath) {
      // Store the current URL to redirect back after login
      const redirectUrl = new URL('/auth/login', req.url)
      if (req.nextUrl.pathname !== '/') {
        redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
      }
      return NextResponse.redirect(redirectUrl)
    }

    // Prevent authenticated users from accessing auth pages
    if (session && req.nextUrl.pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return res
  } catch (error) {
    console.error('Auth middleware error:', error)
    // On critical errors, redirect to login
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }
}

// Specify routes that should be protected
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
