import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error
      
      // Ensure session is established before redirect
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("Failed to establish session")
    } catch (error) {
      // Redirect to login with error
      return NextResponse.redirect(new URL("/auth/login?error=auth_failed", requestUrl.origin))
    }
  }
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}
