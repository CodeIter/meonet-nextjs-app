'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  AUTH_UNAVAILABLE,
  getRequestOrigin,
  safeNextPath,
  type AuthFormState,
} from '@/lib/auth'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

export async function login(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const next = safeNextPath(formData.get('next'))

  if (!email || !password) {
    return { error: 'Email and password are required.', email }
  }

  const supabase = await createSupabaseServerClient()
  if (!supabase) return { error: AUTH_UNAVAILABLE, email }

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message, email }

  revalidatePath('/', 'layout')
  redirect(next) // throws; must stay outside try/catch
}

export async function register(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')
  const next = safeNextPath(formData.get('next'))

  if (!EMAIL_RE.test(email)) {
    return { error: 'Enter a valid email address.', email }
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`, email }
  }
  if (password !== confirm) {
    return { error: 'Passwords do not match.', email }
  }

  const supabase = await createSupabaseServerClient()
  if (!supabase) return { error: AUTH_UNAVAILABLE, email }

  const origin = getRequestOrigin(await headers())

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Where the confirmation email link sends the user (see /auth/callback).
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })

  if (error) return { error: error.message, email }

  // Email confirmation disabled in Supabase → a session exists, user is logged in.
  if (data.session) {
    revalidatePath('/', 'layout')
    redirect(next)
  }

  // Email confirmation enabled → no session until the link is clicked.
  return {
    message: 'Account created. Check your email and click the confirmation link to finish signing up.',
    email,
  }
}

export async function logout(): Promise<void> {
  const supabase = await createSupabaseServerClient()
  if (supabase) await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function changePassword(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` }
  }
  if (password !== confirm) {
    return { error: 'Passwords do not match.' }
  }

  const supabase = await createSupabaseServerClient()
  if (!supabase) return { error: AUTH_UNAVAILABLE }

  // Server actions are public endpoints: verify the session again here.
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/account')

  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }

  return { message: 'Password updated.' }
}
