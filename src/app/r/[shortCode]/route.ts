
import { NextRequest, NextResponse } from "next/server"

import { urlShortenerDB } from "@/lib/storage"

interface ContextProps {
  params: Promise<{ shortCode: string }>
}

export async function GET(
  request: NextRequest,
  { params }: ContextProps
) {

  if (!urlShortenerDB) {
    return NextResponse.json(
      { error: "Storage is not available" },
      { status: 503 } // Service Unavailable
    )
  }

  const { shortCode } = await params

  try {

    const entry = await urlShortenerDB.get(shortCode)

    if (!entry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Increment hit count
    await urlShortenerDB.supabase
      .from("urlshortener")
      .update({ hit_count: (entry.hit_count || 0) + 1 })
      .eq("short_code", shortCode)

    return NextResponse.redirect(entry.original_url)

  } catch (err: unknown) {
    console.error(err)
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 })
  }

}

