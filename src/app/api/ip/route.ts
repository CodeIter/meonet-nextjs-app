import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Get IP address from headers
  const ip = request.headers.get("x-forwarded-for") ||
             request.headers.get("x-real-ip") ||
             request.headers.get("cf-connecting-ip") ||
             "unknown"
  return Response.json({ ip })
}
