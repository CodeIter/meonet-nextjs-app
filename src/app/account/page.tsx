
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { UserIcon } from 'lucide-react'

import ChangePasswordForm from '@/components/ChangePasswordForm'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Account',
  robots: { index: false },
}

export default async function AccountPage() {

  // The proxy already redirects guests; re-check where the data is rendered.
  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect('/login?next=/account')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/account')

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl space-y-8">

      <div className="card">

        <div className="flex items-center gap-3 mb-6">
          <UserIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Your account</h1>
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
          <dt className="font-medium text-gray-700">Email</dt>
          <dd className="text-gray-900 break-all">{user.email}</dd>

          <dt className="font-medium text-gray-700">Password</dt>
          <dd className="text-gray-900">
            <span aria-label="Hidden password" className="tracking-widest">••••••••</span>
            <p className="text-xs text-gray-500 mt-1">
              Passwords are stored encrypted and cannot be displayed. You can set a new one below.
            </p>
          </dd>

          {user.created_at && (
            <>
              <dt className="font-medium text-gray-700">Member since</dt>
              <dd className="text-gray-900">{formatDate(user.created_at)}</dd>
            </>
          )}
        </dl>

      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Change password</h2>
        <ChangePasswordForm />
      </div>

    </div>
  )
}
