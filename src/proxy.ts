
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import type { ProxyFn } from '@/types/proxy'

import loggerProxy from '@/proxies/loggerProxy'
import headersProxy from '@/proxies/headersProxy'

const proxyChain: ProxyFn[] = [
  loggerProxy,
  headersProxy,
]

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const storage = new Map<string, unknown>()
  let response: NextResponse = NextResponse.next()

  for (const fn of proxyChain) {
    const result = await fn(request, response, storage)

    if (result instanceof NextResponse) {
      // Proxy returned a new response (e.g. redirect/rewrite)
      // Carry over all accumulated headers from previous proxies
      response.headers.forEach((value, key) => {
        if (!result.headers.has(key)) {
          result.headers.set(key, value)
        }
      })
      response = result
    }
    // If void: proxy mutated response directly, nothing to do
  }

  return response
}

export default proxy

// This is Next.js-specific proxy configuration.
export const config = {
  // Match all routes
  matcher: ['/:path*'],
}

