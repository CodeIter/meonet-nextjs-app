
import {
  type MiddlewareConfig,
  type GlobalMiddlewareConfig,
  type NemoConfig,
  type MiddlewareMetadata,
  createNEMO
} from '@rescale/nemo'

import loggerStartTimeProxy from '@/proxies/loggerStartTimeProxy'
import loggerEndTimeProxy from '@/proxies/loggerEndTimeProxy'
import headersProxy from '@/proxies/headersProxy'

// Define route-based middleware configuration
const middlewareConfig: MiddlewareConfig = {
  '/': []
} satisfies MiddlewareConfig

// Global middleware (runs before/after all routes)
const globalMiddleware: GlobalMiddlewareConfig = {
  before: [
    loggerStartTimeProxy,
    headersProxy
  ],
  after: [
    loggerEndTimeProxy
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

// Create the composed proxy
export default createNEMO(
  middlewareConfig,
  globalMiddleware,
  nemoConfig
)

// This is Next.js-specific proxy configuration.
export const config = {

  matcher: [

    // Match all routes
    "/:path*"

  ]

}

