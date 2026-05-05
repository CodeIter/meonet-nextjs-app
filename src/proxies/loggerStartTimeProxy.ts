
import type { NextRequest } from 'next/server'

import type { ProxyFn } from '@/types/proxy'

import { getClientIp } from '@/lib/utils'

export const loggerStartTimeProxy: ProxyFn = async (request: NextRequest, storage) => {
  const startTime = Date.now()
  storage.set('startTime', startTime)
  const ip = getClientIp(request)
  const { method, url } = request
  console.log(`[${new Date(startTime).toISOString()}] ${ip} ${method} ${url}`)
}

export default loggerStartTimeProxy

