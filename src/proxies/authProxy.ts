
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'

import type { ProxyFn } from '@/types/proxy'

import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
} from '@/lib/config'
import { DEFAULT_REDIRECT, getRequestOrigin } from '@/lib/auth'

// Only visible to logged-in users → redirect to /login otherwise
const PROTECTED_PATHS = ['/protected']
// Only visible to guests → redirect to /protected if already logged in
const GUEST_ONLY_PATHS = ['/login', '/register']

const matches = (pathname: string, paths: string[]) =>
  paths.some(p => pathname === p || pathname.startsWith(`${p}/`))

type PendingCookie = {
  name: string
  value: string
  options?: CookieOptions
}

export const authProxy: ProxyFn = async (request: NextRequest, _response: NextResponse, _storage) => {
  const { pathname, search } = request.nextUrl

  const isProtected = matches(pathname, PROTECTED_PATHS)
  const isGuestOnly = matches(pathname, GUEST_ONLY_PATHS)

  // Don't hit Supabase for routes that don't care about auth.
  if (!isProtected && !isGuestOnly) return

  const origin = getRequestOrigin(request.headers)

  const redirectToLogin = () => {
    const url = new URL('/login', origin)
    url.searchParams.set('next', pathname + search)
    return NextResponse.redirect(url)
  }

  if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
    // Fail closed: never expose protected pages when auth is not configured.
    return isProtected ? redirectToLogin() : undefined
  }

  // Cookies Supabase wants to set (e.g. a refreshed session).
  const pending: PendingCookie[] = []
  let pendingHeaders: Record<string, string> = {}

  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          // Make the refreshed session visible to the page rendered in this same request
          request.cookies.set(name, value)
          pending.push({ name, value, options })
        })
        pendingHeaders = { ...pendingHeaders, ...(headers ?? {}) }
      },
    },
  })

  // getUser() validates the JWT with Supabase (unlike getSession(), which trusts the cookie).
  const { data: { user } } = await supabase.auth.getUser()

  const withSessionCookies = (res: NextResponse) => {
    pending.forEach(({ name, value, options }) => res.cookies.set(name, value, options))
    Object.entries(pendingHeaders).forEach(([k, v]) => res.headers.set(k, v))
    return res
  }

  if (isProtected && !user) {
    return withSessionCookies(redirectToLogin())
  }

  if (isGuestOnly && user) {
    return withSessionCookies(NextResponse.redirect(new URL(DEFAULT_REDIRECT, origin)))
  }

  // Pass through. If the session was refreshed, forward the new cookies both
  // to the page (via the request) and to the browser (via the response).
  if (pending.length > 0) {
    return withSessionCookies(NextResponse.next({ request }))
  }
}

export default authProxy
