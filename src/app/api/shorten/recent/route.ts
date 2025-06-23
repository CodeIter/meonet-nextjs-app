
import { NextResponse } from "next/server"

import { urlShortenerDB } from "@/lib/storage"

export async function GET() {

  if (!urlShortenerDB) {
    return NextResponse.json(
      { error: "Storage is not available" },
      { status: 503 } // Service Unavailable
    )
  }

  try {

    const result = await urlShortenerDB.list('*')

    // Convert Map to array and omit IP field
    // Extract and format URLs
    const urls = result.data
      .map((item) => ({
        shortCode: item.short_code,
        url: item.original_url,
        timestamp: new Date(item.created_at),
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)

    return NextResponse.json({ urls })

  } catch (err: unknown) {
    console.error(err)
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 })
  }

}

