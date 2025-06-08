// src/middleware.ts

import type MiddlewareFactory from '@/types/MiddlewareFactory'
import stackMiddlewares from '@/lib/stackMiddlewares'

import initMiddleware from '@/middlewares/init-mw'
import errorHandlerMiddleware from '@/middlewares/error-handler'
import requestLoggerMiddleware from '@/middlewares/request-logger'
import httpHeaderMiddleware from '@/middlewares/http-header'
import rateLimitMiddleware from '@/middlewares/ratelimit'

const middlewares: MiddlewareFactory[] = [
  initMiddleware,
  errorHandlerMiddleware,
  requestLoggerMiddleware,
  httpHeaderMiddleware,
  rateLimitMiddleware
]

export default stackMiddlewares(middlewares)

// This is Next.js-specific middleware configuration.
export const config = {

  matcher: [

    // Match all routes
    "/:path*"

  ]

}

