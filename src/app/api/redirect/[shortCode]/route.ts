
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

  const entry = await urlShortenerDB.get(shortCode)

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.redirect(entry.url)

}

