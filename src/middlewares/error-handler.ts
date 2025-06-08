// src/middlewares/error-handler.ts

import {
  type NextRequest,
  type NextFetchEvent,
  NextResponse
} from "next/server"

import type MiddlewareFactory from '@/types/MiddlewareFactory'
import type CustomMiddleware from '@/types/CustomMiddleware'

// Error handler middleware
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

    try {

      // Call the next middleware and pass the request and response
      response = await nextmw(request, nextFetchEvent, response)
      response.headers.set("X-Errot-Handler", "No Error")
      return response

    } catch (error) {

      console.error(error)
      const clonedHeaders = new Headers()
      response.headers.forEach((value, key) => {
        clonedHeaders.append(key, value)
      })
      response = new NextResponse(
        JSON.stringify({
          error: `Interbal Server Error` 
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          },
        }
      )
      clonedHeaders.forEach((value, key) => {
        // Skip headers that might conflict with the error response
        // List of headers to skip when copying to error response
        const SKIP_HEADERS = new Set([
          "content-length",      // Body size changes in error response
          "etag",                // ETag is tied to original content
          "age",                 // Age is tied to original cache
          "cache-control",       // Cache-Control may not apply to errors
          "expires",             // Expires is tied to original content
          "last-modified"        // Last-Modified is tied to original content
        ])
        if (!SKIP_HEADERS.has(key.toLowerCase())) {
          response.headers.set(key, value)
        }
      })
      response.headers.set("X-Errot-Handler", "With Error 500")
      return response

    }

  }

}

export default middleware

