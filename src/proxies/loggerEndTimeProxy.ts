
import {
  type NextRequest,
} from "next/server"

import {
  type NextMiddleware,
  type NemoEvent
} from '@rescale/nemo'

import { getClientIp } from "@/lib/utils"

export const loggerEndTimeProxy: NextMiddleware = async (
   
  request: NextRequest, event: NemoEvent
) => {

  const endTime: number = Date.now()
  const startTime: number = event.storage.get<number>("startTime") || 0

  if(!startTime) {
    throw new Error('loggerEndTimeMiddleware.ts should run after loggerStartTimeMiddleware.ts')
  }

  const elapedTime = endTime - startTime
  const nowDate = new Date(endTime).toISOString()

  const ip = getClientIp(request)

  const { method, url } = request

  console.log(`[${nowDate}] ${elapedTime}ms ${ip} ${method} ${url}`)

}

export default loggerEndTimeProxy

