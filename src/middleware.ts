
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { config as rateLimitConfig } from "@/lib/config"
import { getClientIp } from "@/lib/utils"

// In-memory store for rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>()

export function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Get the IP address using our utility function
  const ip = getClientIp(request)
  const now = Date.now()

  // Check if this IP is in our rate limit map
  if (!rateLimit.has(ip)) {
    // First request from this IP
    rateLimit.set(ip, {
      count: 1,
      resetTime: now + rateLimitConfig.RATE_LIMIT.WINDOW_SIZE * 1000,
    })
    return NextResponse.next()
  }

  // Get the rate limit data for this IP
  const rateLimitData = rateLimit.get(ip)!

  // Check if the window has expired
  if (now > rateLimitData.resetTime) {
    // Reset the counter
    rateLimit.set(ip, {
      count: 1,
      resetTime: now + rateLimitConfig.RATE_LIMIT.WINDOW_SIZE * 1000,
    })
    return NextResponse.next()
  }

  // Check if the IP has exceeded the rate limit
  if (rateLimitData.count >= rateLimitConfig.RATE_LIMIT.MAX_REQUESTS) {
    // Return a 429 Too Many Requests response
    return new NextResponse(JSON.stringify({ error: "Too many requests, please try again later" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.ceil((rateLimitData.resetTime - now) / 1000)),
      },
    })
  }

  // Increment the counter
  rateLimitData.count += 1
  rateLimit.set(ip, rateLimitData)

  return NextResponse.next()
}

// Only run the middleware on API routes
export const config = {
  matcher: [

    // Match all routes by default

  ],
}

