
import type { Metadata } from 'next'

import AuthForm from '@/components/AuthForm'
import { safeNextPath, DEFAULT_REDIRECT } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Register',
  robots: { index: false },
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams

  const safeNext = next ? safeNextPath(next) : undefined

  return (
    <AuthForm
      mode="register"
      next={safeNext && safeNext !== DEFAULT_REDIRECT ? safeNext : undefined}
    />
  )
}
