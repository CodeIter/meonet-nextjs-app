
import {
  type NextRequest,
  NextResponse
} from "next/server"

import {
  type NextMiddleware,
  type NemoEvent,
} from '@rescale/nemo'

import { getClientIp } from "@/lib/utils"

export const middleware: NextMiddleware = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  request: NextRequest, event: NemoEvent
) => {

  const ip = getClientIp(request)

  const now = Date.now().toString()
  const dateString = new Date().toString()
  const isoString = new Date().toISOString()

  const newHeaders = new Headers(request.headers)
  const response = NextResponse.next({
    request: {
      headers: newHeaders
    }
  })

  response.headers.set('X-Hello', 'Hello World')

  response.headers.set('X-Server-Timestamp', now)
  response.headers.set('X-Server-Date', dateString)
  response.headers.set('X-Server-ISO-Date', isoString)

  response.headers.set('X-Client-IP', ip)

  // Set security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response

}

export default middleware

