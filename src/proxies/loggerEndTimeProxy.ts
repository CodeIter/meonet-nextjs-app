
import type { NextRequest } from 'next/server'

import type { ProxyFn } from '@/types/proxy'

import { getClientIp } from '@/lib/utils'

export const loggerEndTimeProxy: ProxyFn = async (request: NextRequest, storage) => {
  const endTime = Date.now()
  const startTime = storage.get('startTime') as number | undefined

  if (!startTime) {
    throw new Error('loggerEndTimeProxy must run after loggerStartTimeProxy')
  }

  const ip = getClientIp(request)
  const { method, url } = request
  console.log(`[${new Date(endTime).toISOString()}] ${endTime - startTime}ms ${ip} ${method} ${url}`)
}

export default loggerEndTimeProxy

