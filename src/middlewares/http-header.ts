// ./src/middlewares/http-header.ts

import {
  type NextRequest,
  type NextFetchEvent,
  NextResponse
} from "next/server"

import type MiddlewareFactory from '@/types/MiddlewareFactory'
import type CustomMiddleware from '@/types/CustomMiddleware'

import { getClientIp } from "@/lib/utils"

// Http header middleware
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

    // Get the IP address using our utility function
    const ip = getClientIp(request)

    const now = Date.now().toString()
    const dateString = new Date().toString()
    const isoString = new Date().toISOString()

    response.headers.set('X-Hello', 'Hello World')

    response.headers.set('X-Server-Timestamp', now)
    response.headers.set('X-Server-Date', dateString)
    response.headers.set('X-Server-ISO-Date', isoString)

    response.headers.set('X-Client-IP', ip)

    return await nextmw(request, nextFetchEvent, response)

  }

}

export default middleware

