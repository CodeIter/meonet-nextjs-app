
'use client'

import { useActionState } from 'react'

import { Loader2Icon } from 'lucide-react'

import { changePassword } from '@/app/actions/auth'
import type { AuthFormState } from '@/lib/auth'

const initialState: AuthFormState = {}

export default function ChangePasswordForm() {

  const [state, formAction, pending] = useActionState(changePassword, initialState)

  return (
    <form action={formAction} className="space-y-4" noValidate>

      <div>
        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
          New password
        </label>
        <input
          id="new-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="input-field"
        />
        <p className="text-xs text-gray-500 mt-1">At least 8 characters.</p>
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm new password
        </label>
        <input
          id="confirm-password"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          className="input-field"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      {state.message && (
        <p role="status" className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending && <Loader2Icon className="w-4 h-4 animate-spin" />}
        Change password
      </button>

    </form>
  )
}
