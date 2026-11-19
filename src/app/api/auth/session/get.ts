
import { NextResponse } from 'next/server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

// Lightweight "is there a session?" check used by the navigation menu to
// decide whether to show the Login / Register buttons.
//
// This is a UI hint only: it reads the session cookie without re-validating
// it with Supabase (cheap, since it runs on every page navigation).
// Real access control lives in authProxy and in the protected pages.
export async function GET() {

  const supabase = await createSupabaseServerClient()

  let authenticated = false

  if (supabase) {
    try {
      const { data } = await supabase.auth.getSession()
      authenticated = data.session !== null
    } catch (err: unknown) {
      console.error(err)
    }
  }

  return NextResponse.json(
    { available: supabase !== null, authenticated },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
