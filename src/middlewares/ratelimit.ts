// src/middlewares/ratelimit.ts

import {
  type NextRequest,
  type NextFetchEvent,
  NextResponse
} from "next/server"

import type MiddlewareFactory from '@/types/MiddlewareFactory'
import type CustomMiddleware from '@/types/CustomMiddleware'

import {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_SIZE,
  RATE_LIMIT_CLEANUP_INTERVAL
} from "@/lib/config"

import { getClientIp } from "@/lib/utils"

// In-memory store for rate limiting
const store = new Map<string, { count: number; resetTime: number }>()

// Last Cleanup
let lastCleanup = Date.now()

// Function to clean up expired entries
function cleanupExpiredEntries() {
  const now = Date.now()
  if (now - lastCleanup < RATE_LIMIT_CLEANUP_INTERVAL) return
  lastCleanup = now
  for (const [ip, data] of store.entries()) {
    if (now > data.resetTime) {
      store.delete(ip)
    }
  }
}

// Helper function to add rate limit headers
function addRateLimitHeaders(
  response: NextResponse,
  headers: {
    limit: number
    remaining: number
    reset: number
  }
): NextResponse {
  response.headers.set('X-RateLimit-Limit', headers.limit.toString())
  response.headers.set('X-RateLimit-Remaining', headers.remaining.toString())
  response.headers.set('X-RateLimit-Reset', headers.reset.toString())
  // Add Retry-After header when rate limited (handled in the 429 case)
  if (response.status === 429) {
    const retryAfter = Math.ceil((headers.reset - Date.now()) / 1000)
    response.headers.set('Retry-After', retryAfter.toString())
  }
  return response
}

// Rate limit middleware
export const middleware: MiddlewareFactory = (
  nextmw: CustomMiddleware
) => {

  return async (
    request: NextRequest,
    nextFetchEvent: NextFetchEvent,
    response: NextResponse
  ) => {

    // The first middleware in the chain is responsible for creating the
    // response object and passing it down the chain.
    // Subsequent middlewares can also initialize/re-initialize
    // the response if a previous middleware cleared it.
    response = response ? response : NextResponse.next()

    // Run cleanup periodically
    cleanupExpiredEntries()

    // Get the IP address using our utility function
    const ip = getClientIp(request)

    const now = Date.now()

    // Check if this IP is in our rate limit map
    if (!store.has(ip)) {
      const resetTime: number = now + RATE_LIMIT_WINDOW_SIZE * 1000
      // First request from this IP
      store.set(ip, {
        count: 1,
        resetTime,
      })
      response = addRateLimitHeaders(response, {
        limit: RATE_LIMIT_MAX_REQUESTS,
        remaining: RATE_LIMIT_MAX_REQUESTS - 1,
        reset: resetTime
      })
      return await nextmw(request, nextFetchEvent, response)
    }

    // Get the rate limit data for this IP
    const rateLimitData = store.get(ip)!

    // Check if the window has expired
    if (now > rateLimitData.resetTime) {
      const resetTime: number = now + RATE_LIMIT_WINDOW_SIZE * 1000
      // Reset the counter
      store.set(ip, {
        count: 1,
        resetTime,
      })
      response = addRateLimitHeaders(response, {
        limit: RATE_LIMIT_MAX_REQUESTS,
        remaining: RATE_LIMIT_MAX_REQUESTS - 1,
        reset: resetTime
      })
      return await nextmw(request, nextFetchEvent, response)
    }

    // Check if the IP has exceeded the rate limit
    if (rateLimitData.count >= RATE_LIMIT_MAX_REQUESTS) {
      // Return a 429 Too Many Requests response
      response = new NextResponse(
        JSON.stringify({ error: "Too many requests, please try again later" }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json"
          },
        }
      )
      response = addRateLimitHeaders(response, {
        limit: RATE_LIMIT_MAX_REQUESTS,
        remaining: 0,
        reset: rateLimitData.resetTime
      })
      return await nextmw(request, nextFetchEvent, response)
    }

    // Increment the counter
    rateLimitData.count += 1
    store.set(ip, rateLimitData)

    response = addRateLimitHeaders(response, {
      limit: RATE_LIMIT_MAX_REQUESTS,
      remaining: RATE_LIMIT_MAX_REQUESTS - rateLimitData.count,
      reset: rateLimitData.resetTime
    })
    return await nextmw(request, nextFetchEvent, response)

  }
}

export default middleware

