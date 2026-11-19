
import { NextRequest, NextResponse } from 'next/server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getRequestOrigin, safeNextPath } from '@/lib/auth'

// Landing point of the email confirmation link: exchanges the one-time
// `code` for a session cookie, then redirects to `next`.
export async function GET(request: NextRequest) {

  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const next = safeNextPath(searchParams.get('next'))
  const origin = getRequestOrigin(request.headers)

  if (code) {
    const supabase = await createSupabaseServerClient()

    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(new URL(next, origin))
      }
    }
  }

  return NextResponse.redirect(new URL('/login?error=callback', origin))
}
