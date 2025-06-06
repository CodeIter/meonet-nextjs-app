// ./src/middlewares/http-header.ts

import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getClientIp } from "@/lib/utils"

// http header middleware
export function handler(request: NextRequest) {

  // Get the IP address using our utility function
  const ip = getClientIp(request)

  const now = Date.now().toString()
  const dateString = new Date().toString()
  const isoString = new Date().toISOString()

  const response = NextResponse.next()

  response.headers.set('X-Hello', 'Hello World')

  response.headers.set('X-Server-Timestamp', now)
  response.headers.set('X-Server-Date', dateString)
  response.headers.set('X-Server-ISO-Date', isoString)

  response.headers.set('X-Client-IP', ip)

  return response

}

// This is different from the Next.js-specific middleware matcher
// configuration.
export const matcher = [

  // Match all routes by default
  // or Match only certain routes

  ///^\/api(?:\/.*)?$/

]

export const middleware = {

  handler,

  matcher

}

export default middleware

