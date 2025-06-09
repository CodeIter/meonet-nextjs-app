// src/middleware.ts

import {
  type MiddlewareConfig,
  type GlobalMiddlewareConfig,
  type NemoConfig,
  type MiddlewareMetadata,
  createNEMO
} from '@rescale/nemo'

import loggerStartTimeMiddleware from '@/middlewares/loggerStartTimeMiddleware'
import loggerEndTimeMiddleware from '@/middlewares/loggerEndTimeMiddleware'
import headersMiddleware from '@/middlewares/headersMiddleware'

// Define route-based middleware configuration
const middlewareConfig: MiddlewareConfig = {
  '/': []
} satisfies MiddlewareConfig

// Global middleware (runs before/after all routes)
const globalMiddleware: GlobalMiddlewareConfig = {
  before: [
    loggerStartTimeMiddleware,
    headersMiddleware
  ],
  after: [
    loggerEndTimeMiddleware
  ]
} satisfies GlobalMiddlewareConfig

// nemo config options
const nemoConfig: NemoConfig = {
  debug: process.env.NODE_ENV !== 'production',
  silent: process.env.NODE_ENV === 'production',
  enableTiming: process.env.NODE_ENV !== 'production',
  errorHandler: (error: Error, metadata: MiddlewareMetadata) => {
    console.error(error, metadata)
  }
} satisfies NemoConfig

// Create the composed middleware
export default createNEMO(
  middlewareConfig,
  globalMiddleware,
  nemoConfig
)

// This is Next.js-specific middleware configuration.
export const config = {

  matcher: [

    // Match all routes
    "/:path*"

  ]

}

