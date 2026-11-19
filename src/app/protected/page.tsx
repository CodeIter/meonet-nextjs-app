
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { LogOutIcon, ShieldCheckIcon } from 'lucide-react'

import { logout } from '@/app/actions/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Protected',
  robots: { index: false },
}

export default async function ProtectedPage() {

  // The proxy already redirects guests, but never rely on a single layer:
  // re-check here, at the point where the data is actually rendered.
  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect('/login?next=/protected')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/protected')

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">

      <div className="card">

        <div className="flex items-center gap-3 mb-6">
          <ShieldCheckIcon className="w-6 h-6 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Protected page</h1>
        </div>

        <p className="text-gray-600 mb-6">
          You can see this page because you are logged in.
        </p>

        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm mb-8">
          <dt className="font-medium text-gray-700">Email</dt>
          <dd className="text-gray-900 break-all">{user.email}</dd>

          <dt className="font-medium text-gray-700">User ID</dt>
          <dd className="text-gray-900 break-all font-mono">{user.id}</dd>

          {user.last_sign_in_at && (
            <>
              <dt className="font-medium text-gray-700">Last sign-in</dt>
              <dd className="text-gray-900">{formatDate(user.last_sign_in_at)}</dd>
            </>
          )}
        </dl>

        <form action={logout}>
          <button type="submit" className="btn-secondary flex items-center gap-2">
            <LogOutIcon className="w-4 h-4" />
            Log out
          </button>
        </form>

      </div>

    </div>
  )
}
