
'use client'

import { useActionState } from 'react'
import Link from 'next/link'

import { LogInIcon, UserPlusIcon, Loader2Icon } from 'lucide-react'

import { login, register } from '@/app/actions/auth'
import type { AuthFormState } from '@/lib/auth'

type Props = {
  mode: 'login' | 'register'
  next?: string
  initialError?: string
}

const initialState: AuthFormState = {}

export default function AuthForm({ mode, next, initialError }: Props) {

  const isLogin = mode === 'login'

  const [state, formAction, pending] = useActionState(
    isLogin ? login : register,
    initialState
  )

  const error = state.error ?? initialError
  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : ''

  const Icon = isLogin ? LogInIcon : UserPlusIcon

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">

      <div className="card">

        <div className="flex items-center gap-3 mb-6">
          <Icon className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Log in' : 'Create your account'}
          </h1>
        </div>

        <form action={formAction} className="space-y-4" noValidate>

          {next && <input type="hidden" name="next" value={next} />}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              defaultValue={state.email}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              minLength={isLogin ? undefined : 8}
              required
              className="input-field"
            />
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-1">At least 8 characters.</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                required
                className="input-field"
              />
            </div>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
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
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending && <Loader2Icon className="w-4 h-4 animate-spin" />}
            {isLogin ? 'Log in' : 'Create account'}
          </button>

        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          {isLogin ? (
            <>
              No account yet?{' '}
              <Link href={`/register${nextQuery}`} className="text-blue-600 hover:underline">
                Create one
              </Link>
            </>
          ) : (
            <>
              Already registered?{' '}
              <Link href={`/login${nextQuery}`} className="text-blue-600 hover:underline">
                Log in
              </Link>
            </>
          )}
        </p>

      </div>

    </div>
  )
}
