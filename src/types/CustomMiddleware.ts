
import {
  type NextRequest,
  type NextFetchEvent,
  type NextResponse
} from "next/server"

import type NextMiddlewareResult from '@/types/NextMiddlewareResult'

export type CustomMiddleware = (
  request: NextRequest,
  event: NextFetchEvent,
  response: NextResponse
) => NextMiddlewareResult | Promise<NextMiddlewareResult>

export default CustomMiddleware

