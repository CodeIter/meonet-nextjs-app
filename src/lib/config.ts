
export const HOST: string = process.env.HOST
                     || process.env.HOSTNAME
                     || '0.0.0.0'
export const PORT: number = parseInt(process.env.PORT || '3000') || 3000

export const VERCEL_URL: string | undefined = process.env.VERCEL_URL

export const PROTO: string = VERCEL_URL
                             ? 'https'
                             : (process.env.PROTO || 'http')
//const PROTO: string = process.env.PROTO || 'http'

// Base URL for the application
export const BASE_URL: string = process.env.BASE_URL
  || (
    VERCEL_URL ? `${PROTO}://${VERCEL_URL}` : `${PROTO}://${HOST}:${PORT}`
  )

// Supabase configuration
// Supabase URL
export const PUBLIC_SUPABASE_URL: string | undefined =
  process.env.PUBLIC_SUPABASE_URL
// Supabase Anon Key
export const PUBLIC_SUPABASE_ANON_KEY: string | undefined =
  process.env.PUBLIC_SUPABASE_ANON_KEY

export const config = {

  HOST, PORT, PROTO,

  BASE_URL,

  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY

}

export default config

