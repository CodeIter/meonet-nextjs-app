
export const HOST: string = process.env.HOST
                     || process.env.HOSTNAME
                     || '0.0.0.0'
export const PORT: number = parseInt(process.env.PORT || '3000') || 3000

export const VERCEL_URL: string | undefined = process.env.VERCEL_URL

export const PROTO: string = VERCEL_URL
                             ? 'https'
                             : (process.env.PROTO || 'http')
//const PROTO: string = process.env.PROTO || 'http'

export const BASE_URL: string = VERCEL_URL
                          ? `${PROTO}://${VERCEL_URL}`
                          : `${PROTO}://${HOST}:${PORT}`

// Rate limiting configuration
// Number of requests allowed in the window
export const RATE_LIMIT_MAX_REQUESTS: number =
             parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '50') || 50
// Time window in seconds
export const RATE_LIMIT_WINDOW_SIZE: number =
             parseInt(process.env.RATE_LIMIT_WINDOW_SIZE || '60') || 60

export const config = {

  RATE_LIMIT: {
    MAX_REQUESTS: RATE_LIMIT_MAX_REQUESTS,
    WINDOW_SIZE: RATE_LIMIT_WINDOW_SIZE,
  },

  // Base URL for the application (will be overridden in production)
  BASE_URL,

}

export default config
