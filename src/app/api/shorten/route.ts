
import { NextRequest, NextResponse } from "next/server"

import { generateShortCode } from "@/lib/utils"
import { getClientIp } from "@/lib/utils"
import { urlShortenerDB } from "@/lib/storage"

export async function POST(request: NextRequest) {

  if (!urlShortenerDB) {
    return NextResponse.json(
      { error: "Storage is not available" },
      { status: 503 } // Service Unavailable
    )
  }

  const { url } = await request.json()

  // Get IP address from headers
  const ip = getClientIp(request)

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    new URL(url); // Validate URL format
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  const shortCode = generateShortCode()
  const timestamp = new Date()

  try {

    // Add to store (will auto-evict old entries if needed)
    await urlShortenerDB.set(shortCode, {
      short_code: shortCode,
      original_url: url,
      ip,
      created_at: timestamp.toISOString()
    })

    return NextResponse.json({ shortCode })

  } catch (err: unknown) {
    console.error(err)
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 })
  }

}

