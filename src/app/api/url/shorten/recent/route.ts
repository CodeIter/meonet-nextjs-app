
import { type NextRequest, NextResponse } from "next/server"

import { getClientIp } from "@/lib/utils"

import { BASE_URL } from "@/lib/config"

import { urlShortenerDB } from "@/lib/storage"

export async function GET(request: NextRequest) {

  if (!urlShortenerDB) {
    return NextResponse.json(
      { error: "Storage is not available" },
      { status: 503 } // Service Unavailable
    )
  }

  // Get IP address from headers
  const ip = getClientIp(request)

  try {

    const result = await urlShortenerDB.findRecentByIP(ip)

    // Convert Map to array and omit IP field
    // Extract and format URLs
    const urls = result.data
      .filter(item => item.ip === ip)
      .map((item) => ({
        shortCode: item.short_code,
        shortUrl: `${BASE_URL}/r/${item.short_code}`,
        url: item.original_url,
        timestamp: new Date(item.created_at),
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    return NextResponse.json({ urls })

  } catch (err: unknown) {
    console.error(err)
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 })
  }

}

