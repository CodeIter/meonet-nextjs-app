// src/middlewares/error-handler.ts

import {
  type NextRequest,
  type NextFetchEvent,
  NextResponse
} from "next/server"

import type MiddlewareFactory from '@/types/MiddlewareFactory'

import type CustomMiddleware from '@/types/CustomMiddleware'

// init: first middleware
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

    response.headers.set("X-Init", "Initialized")

    // Call the next middleware and pass the request and response
    return await nextmw(request, nextFetchEvent, response)

  }

}

export default middleware

