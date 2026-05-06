
import type { NextRequest, NextResponse } from 'next/server'

import type { ProxyFn } from '@/types/proxy'

import { getClientIp } from '@/lib/utils'

export const headersProxy: ProxyFn = async (request: NextRequest, response: NextResponse, _storage) => {
  const ip = getClientIp(request)
  const now = Date.now()

  response.headers.set('X-Server-Timestamp', now.toString())
  response.headers.set('X-Server-Date', new Date(now).toString())
  response.headers.set('X-Server-ISO-Date', new Date(now).toISOString())
  response.headers.set('X-Client-IP', ip)

  // no return — mutates shared response directly

}

export default headersProxy

