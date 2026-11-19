
import type { Metadata } from 'next'

import AuthForm from '@/components/AuthForm'
import { safeNextPath, DEFAULT_REDIRECT } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Log in',
  robots: { index: false },
}

const ERRORS: Record<string, string> = {
  callback: 'That confirmation link is invalid or has expired. Log in, or register again.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const { next, error } = await searchParams

  const safeNext = next ? safeNextPath(next) : undefined

  return (
    <AuthForm
      mode="login"
      next={safeNext && safeNext !== DEFAULT_REDIRECT ? safeNext : undefined}
      initialError={error ? ERRORS[error] : undefined}
    />
  )
}
