import { NextRequest } from 'next/server'

import { getClientIp } from "@/lib/utils"

export async function GET(request: NextRequest) {
  // Get IP address from headers
  const ip = getClientIp(request)
  return Response.json({ ip })
}
