
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
} from '@/lib/config'

// Cookie-based Supabase client for Server Components, Server Actions and
// Route Handlers. Returns null when Supabase is not configured.
export async function createSupabaseServerClient() {
  if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) return null

  const cookieStore = await cookies()

  return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Safe to ignore: authProxy refreshes the session on each request.
        }
      },
    },
  })
}

export default createSupabaseServerClient
