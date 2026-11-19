
import { BASE_URL, PROTO } from '@/lib/config'

export const DEFAULT_REDIRECT = '/protected'

export const AUTH_UNAVAILABLE =
  'Authentication is not configured. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.'

export type AuthFormState = {
  error?: string
  message?: string
  email?: string
}

// Only allow same-site relative paths, to prevent open redirects
// (e.g. /login?next=https://evil.com or ?next=//evil.com).
export function safeNextPath(next: unknown): string {
  if (typeof next !== 'string') return DEFAULT_REDIRECT
  if (!next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) {
    return DEFAULT_REDIRECT
  }
  return next
}

// Public origin of the current request. Built from headers because the
// standalone server is bound to HOST=0.0.0.0, which makes request.url unreliable.
export function getRequestOrigin(headers: Headers): string {
  const host = headers.get('x-forwarded-host') ?? headers.get('host')
  if (!host) return BASE_URL

  const forwardedProto = headers.get('x-forwarded-proto')?.split(',')[0]?.trim()
  const isLocal = /^(localhost|127\.|\[::1\])/.test(host)
  const proto = forwardedProto ?? (isLocal ? 'http' : PROTO)

  return `${proto}://${host}`
}
