// src/middleware.ts

import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import rateLimitMiddleware from '@/middlewares/ratelimit'
import httpHeaderMiddleware from '@/middlewares/http-header'

const middlewares = [
  httpHeaderMiddleware,
  rateLimitMiddleware
]

// Helper function to check if path matches any pattern
function matchesPath(pathname: string, patterns: (string | RegExp)[]): boolean {
  return patterns.some(pattern => {
    if (typeof pattern === 'string') {
      // Simple string path matching
      return pathname === pattern || pathname.startsWith(pattern + '/')
    } else if (pattern instanceof RegExp) {
      // Regex pattern matching
      return pattern.test(pathname)
    }
    return false
  })
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  for (const middleware of middlewares) {
    if (typeof middleware?.handler !== 'function') {
      throw new TypeError(
        `middleware.handler must be a function, got ${typeof middleware?.handler}`
      )
    }
    // Check if middleware should run for this path
    if (middleware.matcher && middleware.matcher.length > 0) {
      const shouldRun = matchesPath(pathname, middleware.matcher)
      if (!shouldRun) continue
    }
    const response = await middleware.handler(request)
    if (response && response !== NextResponse.next()) {
      return response
    }
  }
  return NextResponse.next()
}

// This is Next.js-specific middleware configuration.
export const config = {

  matcher: [

    // Match all routes
    "/:path*"

  ]

}

