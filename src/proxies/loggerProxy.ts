
import type { NextRequest, NextResponse } from 'next/server'

import type { ProxyFn } from '@/types/proxy'

import { getClientIp } from '@/lib/utils'

export const loggerProxy: ProxyFn = async (request: NextRequest, _response: NextResponse, _storage) => {
  const ip = getClientIp(request)
  const { method, url } = request
  console.log(`[${new Date().toISOString()}] ${ip} ${method} ${url}`)
}

export default loggerProxy

