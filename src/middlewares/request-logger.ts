// ./src/middlewares/request-logger.ts

import {
  type NextRequest,
  type NextFetchEvent,
  NextResponse
} from "next/server"

import type MiddlewareFactory from '@/types/MiddlewareFactory'
import type CustomMiddleware from '@/types/CustomMiddleware'

import { getClientIp } from "@/lib/utils"

// Request logger middleware
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

    const timestamp = new Date().toISOString()

    // Get the IP address using our utility function
    const ip = getClientIp(request)

    console.log(`[${timestamp}] ${ip} ${request.method} ${request.url}`)

    response.headers.set('X-Logger', 'logged')

    return await nextmw(request, nextFetchEvent, response)

  }

}

export default middleware

