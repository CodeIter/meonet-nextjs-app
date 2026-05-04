
import {
  type NextRequest,
} from "next/server"

import {
  type NextMiddleware,
  type NemoEvent
} from '@rescale/nemo'

import { getClientIp } from "@/lib/utils"

export const loggerStartTimeProxy: NextMiddleware = async (
   
  request: NextRequest, event: NemoEvent
) => {

  const startTime = Date.now()

  const nowDate = new Date(startTime).toISOString()

  event.storage.set<number>("startTime", startTime)

  const ip = getClientIp(request)

  const { method, url } = request

  console.log(`[${nowDate}] ${ip} ${method} ${url}`)

}

export default loggerStartTimeProxy

