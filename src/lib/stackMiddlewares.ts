
import {
  type NextRequest,
  type NextResponse,
  type NextFetchEvent,
} from "next/server"

import type CustomMiddleware from '@/types/CustomMiddleware'
import type MiddlewareFactory from '@/types/MiddlewareFactory'

export function stackMiddlewares(
  functions: MiddlewareFactory[] = [],
  index: number = 0
): CustomMiddleware {

  const current: MiddlewareFactory | undefined = functions[index]

  if (current) {
    const next: CustomMiddleware = stackMiddlewares(functions, index + 1)
    return current(next)
  }

  return (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    return response
  }

}

export default stackMiddlewares

